import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { Timer } from "./timer";

const second = 1000;
const handler = vi.fn();
const timer = new Timer(handler, second);

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(0);
});

afterEach(() => {
  timer.reset();
  vi.restoreAllMocks();
});

it("should tick with interval", () => {
  timer.start();
  vi.advanceTimersByTime(2 * second);
  expect(handler).toBeCalledTimes(2);
});

it("should tick with error", () => {
  const error = 300;
  timer.start();
  vi.setSystemTime(second - error);
  vi.advanceTimersByTime(2 * second - error);
  expect(handler).toBeCalledTimes(2);
});

it("should tick after stop", () => {
  timer.start();
  vi.advanceTimersByTime(second - 300);
  timer.stop();
  vi.setSystemTime(10 * second);
  timer.start();
  vi.advanceTimersByTime(300);
  expect(handler).toBeCalledTimes(1);
});
