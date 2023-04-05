import { Router } from "express";

import musicianRouter from "./musicianRoutes.js";

const router = Router();

router.use("/musician", musicianRouter);

export default router;
