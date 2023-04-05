import express from "express";
import dotenv from "dotenv";
import router from "./routers/index.js";
import handleRouteErrors from "./middlewares/handleRouteErrors.js";
import "express-async-errors";

dotenv.config();

const port = process.env.PORT || 6000;

const app = express();
app.use(express.json());

app.use(router);
app.use(handleRouteErrors);

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
