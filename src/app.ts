import express from "express";
import dotenv from "dotenv";
import router from "./routers/index.js";

dotenv.config();

const port = process.env.PORT || 6000;

const app = express();
app.use(express.json());

app.use(router);

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
