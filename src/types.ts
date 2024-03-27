import { DependencyList } from 'react';

import { HubConnection } from '@microsoft/signalr';

/**
 * Represents a subscription object.
 */
export interface ISubscriptions {
  /**
   * The method associated with the subscription.
   */
  method: string;

  /**
   * The action to be performed when the subscription is triggered.
   * @param args - The arguments passed to the action.
   */
  action: (...args: any[]) => void;
}

/**
 * Represents the base configuration for the web socket.
 */
export interface IBaseConfig {
  /**
   * A middleware function that can be used to modify the subscriptions before they are sent to the server.
   * Notice: This middleware will be called only for actions created by the useSocket hook.
   *
   * @param action - The subscriptions to be modified.
   * @returns The modified subscriptions.
   */
  middleware?: (action: ISubscriptions) => ISubscriptions;

  /**
   * A callback function that is called when a subscription is made.
   * @param action - The subscription that was made.
   */
  onSubscribe?: (action: ISubscriptions) => void;

  /**
   * A callback function that is called when a subscription was unsubscribe.
   * @param action - The subscription that was unsubscribe.
   */
  onUnsubscribe?: (action: ISubscriptions) => void;

  /**
   * A callback function that is called when there is an error in the establish connection.
   * @param error - The error that occurred.
   */
  onConnectionError?: (error: Error) => void;
}

export type ConnectionType = HubConnection;

/**
 * Represents a hook that can be used to create a listener function to a socket.
 *
 * @param actionsFactory a function that returns an array of subscriptions or a single subscription.
 * @param deps An array of dependencies that the connection depends on.
 * @returns The connection object of type ConnectionType, or null if the connection is not available.
 */
export type UseSocket<ConnectionType> = (
  actionsFactory: () => ISubscriptions[] | ISubscriptions,
  deps: DependencyList,
) => ConnectionType | null;
