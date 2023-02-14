import dotenv from "dotenv";
import { createFastifyServer } from "./server";

dotenv.config();

const server = createFastifyServer();

const start = async () => {
  try {
    await server.listen({ port: 3000 });
  } catch (error) {
    server.log.error(error);
    process.exit(1);
  }
};
start();
