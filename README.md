# TypedEmit

A type-safe event emitter library for TypeScript that provides compile-time type checking for event names and their arguments.

## Features

- 🔒 **Type Safety**: Full TypeScript support with compile-time type checking
- 🎯 **Event Typing**: Define event schemas with precise argument types
- 🚀 **Zero Dependencies**: Lightweight with no external dependencies
- 📝 **IDE Support**: Excellent autocomplete and IntelliSense
- 🧪 **Well Tested**: Comprehensive test suite with 100% coverage

````markdown
# typed-emit

A small, dependency-free TypeScript library that provides a strongly-typed event emitter and a few related type utilities.

This repository implements:

- `TypedEventEmitter<T>` — a tiny, generic, strongly-typed event emitter class (named export).
- `BusInterface<T>` — a minimal public interface describing the emitter shape (in `src/types/bus-interface.ts`).
- `EventNames<T>` and `EventPayload<T, K>` — helper types for working with event maps (in `src/types/common-types.ts`).
- `UseEventHook<T>` — a convenience React hook type definition for typing event-handler hooks.

All exports are named; import the pieces you need:

```ts
import {
  TypedEventEmitter,
  BusInterface,
  EventNames,
  EventPayload,
  UseEventHook,
} from 'typed-emit';
```
````

Key notes about the implementation

- The emitter is generic over an event map `T` where keys are event names and values are the payload type for that event. Use `void` as the payload type for events with no payload.
- `on(event, listener)` registers a listener and returns an unsubscribe function.
- `off(event, listener)` removes a previously-registered listener and returns a boolean indicating whether removal succeeded.
- `once(event, listener)` registers a one-time listener and returns an unsubscribe function.
- `emit(event, payload?)` emits an event; payload may be omitted when the event's payload type is `void`.
- `listenerCount(event)` and `hasListeners(event)` let you inspect registered listeners. `clear(event?)` removes listeners for an event or all listeners when called without an argument.

Minimal usage example

```ts
// Define event map
interface AppEvents {
  'user:login': { id: string };
  'app:ready': void;
}

const bus = new TypedEventEmitter<AppEvents>();

// Subscribe — `on` returns an unsubscribe function
const unsubscribe = bus.on('user:login', (payload) => {
  console.log('user logged in', payload.id);
});

bus.emit('user:login', { id: 'abc' });

// Remove listener
unsubscribe();

// One-time listener
bus.once('app:ready', () => console.log('ready'));
bus.emit('app:ready');
```

About types and React

- This project also re-exports a small set of types under `src/types/`:
  - `EventNames<T>` and `EventPayload<T, K>` to express event names and payloads.
  - `BusInterface<T>` to depend on the emitter's surface without importing the class.
  - `UseEventHook<T>` is a type-only convenience for consumers building React hooks that subscribe to a bus.

Development & scripts

The repository contains standard scripts for building, testing and linting. Examples:

```bash
npm install
npm run build      # tsc -> dist
npm test           # jest
npm run lint       # eslint
npm run format     # prettier --write
```

Notes

- The runtime emitter has no external runtime dependencies — dev dependencies are used for building and testing.
- The emitter API is intentionally small and synchronous. It is a lightweight building block for applications that need a typed publish/subscribe primitive.

Contributing

Contributions are welcome. Follow the existing repository conventions: tests in `__tests__/`, TypeScript sources in `src/`, and use conventional commits for release automation.

License

MIT

```

```
