import express from "express";
import { getUser, getToken } from "../cotrollers/auth";

const router = express.Router();

router.get("/user", getUser);
router.get("/token/:code", getToken);
router.get("/login", (reg, res) =>
  res.redirect(
    `${process.env.LOGIN_REDIRECT}&client_id=${process.env.KEYCLOAK_CLIENT_ID}`
  )
);

export default router;
