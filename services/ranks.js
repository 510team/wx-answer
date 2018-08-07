import httpRequest from "../utils/request.js";
import { GetRanks } from "../config/index.js";

//请求服务端将UserINFO 发送到服务端
const getRanksRequest = data => {
  return httpRequest({
    method: GetRanks.method,
    url: GetRanks.url,
    data: { ...data }
  });
};

export { getRanksRequest };
