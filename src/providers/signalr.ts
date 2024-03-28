import { DependencyList, useEffect, useState } from 'react';

import {
  HttpTransportType,
  HubConnection,
  HubConnectionBuilder,
  HubConnectionState,
  IHttpConnectionOptions,
  LogLevel,
} from '@microsoft/signalr';

import { ISubscriptions as IActions, IBaseConfig, UseSocket } from '../types';

/**
 * Represents the configuration options for SignalR.
 */
export interface ISignalRConfig extends IBaseConfig {
  /**
   * A function that returns the authentication token.
   */
  tokenFactory: () => string;

  /**
   * The connection options for SignalR.
   */
  connectionOptions?: IHttpConnectionOptions;
}

const options: IHttpConnectionOptions = {
  logMessageContent: true,
  skipNegotiation: true,
  transport: HttpTransportType.WebSockets,
  logger: LogLevel.Error,
};

const GetConnection = (url: string, config: ISignalRConfig) => {
  const connection = new HubConnectionBuilder()
    .withUrl(url, {
      ...(config.connectionOptions ?? {}),
      ...options,
      accessTokenFactory: config.tokenFactory,
    })
    .withAutomaticReconnect()
    .build();

  try {
    connection.start();
  } catch (err) {
    config.onConnectionError?.(err);
  }

  return connection;
};

const connections: HubConnection[] = [];
const getMemoizeConnection = (hubUrl: string, config: ISignalRConfig) => {
  let connection = connections.find(it => it.baseUrl === hubUrl);

  if (!connection) {
    connection = GetConnection(hubUrl, config);
    connections.push(connection);
  }

  if (connection.state == HubConnectionState.Disconnected) {
    connection.start();
  }

  return connection;
};

/**
 * Closes all SignalR connections.
 *
 * @returns {Promise<void>} A promise that resolves when all connections are closed.
 */
export const closeAllSingnalrConnections = async () => {
  for (const connection of connections) {
    await connection.stop();
  }

  connections.length = 0;
};

/**
 * Restarts all SignalR connections.
 *
 * @returns {Promise<void>} A promise that resolves when all connections have been restarted.
 */
export const restartAllSingalrConnections = async () => {
  for (const connection of connections) {
    await connection.stop();
    await connection.start();
  }
};

/**
 * Factory function that creates a SignalR socket connection and returns it.
 *
 * @param config - The SignalR configuration object.
 * @param hubEndpoint - The endpoint of the SignalR hub.
 *
 * @returns A function that accepts an actionsFactory and dependencies, and returns the SignalR connection.
 */
export const signalrFactory =
  (config: ISignalRConfig, hubEndpoint: string): UseSocket<HubConnection> =>
  (actionsFactory: () => IActions[] | IActions, deps: DependencyList) => {
    const functions = actionsFactory();
    const actions = !Array.isArray(functions) ? [functions] : functions;

    const { onSubscribe, middleware, onUnsubscribe } = config;
    const [connection, setConnection] = useState<HubConnection | null>(null);

    useEffect(() => {
      const connection = getMemoizeConnection(hubEndpoint, config);
      if (!connection) return;

      setConnection(connection);

      const subscriptions = actions.map(it =>
        middleware != null ? middleware(it) : it,
      );

      subscriptions.forEach(it => {
        onSubscribe?.(it);
        return connection.on(it.method, it.action);
      });

      return () => {
        subscriptions.forEach(it => connection.off(it.method, it.action));
        if (onUnsubscribe) {
          subscriptions.forEach(it => onUnsubscribe(it));
        }
      };
    }, deps);

    return connection;
  };
