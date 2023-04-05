import { Router } from "express";

import musicianControllers from "../controllers/musicianControllers.js";
import validateBody from "../middlewares/validateBody.js";
import { MusicianInputSchema } from "../schemas/MusicianSchema.js";

const musicianRouter = Router();

musicianRouter.post(
  "/signup",
  validateBody(MusicianInputSchema),
  musicianControllers.signup
);

export default musicianRouter;
