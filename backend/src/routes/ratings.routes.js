import { Router } from "express";
import * as ratingsController from "../controllers/ratings.controller.js";
import { authenticate, authorize } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { ratingSchema } from "../validators/schemas.js";

const router = Router();

router.get("/my-stores", authenticate, authorize("USER"), ratingsController.storeListForUser);
router.get("/:storeId/my-rating", authenticate, authorize("USER"), ratingsController.getMyRating);
router.post("/:storeId", authenticate, authorize("USER"), validate(ratingSchema), ratingsController.submit);
router.patch("/:storeId", authenticate, authorize("USER"), validate(ratingSchema), ratingsController.update);

export default router;
