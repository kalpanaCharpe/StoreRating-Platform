import * as ratingsService from "../services/ratings.service.js";

export async function submit(req, res, next) {
  try {
    const rating = await ratingsService.submitRating(
      req.user.userId,
      req.params.storeId,
      req.body.value
    );
    res.status(201).json(rating);
  } catch (err) {
    next(err);
  }
}

export async function update(req, res, next) {
  try {
    const rating = await ratingsService.updateRating(
      req.user.userId,
      req.params.storeId,
      req.body.value
    );
    res.json(rating);
  } catch (err) {
    next(err);
  }
}

export async function getMyRating(req, res, next) {
  try {
    const rating = await ratingsService.getUserRatingForStore(
      req.user.userId,
      req.params.storeId
    );
    res.json(rating ?? null);
  } catch (err) {
    next(err);
  }
}

export async function storeListForUser(req, res, next) {
  try {
    const { search, sortBy, order } = req.query;
    const stores = await ratingsService.getStoresWithUserRatings(req.user.userId, {
      search,
      sortBy,
      order,
    });
    res.json(stores);
  } catch (err) {
    next(err);
  }
}
