const serverHost = "https://adazhang.com";
// const serverHost = "http://localhost:8362";
const Login = {
  url: `${serverHost}/login`,
  method: "get"
};
const FindUser = {
  url: `${serverHost}/user/findUser`,
  method: "get"
};
const AnswerQuestion = {
  url: `${serverHost}/answer`,
  method: "get"
};

const SaveUserInfo = {
  url: `${serverHost}/user/setUser`,
  method: "post"
};

const GetRanks = {
  url: `${serverHost}/ranks`,
  method: "get"
};

const GetQuestions = {
  url: `${serverHost}/questions`,
  method: "get"
};
const test = {
  url: `${serverHost}/test`,
  method: "post"
};
const UpdateScore = {
  url: `${serverHost}/ranks/updateScore`,
  method: "post"
};

// 查询当前用户的等级
const GetLevel = {
  url: `${serverHost}/level`,
  method: "get"
};

const addFeedback = {
  url: `${serverHost}/feedback`,
  method: "post"
};

//获取背景图
const GetAllBackground = {
  url: `${serverHost}/background`,
  method: "get"
};
//设置背景图
const SetBackground = {
  url: `${serverHost}/background/updateBackground`,
  method: "post"
};

export {
  FindUser,
  Login,
  SaveUserInfo,
  GetRanks,
  test,
  GetQuestions,
  UpdateScore,
  AnswerQuestion,
  GetLevel,
  addFeedback,
  GetAllBackground,
  SetBackground
};
