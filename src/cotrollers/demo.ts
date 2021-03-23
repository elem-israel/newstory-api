import { Request, Response } from "express";
import * as fs from "fs";
import { v4 as uuidv4 } from "uuid";
import {
  BlobSASPermissions,
  StorageSharedKeyCredential,
  generateBlobSASQueryParameters,
} from "@azure/storage-blob";

function* range(start: number, stop: number, step = 1) {
  if (stop == null) {
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

function choose(items: any[]) {
  return items[Math.floor(Math.random() * items.length)];
}

export async function randomPost(req: Request, res: Response) {
  const n = Number.parseInt((req.query.n || 0) as string);
  const posts = JSON.parse(fs.readFileSync("./data/demoPosts.json").toString());
  const result = Array.from(range(0, n)).map(() => choose(posts));
  return res.send(result);
}

export async function randomImage(req: Request, res: Response) {
  const photoPath =
    "/profiles/2021-01-17/annabelle.r_/2336218034464005146_1.jpg";
  const blobName = photoPath.slice(1);
  const tokenExpiryMilliseconds = 60000;
  const containerName = process.env.CONTAINER_NAME;
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
  return res.send([
    {
      photo_path: photoPath,
      id: 27216,
      post_id: "2336218034464005146",
      username: "annabelle.r_",
      url: `https://${process.env.AZURE_ACCOUNT_NAME}.blob.core.windows.net/${containerName}/${blobName}?${blobSAS}`,
    },
  ]);
}

export async function postReport(req: Request, res: Response) {
  const uuid = uuidv4();
  return res.send(uuid);
}

export function getTaskState(req: Request, res: Response) {}
