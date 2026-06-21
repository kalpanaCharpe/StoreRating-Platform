import { db } from "../config/db.js";
import { AppError } from "../middleware/error.js";

export async function listStores(query) {
  const { search, sortBy = "name", order = "asc" } = query;

  const where = search
    ? {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { address: { contains: search, mode: "insensitive" } },
        ],
      }
    : {};

  const validSortFields = ["name", "email", "address", "createdAt"];
  const sortField = validSortFields.includes(sortBy) ? sortBy : "name";

  const stores = await db.store.findMany({
    where,
    orderBy: { [sortField]: order === "desc" ? "desc" : "asc" },
    include: {
      ratings: { select: { value: true } },
      owner: { select: { id: true, name: true, email: true } },
    },
  });

  return stores.map((s) => ({
    id: s.id,
    name: s.name,
    email: s.email,
    address: s.address,
    owner: s.owner,
    averageRating:
      s.ratings.length > 0
        ? s.ratings.reduce((sum, r) => sum + r.value, 0) / s.ratings.length
        : null,
    totalRatings: s.ratings.length,
  }));
}

export async function getStoreById(id) {
  const store = await db.store.findUnique({
    where: { id },
    include: {
      ratings: { select: { value: true } },
      owner: { select: { id: true, name: true, email: true } },
    },
  });

  if (!store) throw new AppError(404, "Store not found");

  return {
    ...store,
    averageRating:
      store.ratings.length > 0
        ? store.ratings.reduce((sum, r) => sum + r.value, 0) / store.ratings.length
        : null,
    totalRatings: store.ratings.length,
  };
}

export async function createStore(data) {
  if (data.ownerId) {
    const owner = await db.user.findUnique({ where: { id: data.ownerId } });
    if (!owner) throw new AppError(404, "Owner user not found");
    if (owner.role !== "STORE_OWNER")
      throw new AppError(400, "User must have STORE_OWNER role");
    const existing = await db.store.findUnique({ where: { ownerId: data.ownerId } });
    if (existing) throw new AppError(409, "This user already owns a store");
  }

  return db.store.create({
    data,
    include: {
      owner: { select: { id: true, name: true, email: true } },
    },
  });
}

export async function updateStore(id, data) {
  const store = await db.store.findUnique({ where: { id } });
  if (!store) throw new AppError(404, "Store not found");

  return db.store.update({
    where: { id },
    data,
    include: {
      owner: { select: { id: true, name: true, email: true } },
    },
  });
}

export async function deleteStore(id) {
  const store = await db.store.findUnique({ where: { id } });
  if (!store) throw new AppError(404, "Store not found");
  await db.store.delete({ where: { id } });
}

export async function getOwnerDashboard(ownerId) {
  const store = await db.store.findUnique({
    where: { ownerId },
    include: {
      ratings: {
        include: {
          user: { select: { id: true, name: true, email: true } },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!store) throw new AppError(404, "No store found for this owner");

  const avg =
    store.ratings.length > 0
      ? store.ratings.reduce((s, r) => s + r.value, 0) / store.ratings.length
      : null;

  return {
    store: {
      id: store.id,
      name: store.name,
      email: store.email,
      address: store.address,
    },
    averageRating: avg,
    totalRatings: store.ratings.length,
    ratedUsers: store.ratings.map((r) => ({
      ratingId: r.id,
      value: r.value,
      ratedAt: r.createdAt,
      user: r.user,
    })),
  };
}
