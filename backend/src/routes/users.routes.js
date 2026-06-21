import { Router } from "express";
import * as usersController from "../controllers/users.controller.js";
import { authenticate, authorize } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { createUserSchema } from "../validators/schemas.js";

const router = Router();

router.use(authenticate, authorize("ADMIN"));

router.get("/", usersController.list);
router.get("/:id", usersController.getOne);
router.post("/", validate(createUserSchema), usersController.create);

export default router;
