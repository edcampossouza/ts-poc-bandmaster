import { Router } from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import validateBody from "../middlewares/validateBody.js";
import { BandSchema } from "../schemas/BandSchema.js";
import bandControllers from "../controllers/bandControllers.js";

const bandRouter = Router();

bandRouter.post(
  "/",
  authMiddleware,
  validateBody(BandSchema),
  bandControllers.createBand
);

bandRouter.get("/query", authMiddleware, bandControllers.searchBands);

bandRouter.post(
  "/:bandId/invite/:musicianId",
  authMiddleware,
  bandControllers.invite
);

export default bandRouter;
