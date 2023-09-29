import { FailedEvents, Subscriber } from "../utils/types";
import { NetworkConfigsBaseClass } from "../baseClasses/NetworkConfigsBaseClass";

export class Retry<P, R> extends NetworkConfigsBaseClass<P, R> {
  private _retryLimit: number;

  constructor(retryLimit: number, subscribers: Subscriber<R>[], metadata: any) {
    super(subscribers, metadata);
    this._retryLimit = retryLimit;
  }

  async execute(func: (args: P) => Promise<R>, args: P): Promise<R> {
    let err;
    for (let i = 0; i < this._retryLimit; i++) {
      try {
        return await func(args);
      } catch (error) {
        err = error;
      }
    }
    this.publishEvent({ event: FailedEvents.LimitReached, error: err });
    throw Error(`Retry Limit Reached for ${this._retryLimit}!`);
  }
}
