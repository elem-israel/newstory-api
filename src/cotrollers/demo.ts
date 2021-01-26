import { Request, Response } from "express";
import * as fs from "fs";
import { v4 as uuidv4 } from "uuid";

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

function choose(items: any[]) {
  return items[Math.floor(Math.random() * items.length)];
}

export async function randomPost(req: Request, res: Response) {
  const n = Number.parseInt((req.query.n || 0) as string);
  const posts = JSON.parse(fs.readFileSync("./data/demoPosts.json").toString());
  const result = Array.from(range(0, n)).map(() => choose(posts));
  return res.send(result);
}

export async function postReport(req: Request, res: Response) {
  const uuid = uuidv4();
  return res.send(uuid);
}

export function getTaskState(req: Request, res: Response) {}
