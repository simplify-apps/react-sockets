# React sockets 🚀

<p align="center">
  <a href="https://github.com/simplify-apps/react-sockets/actions/workflows/publish.yml">
    <img src="https://github.com/simplify-apps/react-sockets/actions/workflows/publish.yml/badge.svg" />
  </a>

  <a href="https://npm.im/@simplify-apps/react-sockets/">
    <img src="https://img.shields.io/npm/v/@simplify-apps/react-sockets.svg" />
  </a>

  <a href="https://www.npmjs.com/package/@simplify-apps/react-sockets">
    <img src="https://badgen.net/npm/dw/@simplify-apps/react-socketsp" />
  </a>

  <a href="https://github.com/simplify-apps/react-sockets/blob/master/LICENSE">
    <img src="https://badgen.now.sh/badge/license/MIT" />
  </a>
  
  <a href="https://bundlephobia.com/result?p=simplify-redux-app">
    <img src="https://badgen.net/bundlephobia/minzip/simplify-redux-app">
  </a>
</p>

🖖 Welcome to React Sockets (RS)! 

This is a modern and lightweight toolkit (less than 2kb) designed for both React and React Native apps. Our goal is to make your work with web sockets as simple as possible.

With RS, you can leave behind the complexities of working with web sockets. It allows you to swiftly create a webhook and utilize it anywhere within your React app.

Currently, our library supports only SignalR, but we have plans to add more web socket providers in the future. So, stay in touch!

This library is actively being used and developed. So, if you have any questions or need help, feel free to ask. We’re here to assist you! 👋

## 📦 Installation

To use SRA in your project, install it via npm:

```
npm i @simplify-apps/react-sockets
```
or by yarn:
```
yarn add @simplify-apps/react-sockets
```

## 🏗️ Usage


### SingnalR integration

As previously mentioned, the main goal of this library is simplicity. To get started, you only need to do two things:
First, create your hook for web sockets with the help of our factory:

```typescript
import { signalrFactory } from '@simplify-apps/react-sockets';

...

const signalrConfig = {
  tokenFactory: ()=> "", // your function that returns token for auth
};

export const useSocket = signalrFactory(
  signalrConfig,
  "<YOUR_SINGLAR_URL>",
);
```

Next, use your hook in your component:

```typescript

useSocket(
  () => [
    {
      method: 'YOUR_METHOD_NAME',
      action: (params) => {
        yourAction(params)
      },
    },
  ],
  [yourAction],
);
```

Yeap, that's all.

It’s important to note that this method is memoized and works like other memoized hooks. When one of the parameters in your dependency list changes, your action will automatically resubscribe to your connections. This makes it easy to keep your web socket connections up-to-date and responsive to changes in your app.

### some useful configuration  

To provide simplicity and flexibility, you can subscribe to such configurations in your web socket factory:

You can create a middleware that will be executed before your subscription is activated.

```typescript
/**
  * A middleware function that can be used to modify the subscriptions before they are sent to the server.
  * Notice: This middleware will be called only for actions created by the useSocket hook.
  *
  * @param action - The subscriptions to be modified.
  * @returns The modified subscriptions.
  */
middleware?: (action: ISubscriptions) => ISubscriptions;
```


You can also have additional actions that will be executed before and after your method is subscribed and unsubscribed.


```typescript
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
```

Lastly, you can subscribe to errors if the connection to your socket was either dropped or not established.


```typescript
/**
 * A callback function that is called when there is an error in the establish connection.
 * @param error - The error that occurred.
 */
onConnectionError?: (error: Error) => void;
```

## ESLint Support and Integration

It’s essential to keep an eye on your dependency list to ensure your actions are subscribed and unsubscribed when a dependency changes. To help with this, we recommend installing eslint-plugin-react-hooks. You can do this by running the following command:

```
npm install eslint-plugin-react-hooks --save-dev
```
or by yarn:
```
yarn add eslint-plugin-react-hooks --dev
```

Next, you’ll need to set it up in your ESLint config file (for example, in .eslintrc). Just add the following:


```json
"react-hooks/exhaustive-deps": ["error", {
    "additionalHooks": "(useSockets)" 
  }],
```

If you’ve created more than one hook for your sockets with our factory, use this instead:

```json
"react-hooks/exhaustive-deps": ["error", {
    "additionalHooks": "(useSockets | useCommunications)" 
  }],
```
And that’s it! Now, your IDE will assist you in ensuring no dependencies are missed in your hook. Happy coding! 🚀


### License

This project is licensed under the MIT License - see the LICENSE file for details.