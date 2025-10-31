import { BusInterface } from './types/bus-interface';
import { EventNames, EventPayload } from './types/common-types';

type EmitOutcome = { ok: true; value: unknown } | { ok: false; error: unknown };

/**
 * A tiny strongly-typed event emitter.
 *
 * The emitter is generic over an event map `T` where keys are event names and
 * values are the payload types for those events. Use `void` as the payload
 * type for events that don't carry data.
 *
 * Example:
 *   interface AppEvents {
 *     'user:login': { id: string };
 *     'app:ready': void;
 *   }
 *   const bus = new TypedEventEmitter<AppEvents>();
 */

export class TypedEventEmitter<T = Record<string, unknown>>
  implements BusInterface<T>
{
  // Internally keys are stored as strings to align with the runtime Map.
  private listeners = new Map<string, Set<(payload: unknown) => unknown>>();

  /**
   * Remove a specific listener for an event.
   *
   * @typeParam K - Event name from the event map `T`.
   * @param event - The event name to remove the listener from.
   * @param listener - The previously-registered listener function to remove.
   * @returns True if the listener was found and removed; false otherwise.
   *
   * Notes: a listener must be the same reference that was passed to `on` to
   * be successfully removed.
   */
  public off<K extends EventNames<T>>(
    event: K,
    listener: (payload: EventPayload<T, K>) => void
  ): boolean {
    const key = String(event);
    const set = this.listeners.get(key);
    if (!set) {
      return false;
    }

    const removed = set.delete(listener as (payload: unknown) => unknown);
    if (set.size === 0) this.listeners.delete(key);
    return removed;
  }

  /**
   * Subscribe to an event for a single invocation.
   *
   * The provided listener will be invoked at most once and is removed
   * automatically after the first invocation.
   *
   * @returns an unsubscribe function equivalent to calling `off` with the
   * same listener.
   */
  public once<K extends EventNames<T>>(
    event: K,
    listener: (payload: EventPayload<T, K>) => void
  ): () => void {
    const unsubscribe = this.on(event, (payload) => {
      try {
        listener(payload as EventPayload<T, K>);
      } finally {
        unsubscribe();
      }
    });
    return unsubscribe;
  }

  /**
   * Remove listeners.
   *
   * When called with an `event` argument, removes all listeners for that
   * event. When called with no arguments, removes all listeners for all
   * events (useful in tests or when tearing down long-lived services).
   *
   * @param event - Optional event name whose listeners should be removed.
   */
  public clear<K extends EventNames<T>>(event?: K) {
    if (event === undefined) {
      this.listeners.clear();
    } else {
      this.listeners.delete(String(event));
    }
  }

  /**
   * Return the number of listeners currently registered for `event`.
   *
   * @param event - The event name to inspect.
   * @returns The number of registered listeners (>= 0).
   */
  public listenerCount<K extends EventNames<T>>(event: K): number {
    const set = this.listeners.get(String(event));
    return set ? set.size : 0;
  }

  /**
   * Check whether any listeners are registered for `event`.
   *
   * @param event - The event name to check.
   * @returns True when one or more listeners exist for the given event.
   */
  public hasListeners<K extends EventNames<T>>(event: K) {
    return this.listenerCount(event) > 0;
  }

  /**
   * Register a listener for the specified event.
   *
   * @param event - The event name to subscribe to.
   * @param listener - Function called with the event payload when the event
   *                   is emitted. If the event payload type is `void`, the
   *                   listener will be called with `undefined`.
   * @returns An unsubscribe function that will remove the registered
   * listener when invoked.
   */
  public on<K extends EventNames<T>>(
    event: K,
    listener: (payload: EventPayload<T, K>) => void
  ): () => void {
    const key = String(event);
    if (!this.listeners.has(key)) this.listeners.set(key, new Set());
    const set = this.listeners.get(key)!;
    set.add(listener as (payload: unknown) => unknown);
    return () => {
      set.delete(listener as (payload: unknown) => unknown);
      if (set.size === 0) this.listeners.delete(key);
    };
  }

  /**
   * Emit an event with the given payload.
   *
   * If the event's payload type is `void`, the payload argument may be
   * omitted. All registered listeners for the event will be invoked
   * synchronously in insertion order.
   *
   * @param event - The event name to emit.
   * @param payload - The event payload. Omit for `void` payloads.
   */
  public emit<K extends EventNames<T>>(
    event: K,
    ...payload: EventPayload<T, K> extends void
      ? [payload?: EventPayload<T, K>]
      : [payload: EventPayload<T, K>]
  ) {
    const key = String(event);
    const set = this.listeners.get(key);
    if (set) {
      const data = payload[0];
      // Iterate over listeners snapshot to avoid issues if a listener
      // modifies the set during iteration.
      const listeners = Array.from(set);
      listeners.forEach((l) => l(data));
    }
  }

  /**
   * Emit an event and await all listeners concurrently.
   *
   * Each listener's return value (or thrown/rejected error) is captured in
   * the returned array in registration order. The method never rejects;
   * callers inspect each entry to determine success or failure.
   */
  public async emitAsync<K extends EventNames<T>>(
    event: K,
    ...payload: EventPayload<T, K> extends void
      ? [payload?: EventPayload<T, K>]
      : [payload: EventPayload<T, K>]
  ): Promise<EmitOutcome[]> {
    const key = String(event);
    const set = this.listeners.get(key);
    if (!set) return [] as EmitOutcome[];
    const data = payload[0];
    const listeners = Array.from(set);

    const promises = listeners.map((l) =>
      Promise.resolve()
        .then(() => l(data))
        .then(
          (v) => ({ ok: true as const, value: v }),
          (e: unknown) => ({ ok: false as const, error: e })
        )
    );

    return Promise.all(promises) as Promise<EmitOutcome[]>;
  }
}
