import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import { Static, Type } from "@sinclair/typebox";
import fastify from "fastify";
import { CreateShortId, InvalidUrl, maxLongUrlSize } from "./createShortId";
import { RetrieveLongUrl, ShortIdNotFound } from "./retrieveLongUrl";

const ErrorResponse = Type.Object({
  message: Type.String(),
});

const ShortenRequestBody = Type.Object({
  url: Type.String({ maxLength: maxLongUrlSize }),
});
const ShortenRequestResponse = Type.Object({
  shortId: Type.String(),
});

const GetLongUrlRequestRouteParams = Type.Object({
  shortId: Type.String(),
});
const GetLongUrlResponse = Type.Object({
  longUrl: Type.String({ maxLength: maxLongUrlSize }),
});

function createFastifyServer() {
  const server = fastify({
    logger: true,
  }).withTypeProvider<TypeBoxTypeProvider>();

  const createShortIdHandler = new CreateShortId();
  server.post<{
    Body: Static<typeof ShortenRequestBody>;
    Reply: Static<typeof ShortenRequestResponse> | Static<typeof ErrorResponse>;
  }>(
    "/shorten",
    {
      schema: {
        body: ShortenRequestBody,
        response: {
          200: ShortenRequestResponse,
          400: ErrorResponse,
        },
      },
    },
    async (req, res) => {
      let shortId: string;
      try {
        shortId = await createShortIdHandler.exec(req.body.url);
      } catch (error) {
        if (error instanceof InvalidUrl) {
          res.status(400).send({ message: "Invalid URL" });
        }

        throw error;
      }

      res.status(200).send({
        shortId,
      });
    }
  );

  const retrieveLongUrlHandler = new RetrieveLongUrl();
  server.get<{
    Params: Static<typeof GetLongUrlRequestRouteParams>;
    Reply: Static<typeof GetLongUrlResponse> | Static<typeof ErrorResponse>;
  }>(
    "/:shortId",
    {
      schema: {
        params: GetLongUrlRequestRouteParams,
        response: {
          200: GetLongUrlResponse,
          404: ErrorResponse,
        },
      },
    },
    async (req, res) => {
      let longUrl: string;
      try {
        longUrl = await retrieveLongUrlHandler.exec(req.params.shortId);
      } catch (error) {
        if (error instanceof ShortIdNotFound) {
          res.status(404).send({ message: "shortId not found" });
          return;
        }

        throw error;
      }

      res.status(200).send({ longUrl });
    }
  );

  return server;
}

export { createFastifyServer };
