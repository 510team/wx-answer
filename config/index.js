//const serverHost = 'https://adazhang.com'
const serverHost = "http://localhost:8362";
const Login = {
  url: `${serverHost}/login`,
  method: "get"
};
const FindUser = {
  url: `${serverHost}/user/findUser`,
  method: "get"
};

const SaveUserInfo = {
  url: `${serverHost}/login/setUser`,
  method: "post"
};

const GetRanks = {
  url: `${serverHost}/ranks`,
  method: "get"
};

const GetQuestions = {
  url: `${serverHost}/questions`,
  method: "get"
}
const test = {
  url: `${serverHost}/test`,
  method: "post"
};

const updateScore = {
  url: `${serverHost}/ranks/updateScore`,
  method: "post"
};

export { FindUser,Login, SaveUserInfo, GetRanks, test ,GetQuestions,updateScore};
