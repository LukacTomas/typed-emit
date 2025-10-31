import { EventNames, EventPayload } from '../';

/**
 * Convenience type for React hooks that subscribe to an event bus.
 *
 * The hook accepts an event name and a handler with the correctly-typed
 * payload for that event.
 */

export type UseEventHook<T = Record<string, unknown>> = <
  K extends EventNames<T>,
>(
  eventName: K,
  handler: (payload: EventPayload<T, K>) => void
) => void;
