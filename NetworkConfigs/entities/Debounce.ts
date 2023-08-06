import { FailedEvents, Subscriber } from "../utils/types";
import { NetworkConfigsBaseClass } from "../baseClasses/NetworkConfigsBaseClass";

export class Debounce<P, R> extends NetworkConfigsBaseClass<P, R> {
  private _debouce: number; // ms

  constructor(debounce: number, subscribers: Subscriber<R>[], metadata: any) {
    super(subscribers, metadata);
    this._debouce = debounce;
  }

  async execute(func: (args: P) => Promise<R>, args: P): Promise<R> {
    return new Promise(async (res, rej) => {
      setTimeout(async () => {
        try {
          const data = await func(args);
          res(data);
        } catch (error) {
          this.publishEvent({ event: FailedEvents.Rejected, error });
          rej(error);
        }
      }, this._debouce);
    });
  }
}
