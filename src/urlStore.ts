import mongoose, { Schema } from "mongoose";
import { MongoConnection } from "./mongoConnection";

interface UrlResult {
  longUrl: string;
  shortId: string;
  createdAt: Date;
}

const UrlSchema = new Schema({
  longUrl: String,
  shortId: String,
  createdAt: Date,
});

class UrlStore {
  private UrlModel: mongoose.Model<UrlResult>;
  constructor() {
    const connection = MongoConnection.connect();

    this.UrlModel = connection.model<UrlResult>("url", UrlSchema);
  }

  async saveUrl(shortId: string, longUrl: string): Promise<void> {
    const now = new Date();
    const urlDocument = new this.UrlModel({
      shortId,
      longUrl,
      now,
    });

    await urlDocument.save();
  }

  async findByShortId(shortId: string): Promise<UrlResult | null> {
    const urlDocument = (await this.UrlModel.findOne({
      shortId,
    }).exec()) as UrlResult | null;

    return urlDocument;
  }
}

export { UrlStore, UrlResult };
