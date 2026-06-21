import * as storesService from "../services/stores.service.js";

export async function list(req, res, next) {
  try {
    const { search, sortBy, order } = req.query;
    const stores = await storesService.listStores({ search, sortBy, order });
    res.json(stores);
  } catch (err) {
    next(err);
  }
}

export async function getOne(req, res, next) {
  try {
    const store = await storesService.getStoreById(req.params.id);
    res.json(store);
  } catch (err) {
    next(err);
  }
}

export async function create(req, res, next) {
  try {
    const store = await storesService.createStore(req.body);
    res.status(201).json(store);
  } catch (err) {
    next(err);
  }
}

export async function update(req, res, next) {
  try {
    const store = await storesService.updateStore(req.params.id, req.body);
    res.json(store);
  } catch (err) {
    next(err);
  }
}

export async function remove(req, res, next) {
  try {
    await storesService.deleteStore(req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

export async function ownerDashboard(req, res, next) {
  try {
    const data = await storesService.getOwnerDashboard(req.user.userId);
    res.json(data);
  } catch (err) {
    next(err);
  }
}
