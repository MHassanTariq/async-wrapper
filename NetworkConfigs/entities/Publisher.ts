import { PublisherInterface } from "../baseClasses/PublisherBaseClass";
import {
  FailedEventTypes,
  Subscriber,
  SuccessfulEventTypes,
} from "../utils/types";

export class Publisher<R> implements PublisherInterface<R> {
  private _subscribers: Subscriber<R>[];
  private _metadata: any;

  constructor(subscribers: Subscriber<R>[], metadata: any) {
    this._subscribers = subscribers;
    this._metadata = metadata;
  }

  publishEvent(event: FailedEventTypes | SuccessfulEventTypes<R>) {
    this._subscribers.forEach((subscriber) => {
      subscriber.onEvent({ ...event, metadata: this._metadata });
    });
  }
}
