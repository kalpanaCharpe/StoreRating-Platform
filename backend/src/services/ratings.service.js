import { db } from "../config/db.js";
import { AppError } from "../middleware/error.js";

export async function submitRating(userId, storeId, value) {
  const store = await db.store.findUnique({ where: { id: storeId } });
  if (!store) throw new AppError(404, "Store not found");

  const existing = await db.rating.findUnique({
    where: { userId_storeId: { userId, storeId } },
  });

  if (existing)
    throw new AppError(409, "You've already rated this store. Use the update endpoint.");

  return db.rating.create({ data: { userId, storeId, value } });
}

export async function updateRating(userId, storeId, value) {
  const existing = await db.rating.findUnique({
    where: { userId_storeId: { userId, storeId } },
  });

  if (!existing) throw new AppError(404, "No rating found to update");

  return db.rating.update({
    where: { userId_storeId: { userId, storeId } },
    data: { value },
  });
}

export async function getUserRatingForStore(userId, storeId) {
  return db.rating.findUnique({
    where: { userId_storeId: { userId, storeId } },
  });
}

export async function getStoresWithUserRatings(userId, query) {
  const { search, sortBy = "name", order = "asc" } = query;

  const stores = await db.store.findMany({
    where: search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { address: { contains: search, mode: "insensitive" } },
          ],
        }
      : {},
    include: {
      ratings: {
        where: { userId },
        select: { value: true, id: true },
      },
      _count: { select: { ratings: true } },
    },
  });

  const result = stores.map((s) => {
    const userRating = s.ratings[0] ?? null;
    return {
      id: s.id,
      name: s.name,
      email: s.email,
      address: s.address,
      totalRatings: s._count.ratings,
      userRating: userRating ? userRating.value : null,
    };
  });

  const validSort = ["name", "address"];
  const field = validSort.includes(sortBy) ? sortBy : "name";
  result.sort((a, b) =>
    order === "desc"
      ? b[field].localeCompare(a[field])
      : a[field].localeCompare(b[field])
  );

  return result;
}
