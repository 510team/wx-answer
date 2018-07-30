
//const serverHost = 'https://adazhang.com'
const serverHost = 'http://localhost:8362'
const Login = {
  url: `${serverHost}/login`,
  method: "get"
};

const SaveUserInfo = {
  url: `${serverHost}/login/setUser`,
  method: "post"
};
export { Login, SaveUserInfo };
