import { Request, Response } from "express";
import Knex from "knex";
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

export async function randomPost(req: Request, res: Response) {
  const n = Number.parseInt((req.query.n || 0) as string);
  console.log(`starting query, n = ${n}`);
  const allIds = await knex
    .select("fact_posts.id")
    .from("newstory.dbo.fact_posts")
    .leftJoin(
      "fact_profiles",
      "instagram_author_profile_id",
      "instagram_profile_id"
    )
    .where({ is_private: 0, is_business_account: 0 })
    .andWhere("caption", "like", "%[א-ת]%")
    .then((res) => res.map(({ id }) => id));
  const chosenIds = Array.from(range(0, n)).map(() => choose(allIds));
  const result = await knex
    .select()
    .from("newstory.dbo.fact_posts")
    .leftJoin(
      "fact_profiles",
      "instagram_author_profile_id",
      "instagram_profile_id"
    )
    .whereIn("fact_posts.id", chosenIds);
  console.log({ result });
  return res.send(result);
}

export async function postReport(req: Request, res: Response) {
  const uuid = uuidv4();
  await knex("reports").insert({
    resource: "post",
    resource_id: req.params.post,
    details: JSON.stringify(req.body),
    uuid,
  });
  return res.send(uuid);
}

export function getTaskState(req: Request, res: Response) {}
