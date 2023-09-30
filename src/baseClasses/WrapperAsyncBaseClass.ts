import {
  FailedEventTypes,
  Subscriber,
  SuccessfulEventTypes,
} from "../utils/types";
import { Publisher } from "../entities/Publisher";

export abstract class WrapperAsyncBaseClass<P, R> {
  private _publisher: Publisher<R>;

  abstract execute(func: (args: P) => Promise<R>, args: P): Promise<R>;

  constructor(subscribers: Subscriber<R>[], metadata: any) {
    this._publisher = new Publisher<R>(subscribers, metadata);
  }

  publishEvent(event: SuccessfulEventTypes<R> | FailedEventTypes) {
    this._publisher.publishEvent(event);
  }
}
