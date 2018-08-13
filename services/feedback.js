import httpRequest from "../utils/request.js";
import { addFeedback } from "../config/index.js";

//请求服务端将UserINFO 发送到服务端
const addFeedbackRequest = data => {
  return httpRequest({
    method: addFeedback.method,
    url: addFeedback.url,
    data: { ...data }
  });
};

export { addFeedbackRequest };
