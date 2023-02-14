import mongoose from "mongoose";

class MongoConnection {
  private static connection?: mongoose.Connection;

  public static connect(): mongoose.Connection {
    if (this.connection) {
      return this.connection;
    }

    const mongo_url = process.env.MONGO_URL;
    console.log(mongo_url)
    if (!mongo_url) {
      throw new Error("MONGO_URL not in env");
    }

    const connection = mongoose.createConnection(mongo_url);
    this.connection = connection;
    return connection;
  }
}

export { MongoConnection };
