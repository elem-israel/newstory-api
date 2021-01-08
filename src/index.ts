import express, { Request, Response } from "express";
import queue from "./routes/queue";
import auth from "./routes/auth";
import { installDevKeycloak, installKeycloak } from "./keycloak";
import bodyParser from "body-parser";

const port = process.env.PORT || 3000;

const app = express();

app.get("/", function (req: Request, res: Response) {
  const { code, session_state } = req.query;
  if (code && session_state) {
    return res.redirect(`/auth/token/${code}`);
  } else {
    res.send("Hello World");
  }
});

if (process.env.NODE_ENV === "production") {
  installKeycloak(app);
} else {
  installDevKeycloak(app);
}

app.use(bodyParser.json());
app.use("/queue", queue);
app.use("/auth", auth);
app.listen(port, () => console.log(`server listening on port ${port}`));
