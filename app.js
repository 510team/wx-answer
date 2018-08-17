//app.js
import {
  loginApi,
  getUserInfoApi,
  getUserSettingApi,
  loginRequest,
  setUserRequest,
  findUserRequest
} from "./services/login.js";

App({
  onLaunch: function() {
    //检查用户登录状态
    wx.getStorage({
      key: "code",
      success: res => {
        wx.checkSession({
          success: res => {
            console.log("登陆状态未失效");
          },
          fail: err => {
            // 重新登录
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
              })
              .catch(data => {
                console.error("storage存储code失败");
              });
          }
        });
      },
      fail: res => {
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
          })
          .catch(data => {
            console.error("storage存储code失败");
          });
      }
    });
  },
  globalData: {
    userInfo: null,
    isLogin: false
  }
});
