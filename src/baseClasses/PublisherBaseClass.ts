import { FailedEventTypes, SuccessfulEventTypes } from "../utils/types";

export interface PublisherInterface<R> {
  publishEvent: (event: SuccessfulEventTypes<R> | FailedEventTypes) => void;
}
