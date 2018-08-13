import httpRequest from "../utils/request.js";
import { GetQuestions,AnswerQuestion } from "../config/index.js";

const getQuestionsRequest = data => {
  return httpRequest({
    method: GetQuestions.method,
    url: GetQuestions.url,
    data: {}
  });
};

const answerQuestion = data => {
  return httpRequest({
    method: AnswerQuestion.method,
    url: AnswerQuestion.url,
    data
  });
};


export { getQuestionsRequest ,answerQuestion};
