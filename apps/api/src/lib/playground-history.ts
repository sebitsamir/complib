import type { PlaygroundInstance } from "./playground-merge";

export const PLAYGROUND_HISTORY_MAX = 50;

export function cloneInstances(
  instances: PlaygroundInstance[],
): PlaygroundInstance[] {
  return instances.map((i) => ({
    ...i,
    ...(i.variantProps ? { variantProps: { ...i.variantProps } } : {}),
  }));
}

export type PlaygroundHistoryState = {
  past: PlaygroundInstance[][];
  future: PlaygroundInstance[][];
};

export function pushHistory(
  history: PlaygroundHistoryState,
  snapshot: PlaygroundInstance[],
): PlaygroundHistoryState {
  const nextPast = [...history.past, cloneInstances(snapshot)].slice(
    -PLAYGROUND_HISTORY_MAX,
  );
  return { past: nextPast, future: [] };
}

export function undoHistory(
  history: PlaygroundHistoryState,
  current: PlaygroundInstance[],
): {
  history: PlaygroundHistoryState;
  instances: PlaygroundInstance[] | null;
} {
  if (history.past.length === 0) return { history, instances: null };
  const previous = history.past[history.past.length - 1]!;
  return {
    history: {
      past: history.past.slice(0, -1),
      future: [cloneInstances(current), ...history.future],
    },
    instances: cloneInstances(previous),
  };
}

export function redoHistory(
  history: PlaygroundHistoryState,
  current: PlaygroundInstance[],
): {
  history: PlaygroundHistoryState;
  instances: PlaygroundInstance[] | null;
} {
  if (history.future.length === 0) return { history, instances: null };
  const next = history.future[0]!;
  return {
    history: {
      past: [...history.past, cloneInstances(current)],
      future: history.future.slice(1),
    },
    instances: cloneInstances(next),
  };
}
