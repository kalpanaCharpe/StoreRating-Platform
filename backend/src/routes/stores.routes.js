import { Router } from "express";
import * as storesController from "../controllers/stores.controller.js";
import { authenticate, authorize } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { createStoreSchema, updateStoreSchema } from "../validators/schemas.js";

const router = Router();

router.get("/", authenticate, storesController.list);
router.get("/owner/dashboard", authenticate, authorize("STORE_OWNER"), storesController.ownerDashboard);
router.get("/:id", authenticate, storesController.getOne);
router.post("/", authenticate, authorize("ADMIN"), validate(createStoreSchema), storesController.create);
router.patch("/:id", authenticate, authorize("ADMIN"), validate(updateStoreSchema), storesController.update);
router.delete("/:id", authenticate, authorize("ADMIN"), storesController.remove);

export default router;
