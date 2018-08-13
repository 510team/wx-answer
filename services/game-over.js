import httpRequest from "../utils/request.js";
import { GetLevel } from "../config/index";

const getUserLevel = data => {
  return httpRequest({
    method: GetLevel.method,
    url: GetLevel.url,
    data: { ...data }
  });
};

export { getUserLevel };
