import * as Emitter from '../src/index';
import type { BusInterface } from '../src/index';

// Define event types for testing
interface TestEvents {
  message: string;
  data: [number, boolean];
  error: [Error];
  empty: [];
}

describe('TypedEventEmitter', () => {
  let emitter: BusInterface<TestEvents>;

  beforeEach(() => {
    emitter = new Emitter.TypedEventEmitter<TestEvents>();
  });

  describe('on and emit', () => {
    it('should add listener and emit events', () => {
      const mockListener = jest.fn();

      emitter.on('message', mockListener);
      emitter.emit('message', 'test message');

      expect(mockListener).toHaveBeenCalledWith('test message');
      expect(mockListener).toHaveBeenCalledTimes(1);
    });

    it('should handle multiple arguments', () => {
      const mockListener = jest.fn();

      emitter.on('data', mockListener);
      emitter.emit('data', [42, true]);

      expect(mockListener).toHaveBeenCalledWith([42, true]);
    });

    it('should handle events with no arguments', () => {
      const mockListener = jest.fn();

      emitter.on('empty', mockListener);
      emitter.emit('empty', []);

      expect(mockListener).toHaveBeenCalledWith([]);
    });
  });

  describe('off', () => {
    it('should remove specific listener', () => {
      const listener1 = jest.fn();
      const listener2 = jest.fn();

      emitter.on('message', listener1);
      emitter.on('message', listener2);
      emitter.off('message', listener1);
      emitter.emit('message', 'test');

      expect(listener1).not.toHaveBeenCalled();
      expect(listener2).toHaveBeenCalledWith('test');
    });

    it('should handle removing non-existent listener', () => {
      const listener = jest.fn();

      expect(() => {
        emitter.off('message', listener);
      }).not.toThrow();
    });
  });

  describe('once', () => {
    it('should call listener only once', () => {
      const mockListener = jest.fn();

      emitter.once('message', mockListener);
      emitter.emit('message', 'first');
      emitter.emit('message', 'second');

      expect(mockListener).toHaveBeenCalledTimes(1);
      expect(mockListener).toHaveBeenCalledWith('first');
    });
  });

  describe('listenerCount', () => {
    it('should return correct listener count', () => {
      const listener1 = jest.fn();
      const listener2 = jest.fn();

      expect(emitter.listenerCount('message')).toBe(0);

      emitter.on('message', listener1);
      expect(emitter.listenerCount('message')).toBe(1);

      emitter.on('message', listener2);
      expect(emitter.listenerCount('message')).toBe(2);

      emitter.off('message', listener1);
      expect(emitter.listenerCount('message')).toBe(1);
    });
  });
});
