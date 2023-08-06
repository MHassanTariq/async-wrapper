export enum SuccessfulEvents {
  Resolved = "RESOLVED",
  CachedResolve = "CACHED_RESOLVE",
}

export enum FailedEvents {
  Rejected = "REJECTED",
  LimitReached = "LIMIT_REACHED",
}

export type SuccessfulEventTypes<T> = {
  event: SuccessfulEvents;
  data: T;
};
export type FailedEventTypes = { event: FailedEvents; error: any };

type EventParams<T> = (SuccessfulEventTypes<T> | FailedEventTypes) & {
  metadata: any;
};

export type Subscriber<T> = {
  onEvent: (args: EventParams<T>) => void;
};
