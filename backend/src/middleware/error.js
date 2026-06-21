export class AppError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.name = "AppError";
    Error.captureStackTrace(this, this.constructor);
  }
}

export function errorHandler(err, _req, res, _next) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ message: err.message });
  }

  // Prisma unique constraint violation
  if (err?.code === "P2002") {
    const fields = err.meta?.target?.join(", ") ?? "field";
    return res
      .status(409)
      .json({ message: `A record with this ${fields} already exists.` });
  }

  console.error(err);
  res.status(500).json({ message: "Something went wrong. Please try again." });
}
