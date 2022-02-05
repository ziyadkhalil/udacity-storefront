import express from "express";
import { ordersRouter } from "./handlers/order";
import { productRouter } from "./handlers/product";
import { userRouter } from "./handlers/user";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/order", ordersRouter);
app.use("/api/product", productRouter);
app.use("/api/user", userRouter);

app.listen(4000, async () => {
  console.log("listening");
});

export default app;
