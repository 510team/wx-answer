//app.js
import {
  loginApi,
  getUserInfoApi,
  getUserSettingApi,
  loginRequest,
  setUserRequest
} from "./services/login.js";

App({
  onLaunch: function() {
    wx.checkSession({
      // 如果已经登录过，则跳过登录
      success: res => {
        getUserSettingApi()
          .then(() => getUserInfoApi())
          .then(data => {
            console.log("getUserApi request result", data);
            this.globalData.userInfo = data.userInfo;
            //由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回 所以此处加入 callback 以防止这种情况
            if (this.userInfoReadyCallback) {
              this.userInfoReadyCallback(data);
            }
            return data;
          })
          .then(data => setUserRequest(data.rawData, data.signature));
      },
      // 登录过期需要重新登录,先调用loginApi获得Code，然后调用到后台换取OpenId，SessionKey
      fail: res => {
        loginApi()
          .then(code => loginRequest(code))
          .then(data => {
            //code 成功
            console.log("login request result", data);
            wx.setStorage({
              key: "code",
              data: data
            });
          })
          .catch(data => {
            console.error("data", data);
          });
      }
    });
  },
  globalData: {
    userInfo: null
  }
});
