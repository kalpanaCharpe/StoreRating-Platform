import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db } from "../config/db.js";
import { config } from "../config/index.js";
import { AppError } from "../middleware/error.js";

export async function registerUser(data) {
  const existing = await db.user.findUnique({ where: { email: data.email } });
  if (existing) throw new AppError(409, "Email already in use");

  const hashed = await bcrypt.hash(data.password, 12);
  const user = await db.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashed,
      address: data.address,
      role: "USER",
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

  const token = signToken(user.id, user.role);
  return { user, token };
}

export async function loginUser(email, password) {
  const user = await db.user.findUnique({ where: { email } });
  if (!user) throw new AppError(401, "Invalid email or password");

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new AppError(401, "Invalid email or password");

  const { password: _pw, ...safeUser } = user;
  const token = signToken(user.id, user.role);
  return { user: safeUser, token };
}

export async function changeUserPassword(userId, currentPassword, newPassword) {
  const user = await db.user.findUniqueOrThrow({ where: { id: userId } });
  const valid = await bcrypt.compare(currentPassword, user.password);
  if (!valid) throw new AppError(400, "Current password is incorrect");

  const hashed = await bcrypt.hash(newPassword, 12);
  await db.user.update({
    where: { id: userId },
    data: { password: hashed },
  });
}

function signToken(userId, role) {
  return jwt.sign({ userId, role }, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn,
  });
}
