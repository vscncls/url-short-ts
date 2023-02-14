import { UrlResult, UrlStore } from "./urlStore";

class ShortIdNotFound extends Error {}

class RetrieveLongUrl {
  private urlStore: UrlStore;
  private expirationTimeHours = Number(process.env.EXPIRATION_TIME_HOURS) || 24;

  constructor() {
    this.urlStore = new UrlStore();
  }

  public async exec(shortId: string): Promise<string> {
    console.log(this.expirationTimeHours);
    const result = await this.urlStore.findByShortId(shortId);
    if (!result) {
      throw new ShortIdNotFound();
    }

    if (this.isExpired(result)) {
      // Throw this to not leak info
      throw new ShortIdNotFound();
    }

    return result.longUrl;
  }

  private isExpired(url: UrlResult) {
    const expirationTime = new Date(url.createdAt);
    expirationTime.setHours(
      expirationTime.getHours() + this.expirationTimeHours
    );

    const now = new Date();
    return expirationTime >= now;
  }
}

export { RetrieveLongUrl, ShortIdNotFound };
