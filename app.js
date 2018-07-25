//app.js
import { Login, SaveUserInfo } from "./config/index.js";
import httpRequest from "./utils/request.js";

App({
  onLaunch: function() {
    //检查用户登录状态
    wx.checkSession({
      // 如果已经登录过，则跳过登录
      success: res => {
        getUserInfo.call(this);
      },
      // 登录过期需要重新登录
      fail: res => {
        login()
          .then(code => {
            wx.request({
              url: Login.url, //仅为示例，并非真实的接口地址
              data: {
                code
              },
              success: function(res) {
                console.log(res.data);
                wx.setStorage({
                  key: "code",
                  data: code
                });
                getUserInfo.call(this, this);
              }
            });
            console.log("code", code); //发起请求
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

function getUserInfo(_this) {
  wx.getSetting({
    success: res => {
      if (res.authSetting["scope.userInfo"]) {
        // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
        wx.getUserInfo({
          success: res => {
            // 可以将 res 发送给后台解码出 unionId
            this.globalData.userInfo = res.userInfo;
            wx.setStorage({
              key: "userInfo",
              data: res.userInfo
            });

            saveUserInfo.call(_this);

            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
            // 所以此处加入 callback 以防止这种情况
            if (this.userInfoReadyCallback) {
              this.userInfoReadyCallback(res);
            }
          }
        });
      }
    }
  });
}

function login() {
  return new Promise((resolve, reject) => {
    wx.login({
      success: res => {
        if (res.code) {
          resolve(res.code);
        } else {
          reject(res.errMsg);
        }
      }
    });
  });
}

function saveUserInfo() {
  httpRequest({
    method: SaveUserInfo.method,
    data: { id: 123 },
    url: SaveUserInfo.url
  }).then(data => {
    console.log(data);
  });
}
