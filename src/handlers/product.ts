import { Router } from "express";
import { authMiddleware } from "../middleware/auth";
import { Product } from "../models/product";

import { makeProductService } from "../services/product";

const productRouter = Router();

const productService = makeProductService();

productRouter.get("/", async (_, res) => {
  try {
    res.json(await productService.index());
  } catch (e) {
    res.status(404).json(`Could not list products. ${e}`);
  }
});

productRouter.get("/:productId", async (req, res) => {
  try {
    res.json(await productService.show(parseInt(req.params.productId)));
  } catch (e) {
    res.status(404).json(`Could not get product ${req.params.productId}. ${e}`);
  }
});

productRouter.post("/create", authMiddleware, async (req, res) => {
  try {
    const product = await productService.create(
      req.body as Omit<Product, "id">
    );
    return res.json(product);
  } catch (err) {
    res.status(404).json(`Could not create product. ${err}`);
  }
});

export { productRouter };
