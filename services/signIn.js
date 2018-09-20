import httpRequest from "../utils/request.js";
import {
  signInTask,
  canSignIn,
  canShare,
  Share,
  GetPoint
} from "../config/index.js";

//请求服务端将UserINFO 发送到服务端
const signInRequest = data => {
  return httpRequest({
    method: signInTask.method,
    url: signInTask.url,
    data: { ...data }
  });
};

//
const canSignInRequest = data => {
  return httpRequest({
    method: canSignIn.method,
    url: canSignIn.url,
    data: { ...data }
  });
};

const canShareRequest = data => {
  return httpRequest({
    method: canShare.method,
    url: canShare.url,
    data: { ...data }
  });
};

const shareRequest = data => {
  return httpRequest({
    method: Share.method,
    url: Share.url,
    data: { ...data }
  });
};

const getPointRequest = data => {
  return httpRequest({
    method: GetPoint.method,
    url: GetPoint.url,
    data: { ...data }
  });
};
export {
  signInRequest,
  canSignInRequest,
  canShareRequest,
  shareRequest,
  getPointRequest
};
