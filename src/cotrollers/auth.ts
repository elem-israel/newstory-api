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
    client_id: "newstory-react-dev",
    grant_type: "authorization_code",
    code: req.params.code,
  };
  console.log({ data });
  return axios
    .post(process.env.KEYCLOAK_TOKEN_ENDPOINT, qs.stringify(data))
    .then(({ data }: any) => res.send(data))
    .catch((err) => console.log(err.response.data));
}
