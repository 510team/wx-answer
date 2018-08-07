import httpRequest from "../utils/request.js";

import { test } from "../config/index.js";

const testRequest  = () => {
  return httpRequest({
    method: 'get',
    data: {  },
    url: test.url
  });
};

export {
   testRequest
};
