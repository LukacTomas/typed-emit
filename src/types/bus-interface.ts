import { EventNames, EventPayload } from './common-types';

export type EmitOutcome =
  | { ok: true; value: unknown }
  | { ok: false; error: unknown };

/**
 * Minimal public interface for a typed event bus.
 *
 * Implementations should provide at least `on` and `emit`. `on` returns an
 * unsubscribe function for convenience. This type is used by consumer code to
 * depend on the emitter behaviour without importing the concrete class.
 *
 * @typeParam T - Event map where keys are event names and values are payload
 * types for those events.
 */

export type BusInterface<T = Record<string, unknown>> = {
  on<K extends EventNames<T>>(
    event: K,
    listener: (payload: EventPayload<T, K>) => void
  ): () => void;
  emit<K extends EventNames<T>>(
    event: K,
    ...payload: EventPayload<T, K> extends void
      ? [payload?: EventPayload<T, K>]
      : [payload: EventPayload<T, K>]
  ): void;
  emitAsync<K extends EventNames<T>>(
    event: K,
    ...payload: EventPayload<T, K> extends void
      ? [payload?: EventPayload<T, K>]
      : [payload: EventPayload<T, K>]
  ): Promise<EmitOutcome[]>;
  off<K extends EventNames<T>>(
    event: K,
    listener: (payload: EventPayload<T, K>) => void
  ): boolean;
  once<K extends EventNames<T>>(
    event: K,
    listener: (payload: EventPayload<T, K>) => void
  ): () => void;
  listenerCount<K extends EventNames<T>>(event: K): number;
};
