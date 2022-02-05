import { Router } from "express";
import { authMiddleware } from "../middleware/auth";
import { makeOrderService } from "../services/order";

const ordersRouter = Router();

const orderService = makeOrderService();

ordersRouter.get("/current", authMiddleware, async (_, res) => {
  try {
    const currentOrder = await orderService.currentOrder(res.locals.user.id);
    res.json(currentOrder);
  } catch (err) {
    res.status(404).json(`Could not get current order. ${err}`);
  }
});

ordersRouter.get("/complete", authMiddleware, async (req, res) => {
  try {
    const completeOrders = await orderService.completedOrders(
      res.locals.user.id
    );
    res.json(completeOrders);
  } catch (err) {
    res.status(404).json(`Could not list complete orders. ${err}`);
  }
});

ordersRouter.post("/", authMiddleware, async (_, res) => {
  try {
    await orderService.completeCurrentOrder(res.locals.user.id);
    res.status(200).json({
      message: "Ordered successfully",
    });
  } catch (err) {
    res.status(404).json(`Could not complete current order. ${err}`);
  }
});
export { ordersRouter };
