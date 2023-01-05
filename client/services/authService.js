import BaseService from "./baseService";

export function postVideoData(data) {
  return BaseService.post(`/post-video`, data);
}

export function getVideoData(data) {
  return BaseService.post(`/get-video`, data);
}

export function removeVideoData(data) {
  return BaseService.post(`/remove-video`, data);
}

export function getStatus() {
  return BaseService.get(`get-status`);
}

export function changeStatus(status) {
  return BaseService.post(`change-status`, status);
}

//get product located in video
export function getVideoProduct() {
  return BaseService.get(`get-video-product`);
}
