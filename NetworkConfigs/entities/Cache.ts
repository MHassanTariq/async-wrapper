import { NetworkConfigsBaseClass } from "../baseClasses/NetworkConfigsBaseClass";
import { Subscriber, SuccessfulEvents } from "../utils/types";

export class Cache<P, R> extends NetworkConfigsBaseClass<P, R> {
  private _isCacheEnabled: boolean;
  private _inputOutputMap = new Map<string, any>();

  constructor(
    isCacheDisabled: boolean,
    subscribers: Subscriber<R>[],
    metadata: any
  ) {
    super(subscribers, metadata);
    this._isCacheEnabled = isCacheDisabled;
  }

  private createKey(args: P) {
    return JSON.stringify(args);
  }

  execute(func: (args: P) => Promise<R>, args: P): Promise<R> {
    return new Promise((res, rej) => {
      const key = this.createKey(args);

      if (this._isCacheEnabled && this._inputOutputMap.has(key)) {
        const data = this._inputOutputMap.get(key);
        this.publishEvent({ event: SuccessfulEvents.CachedResolve, data });
        return res(data);
      }

      func(args)
        .then((data) => {
          this.publishEvent({ event: SuccessfulEvents.Resolved, data });
          this._inputOutputMap.set(key, data);
          res(data);
        })
        .catch(rej);
    });
  }
}
