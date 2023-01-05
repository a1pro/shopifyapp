import BaseService from "./baseService";

export function importReviews(data) {
  // ✅
  return BaseService.post(`/import-reviews`, data);
}

export function approveReview(data) {
  return BaseService.post(`/approve-review`, data);
}

export function hideReview(data) {
  return BaseService.post(`/hide-review`, data);
}

export function featureReview(data) {
  return BaseService.post(`/feature-review`, data);
}

export function unfeatureReview(data) {
  return BaseService.post(`/unfeature-review`, data);
}

export function getReviews(data) {
  // ✅
  return BaseService.post(`/get-reviews`, data);
}

export function deleteReview(data) {
  return BaseService.post(`/delete-review`, data);
}
