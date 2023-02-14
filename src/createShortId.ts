import { UrlStore } from "./urlStore";

const baseUrl = "vscncls.xyz/s/";
const maxShortUrlSize = 22;
const maxLongUrlSize = 2048; // 2KiB

class InvalidUrl extends Error {}

class CreateShortId {
  private urlStore: UrlStore;

  private characterList =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  constructor() {
    this.urlStore = new UrlStore();
  }

  public async exec(longUrl: string): Promise<string> {
    try {
      new URL(longUrl);
    } catch (error) {
      throw new InvalidUrl();
    }

    const shortId = this.generateShortUrlId();

    await this.urlStore.saveUrl(shortId, longUrl);

    return shortId;
  }

  private generateShortUrlId(): string {
    const size = maxShortUrlSize - baseUrl.length;

    let shortId = "";
    for (let i = 0; i < size; i++) {
      shortId += this.randomChar();
    }

    return shortId;
  }

  private randomChar(): string {
    return this.characterList.charAt(Math.floor(Math.random() * this.characterList.length));
  }
}

export { CreateShortId, InvalidUrl, maxLongUrlSize };
