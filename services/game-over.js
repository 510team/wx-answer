import httpRequest from "../utils/request.js";
import { GetLevel, UpdateScore } from "../config/index";

const getUserLevel = data => {
  return httpRequest({
    method: GetLevel.method,
    url: GetLevel.url,
    data: { ...data }
  });
};

const updateHighScore = data => {
  return httpRequest({
    method: UpdateScore.method,
    url: UpdateScore.url,
    data: { ...data }
  });
};

export { getUserLevel, updateHighScore };
