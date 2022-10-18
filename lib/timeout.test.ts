import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { startTimeout, stopTimeout } from "./timeout";

const second = 1000;
const handler = vi.fn();

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(0);
});

afterEach(() => {
  vi.restoreAllMocks();
});

it("should return started timeout", () => {
  const timeout = startTimeout(handler, second);
  expect(timeout.id).toBeDefined();
  expect(timeout.ms).toBe(second);
  expect(timeout.startedAt).toBe(Date.now());
  stopTimeout(timeout);
});

it("should call handler after timeout", () => {
  startTimeout(handler, second);
  vi.advanceTimersByTime(second);
  expect(handler).toBeCalledTimes(1);
  expect(handler).lastCalledWith({
    deltaTime: second,
    totalError: 0,
    hiddenIntervals: 0,
    error: 0,
    nextTimeout: second,
  });
});

it("should call handler after timeout with error", () => {
  const error = 100;
  startTimeout(handler, second);
  vi.setSystemTime(error);
  vi.advanceTimersToNextTimer();
  expect(handler).toBeCalledTimes(1);
  expect(handler).lastCalledWith({
    deltaTime: second + error,
    totalError: error,
    hiddenIntervals: 0,
    error,
    nextTimeout: second - error,
  });
});

it("should call handler after suspended timeout", () => {
  const error = 100;
  const hiddenIntervals = 10 * second;
  startTimeout(handler, second);
  vi.setSystemTime(error + hiddenIntervals);
  vi.advanceTimersToNextTimer();
  expect(handler).toBeCalledTimes(1);
  expect(handler).lastCalledWith({
    deltaTime: hiddenIntervals + error + second,
    totalError: hiddenIntervals + error,
    hiddenIntervals,
    error,
    nextTimeout: second - error,
  });
});

it("should stop running timeout", () => {
  const timeout = startTimeout(handler, second);
  vi.advanceTimersByTime(300);
  const remaining = stopTimeout(timeout);
  vi.advanceTimersByTime(700);
  expect(handler).toBeCalledTimes(0);
  expect(remaining).toBe(700);
});

it("should stop ended timeout", () => {
  const timeout = startTimeout(handler, second);
  vi.advanceTimersByTime(1300);
  const remaining = stopTimeout(timeout);
  expect(remaining).toBe(0);
});
