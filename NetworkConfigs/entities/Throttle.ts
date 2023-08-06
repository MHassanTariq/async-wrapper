import { FailedEvents, Subscriber } from "../utils/types";
import { NetworkConfigsBaseClass } from "../baseClasses/NetworkConfigsBaseClass";

export class Throttle<P, R> extends NetworkConfigsBaseClass<P, R> {
  private _throttleLimit: number;

  constructor(
    throttleLimit: number,
    subscribers: Subscriber<R>[],
    metadata: any
  ) {
    super(subscribers, metadata);
    this._throttleLimit = throttleLimit;
  }

  async execute(func: (args: P) => Promise<R>, args: P): Promise<R> {
    let err;
    for (let i = 0; i < this._throttleLimit; i++) {
      try {
        return await func(args);
      } catch (error) {
        err = error;
      }
    }
    this.publishEvent({ event: FailedEvents.LimitReached, error: err });
    throw Error(`Throttle Limit Reached for ${this._throttleLimit}!`);
  }
}
