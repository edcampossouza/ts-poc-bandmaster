import { Router } from "express";

import musicianRouter from "./musicianRoutes.js";
import bandRouter from "./bandRoutes.js";

const router = Router();

router.use("/musicians", musicianRouter);
router.use("/bands", bandRouter);

export default router;
