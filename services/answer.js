import httpRequest from "../utils/request.js";
import { GetQuestions } from "../config/index.js";

const getQuestionsRequest = data => {
  return httpRequest({
    method: GetQuestions.method,
    url: GetQuestions.url,
    data: {  }
  });
};

export { getQuestionsRequest };
