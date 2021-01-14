import express, { Request, Response } from "express";
require("express-async-errors");
import morgan from "morgan";
import routes from "./routes";
import { installDevKeycloak, installKeycloak } from "./keycloak";
import bodyParser from "body-parser";
import { getToken } from "./cotrollers/auth";

const port = process.env.PORT || 3000;

const app = express();

app.use(morgan("combined"));

app.use((req: any, res: any, next) => {
  const { code, session_state } = req.query;
  return code && session_state ? getToken(req, res) : next();
});

app.get("/", function (req: Request, res: Response) {
  res.send("Hello World");
});

app.get("/login", (req, res) => {
  const redirect = `${process.env.LOGIN_REDIRECT}&client_id=${process.env.KEYCLOAK_CLIENT_ID}`;
  console.log(`redirecting to ${redirect}`);
  res.redirect(redirect);
});

if (process.env.NODE_ENV === "production") {
  installKeycloak(app);
} else {
  installDevKeycloak(app);
}

app.use(bodyParser.json());
app.use("/", routes);
app.listen(port, () => console.log(`server listening on port ${port}`));
