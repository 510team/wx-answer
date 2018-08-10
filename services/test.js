import httpRequest from "../utils/request.js";

import { test, updateScore } from "../config/index.js";

const testRequest = () => {
  return httpRequest({
    method: "get",
    data: {},
    url: test.url
  });
};

const updateScoreRequest = data => {
  return httpRequest({
    method: "get",
    data: { ...data },
    url: updateScore.url
  });
};

export { testRequest, updateScoreRequest };
