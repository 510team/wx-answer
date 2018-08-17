//index.js
import httpRequest from "../../utils/request.js";
import {
  loginApi,
  getUserInfoApi,
  getUserSettingApi,
  loginRequest,
  setUserRequest
} from "../../services/login.js";
import { testRequest, updateScoreRequest } from "../../services/test.js";
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
    wx.getStorage({
      key: "hasUserInfo",
      success: res => {
        this.setData({
          userInfo: res.data,
          hasUserInfo: true
        });
      },
      fail: res => {
        // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
        // 所以此处加入 callback 以防止这种情况
        app.userInfoReadyCallback = res => {
          if (res.userInfo && res.userInfo.nickName && res.userInfo.avatarUrl) {
            this.setData({
              userInfo: res.userInfo,
              hasUserInfo: true
            });
            console.log("userInfoReadyCallback", res);
            return res;
          }
        };
      }
    });
  },
  onShow() {
    this.onLoad();
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
  },
  getUserInfo: function(e) {
    if (e.detail.userInfo) {
      app.globalData.userInfo = e.detail.userInfo;
      this.setData({
        userInfo: e.detail.userInfo,
        hasUserInfo: true
      });
      wx.setStorage({
        key: "hasUserInfo",
        data: e.detail.userInfo
      });
    } else {
      console.log("授权失败");
      wx.openSetting({
        success: res => {
          if (res.authSetting["scope.userInfo"]) {
            getUserInfoApi()
              .then(res => {
                this.setData({
                  userInfo: res.userInfo,
                  hasUserInfo: true
                });
                wx.setStorage({
                  key: "hasUserInfo",
                  data: res.userInfo
                });
                return res;
              })
              .then(res => setUserRequest(res.rawData, res.signature));
          }
        }
      });
    }
  },
  onNav(e) {
    wx.navigateTo({
      url: e.target.dataset.url
    });
    wx.reportAnalytics("link_to_page", {
      url: e.target.dataset.url
    });
  },
  test() {
    testRequest().then(data => {
      console.log(data);
    });
  }
});
