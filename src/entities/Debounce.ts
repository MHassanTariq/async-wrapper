import { FailedEvents, Subscriber } from "../utils/types";
import { AsyncWrapperBaseClass } from "../baseClasses/AsyncWrapperBaseClass";

export class Debounce<P, R> extends AsyncWrapperBaseClass<P, R> {
  private _debouceDelay: number; // ms
  private _timeoutId?: ReturnType<typeof setTimeout>;

  constructor(
    debounceDelay: number,
    subscribers: Subscriber<R>[],
    metadata: any
  ) {
    super(subscribers, metadata);
    this._debouceDelay = debounceDelay;
  }

  async execute(func: (args: P) => Promise<R>, args: P): Promise<R> {
    if (this._timeoutId) clearInterval(this._timeoutId);
    return new Promise(async (res, rej) => {
      this._timeoutId = setTimeout(async () => {
        try {
          const data = await func(args);
          res(data);
        } catch (error) {
          this.publishEvent({ event: FailedEvents.Rejected, error });
          rej(error);
        }
      }, this._debouceDelay);
    });
  }
}
