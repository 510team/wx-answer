//index.js
import httpRequest from "../../utils/request.js";
import { loginApi, getUserInfoApi, getUserSettingApi, loginRequest, setUserRequest  } from "../../services/login.js";
//获取应用实例
const app = getApp();

Page({
  data: {
    motto: "Hello World",
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse("button.open-type.getUserInfo")
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: "../logs/logs"
    });
  },
  onLoad: function() {
    console.log(app.globalData.userInfo);
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      });
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        console.log(res);
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        });
        //saveUserInfo.call(this);
      };
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      //getUserInfo.call(this);
      getUserInfoApi().then((res)=>{
        app.globalData.userInfo = res.userInfo;
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        });
      })
    }
  },
  //事件处理函数
  goDemo: function() {
    wx.navigateTo({
      url: "../demo/demo"
    });
  },
  goPage: function(event) {
    console.log(event);
    wx.navigateTo({
      url:
        "../" +
        event.currentTarget.dataset.url +
        "/" +
        event.currentTarget.dataset.url
    });
  }
});

// 获取用户信息
/*
function getUserInfo() {
  wx.getUserInfo({
    success: res => {
      app.globalData.userInfo = res.userInfo;
      this.setData({
        userInfo: res.userInfo,
        hasUserInfo: true
      });
    }
  });
}
*/