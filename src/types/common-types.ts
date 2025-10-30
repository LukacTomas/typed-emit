/**
 * Union of valid event name keys for a given event map `T`.
 *
 * Example: for `T = { 'user:login': { id: string } }` the resulting type
 * is `'user:login'`.
 */
export type EventNames<T extends Record<string, any>> = keyof T &
  (string | number | symbol);

// EventPayload<T, K> yields the payload type for event K.
/**
 * Lookup the payload type for event `K` on the event map `T`.
 *
 * If the event maps to `void`, subscribers should expect no payload.
 */
export type EventPayload<
  T extends Record<string, any>,
  K extends EventNames<T>,
> = K extends keyof T ? T[K] : never;
