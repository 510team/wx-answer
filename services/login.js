import { Login, SaveUserInfo, FindUser } from "../config/index.js";
import httpRequest from "../utils/request.js";

//调用API获得Code
const loginApi = () => {
    return new Promise((resolve, reject) => {
        wx.login({
            success: res => {
                console.log("login api res", res);
                if (res.code) {
                    resolve(res.code);
                } else {
                    reject(res.errMsg);
                }
            }
        });
    });
};

//调用API获得UserInfo
const getUserSettingApi = () => {
    return new Promise((resolve, reject) => {
        wx.getSetting({
            success: res => {
                if (res.authSetting["scope.userInfo"]) {
                    // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                    resolve(res);
                }
            }
        });
    });
};

//调用API获得UserInfo
const getUserInfoApi = () => {
    return new Promise((resolve, reject) => {
        wx.getUserInfo({
            success: res => {
                resolve(res);
            }
        });
    });
};

//发送findUser Request
const findUserRequest = () => {
    return httpRequest({
        method: FindUser.method,
        data: {},
        url: FindUser.url
    });
};

//请求服务端从code 获取OpenId，SessionKEY
const loginRequest = code => {
    return new Promise((resolve, reject) => {
        wx.request({
            url: Login.url,
            data: {
                code
            },
            success: function(res) {
                resolve(res);
            }
        });
    });
};
//请求服务端将UserINFO 发送到服务端
const setUserRequest = (rawData, signature) => {
    return httpRequest({
        method: SaveUserInfo.method,
        data: { rawData, signature },
        url: SaveUserInfo.url
    });
};

const loginAction = () => {
  return new Promise(resolve => {
    loginApi()
      .then(code => loginRequest(code))
      .then(res => {
        const data = res.data.data;
        if (data && data.code) {
          wx.setStorage({
            key: "code",
            data: data.code
          });
        }
        resolve(data.code);
      })
      .catch(data => {
        console.error("storage存储code失败");
      });
  });
};

export {
    loginApi,
    getUserInfoApi,
    getUserSettingApi,
    loginRequest,
    loginAction,
    setUserRequest,
    findUserRequest
};
