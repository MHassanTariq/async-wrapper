import { Cache } from "./entities/Cache";
import { Debounce } from "./entities/Debounce";
import { Retry } from "./entities/Retry";
import { DEFAULT } from "./utils/configs";
import { Subscriber } from "./utils/types";

export default class NetworkConfigBuilder<P, R> {
  // network configutaions
  private _debounce: number = DEFAULT.debounce;
  private _retryLimit: number = DEFAULT.retryLimit;
  private _isCacheEnabled: boolean = DEFAULT.isCacheEnabled;

  // subscriber
  private _subscribers: Subscriber<R>[] = [];
  private _metadata: any = {};

  debouce(microSeconds: number) {
    this._debounce = microSeconds;
    return this;
  }

  retry(limit: number) {
    this._retryLimit = limit;
    return this;
  }

  enableCache(isCacheEnabled: boolean) {
    this._isCacheEnabled = isCacheEnabled;
    return this;
  }

  subscribers(subscribers: Subscriber<R>[]) {
    this._subscribers = subscribers;
    return this;
  }

  attachMetaData(metaData: any) {
    this._metadata = metaData;
    return this;
  }

  build() {
    return new NetworkConfig<P, R>(
      this._debounce,
      this._retryLimit,
      this._isCacheEnabled,
      this._subscribers,
      this._metadata
    );
  }
}

class NetworkConfig<P, R> {
  private _debounce: Debounce<P, R>;
  private _retry: Retry<P, R>;
  private _cache: Cache<P, R>;

  constructor(
    debounce: number,
    retryLimit: number,
    isCacheEnabled: boolean,
    subscribers: Subscriber<R>[],
    metadata: any
  ) {
    this._debounce = new Debounce(debounce, subscribers, metadata);
    this._retry = new Retry(retryLimit, subscribers, metadata);
    this._cache = new Cache(isCacheEnabled, subscribers, metadata);
  }

  async execute(asyncFunc: (args: P) => Promise<R>, args: P): Promise<R> {
    return await this._retry.execute(
      () =>
        this._debounce.execute(
          () => this._cache.execute(asyncFunc, args),
          args
        ),
      args
    );
  }
}
