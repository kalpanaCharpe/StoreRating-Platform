import * as usersService from "../services/users.service.js";

export async function list(req, res, next) {
  try {
    const { name, email, address, role, sortBy, order } = req.query;
    const users = await usersService.listUsers({ name, email, address, role, sortBy, order });
    res.json(users);
  } catch (err) {
    next(err);
  }
}

export async function getOne(req, res, next) {
  try {
    const user = await usersService.getUserById(req.params.id);
    res.json(user);
  } catch (err) {
    next(err);
  }
}

export async function create(req, res, next) {
  try {
    const user = await usersService.createUser(req.body);
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
}
