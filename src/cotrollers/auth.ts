import { Request, Response } from "express";
import axios from "axios";
import qs from "qs";

export function getUser(req: Request & { kauth: any }, res: Response) {
  console.log(res.locals);
  console.log(req);
  res.send(req.kauth.grant.access_token.content.preferred_username);
}

export async function getToken(req: Request & { kauth: any }, res: Response) {
  const data = {
    client_id: process.env.KEYCLOAK_CLIENT_ID,
    grant_type: "authorization_code",
    code: req.query.code,
  };
  return axios
    .post(process.env.KEYCLOAK_TOKEN_ENDPOINT, qs.stringify(data))
    .then(({ data }: any) => res.json(data))
    .catch((err) => console.log(err.response.data));
}
