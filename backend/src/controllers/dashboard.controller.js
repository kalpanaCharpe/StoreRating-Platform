import { db } from "../config/db.js";

export async function getDashboard(_req, res, next) {
  try {
    const [totalUsers, totalStores, totalRatings] = await Promise.all([
      db.user.count(),
      db.store.count(),
      db.rating.count(),
    ]);
    res.json({ totalUsers, totalStores, totalRatings });
  } catch (err) {
    next(err);
  }
}
