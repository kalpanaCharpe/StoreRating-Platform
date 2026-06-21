import bcrypt from "bcryptjs";
import { db } from "../config/db.js";
import { AppError } from "../middleware/error.js";

export async function listUsers(query) {
  const { name, email, address, role, sortBy = "createdAt", order = "desc" } = query;

  const where = {
    ...(name && { name: { contains: name, mode: "insensitive" } }),
    ...(email && { email: { contains: email, mode: "insensitive" } }),
    ...(address && { address: { contains: address, mode: "insensitive" } }),
    ...(role && { role }),
  };

  const validSortFields = ["name", "email", "createdAt", "role"];
  const sortField = validSortFields.includes(sortBy) ? sortBy : "createdAt";
  const sortOrder = order === "asc" ? "asc" : "desc";

  const users = await db.user.findMany({
    where,
    orderBy: { [sortField]: sortOrder },
    select: {
      id: true,
      name: true,
      email: true,
      address: true,
      role: true,
      createdAt: true,
    },
  });

  return users;
}

export async function getUserById(id) {
  const user = await db.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      address: true,
      role: true,
      createdAt: true,
      store: {
        select: {
          id: true,
          name: true,
          ratings: { select: { value: true } },
        },
      },
    },
  });

  if (!user) throw new AppError(404, "User not found");

  let averageRating = null;
  if (user.store) {
    const ratings = user.store.ratings;
    if (ratings.length > 0) {
      averageRating = ratings.reduce((sum, r) => sum + r.value, 0) / ratings.length;
    }
  }

  return {
    ...user,
    store: user.store
      ? { id: user.store.id, name: user.store.name, averageRating }
      : null,
  };
}

export async function createUser(data) {
  const existing = await db.user.findUnique({ where: { email: data.email } });
  if (existing) throw new AppError(409, "Email already in use");

  const hashed = await bcrypt.hash(data.password, 12);
  const user = await db.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashed,
      address: data.address,
      role: data.role,
    },
    select: {
      id: true,
      name: true,
      email: true,
      address: true,
      role: true,
      createdAt: true,
    },
  });

  return user;
}
