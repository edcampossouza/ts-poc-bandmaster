import { Router } from "express";

import musicianControllers from "../controllers/musicianControllers.js";
import validateBody from "../middlewares/validateBody.js";
import { MusicianInputSchema, SigninSchema } from "../schemas/MusicianSchema.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const musicianRouter = Router();

musicianRouter.post(
  "/signup",
  validateBody(MusicianInputSchema),
  musicianControllers.signup
);

musicianRouter.post(
  "/signin",
  validateBody(SigninSchema),
  musicianControllers.signin
);

musicianRouter.get(
  "/query",
  authMiddleware,
  musicianControllers.query
);

musicianRouter.get(
  "/invites",
  authMiddleware,
  musicianControllers.getInvites
);


musicianRouter.post(
  "/invites/:bandId/accept/",
  authMiddleware,
  musicianControllers.acceptInvitation
);


musicianRouter.get(
  "/:id",
  authMiddleware,
  musicianControllers.getById
);


export default musicianRouter;
