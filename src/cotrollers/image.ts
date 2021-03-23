import {
  BlobSASPermissions,
  generateBlobSASQueryParameters,
  StorageSharedKeyCredential,
} from "@azure/storage-blob";
import { Request, Response } from "express";
import Knex from "knex";
import { v4 as uuidv4 } from "uuid";

const containerName = process.env.CONTAINER_NAME;

function* range(start: number, stop: number, step = 1) {
  if (stop == null) {
    // one param defined
    stop = start;
    start = 0;
  }

  for (let i = start; step > 0 ? i < stop : i > stop; i += step) {
    yield i;
  }
}

function getRandomInt(max: number) {
  return Math.floor(Math.random() * Math.floor(max));
}

const knex = Knex({
  client: "mssql",
  connection: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    requestTimeout: 120000,
  },
});

function choose(items: any[]) {
  return items[Math.floor(Math.random() * items.length)];
}

export async function randomImage(req: Request, res: Response) {
  const n = Number.parseInt((req.query.n || 0) as string);
  console.log(`starting query, n = ${n}`);
  const allIds = await knex
    .select("fact_photos.id")
    .from("newstory.dbo.fact_photos")
    .leftJoin("fact_profiles", "fact_photos.username", "fact_profiles.username")
    .where({ is_private: 0, is_business_account: 0 })
    .then((res) => res.map(({ id }) => id));
  const chosenIds = Array.from(range(0, n)).map(() => choose(allIds));
  const result = await knex
    .select()
    .from("newstory.dbo.fact_photos")
    .whereIn("fact_photos.id", chosenIds);
  console.log({ result });
  return res.send(
    result.map((r) => {
      const photoPath = r.photo_path;
      const blobName = photoPath.slice(1);
      const tokenExpiryMilliseconds = Number.parseInt(
        (process.env.IMAGE_TOKEN_EXPIRATION_MILLISECONDS || 60000) as string
      );
      const blobSAS = generateBlobSASQueryParameters(
        {
          containerName,
          blobName,
          permissions: BlobSASPermissions.parse("racwd"),
          expiresOn: new Date(new Date().valueOf() + tokenExpiryMilliseconds),
        },
        new StorageSharedKeyCredential(
          process.env.AZURE_ACCOUNT_NAME,
          process.env.AZURE_ACCOUNT_KEY
        )
      ).toString();
      return {
        ...r,
        url: `https://${process.env.AZURE_ACCOUNT_NAME}.blob.core.windows.net/${containerName}/${blobName}?${blobSAS}`,
      };
    })
  );
}

export async function postReport(req: Request, res: Response) {
  const uuid = uuidv4();
  await knex("reports").insert({
    resource: "image",
    resource_id: req.params.image,
    details: JSON.stringify(req.body),
    uuid,
  });
  return res.send(uuid);
}
