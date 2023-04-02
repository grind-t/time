export interface Timeout {
  id: NodeJS.Timeout | number;
  ms: number;
  startedAt: number;
}

export interface TimeoutData {
  deltaTime: number;
  totalError: number;
  error: number;
  hiddenIntervals: number;
  nextTimeout: number;
}

export type TimeoutCallback = (data: TimeoutData) => void;

export function startTimeout(
  cb: TimeoutCallback,
  ms: number,
  interval = ms
): Timeout {
  let startedAt = Date.now();

  return {
    id: setTimeout(() => {
      const deltaTime = Date.now() - startedAt;
      const totalError = deltaTime - ms;
      const error = totalError % interval;
      const hiddenIntervals = totalError - error;
      const nextTimeout = interval - error;
      cb({ deltaTime, totalError, error, hiddenIntervals, nextTimeout });
    }, ms),
    ms,
    startedAt,
  };
}

export function stopTimeout(timeout: Timeout): number {
  const deltaTime = Date.now() - timeout.startedAt;
  const remaining = timeout.ms - deltaTime;
  clearTimeout(timeout.id);
  return Math.max(0, remaining);
}
