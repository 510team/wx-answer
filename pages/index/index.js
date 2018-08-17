//index.js
import httpRequest from "../../utils/request.js";
import { loginAction } from "../../services/login.js";

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
    //检查code
    wx.getStorage({
      key: "code",
      success: res => {
        wx.checkSession({
          success: res => {
            console.log("登陆状态未失效");
          },
          fail: err => {
            // 重新登录
            console.log("登陆状态失效");
            loginAction();
          }
        });
      },
      fail: res => {
        loginAction();
      }
    });
    //检查userInfo
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
  },

  getUserInfo: function(e) {
    if (e.detail.userInfo) {
      this.setData({
        userInfo: e.detail.userInfo,
        hasUserInfo: true
      });
      wx.setStorage({
        key: "hasUserInfo",
        data: e.detail.userInfo
      });
      setUserRequest(e.detail.rawData, e.detail.signature);
    }
  },
  onNav(e) {
    wx.navigateTo({
      url: e.target.dataset.url
    });
    wx.reportAnalytics("link_to_page", {
      url: e.target.dataset.url
    });
  }
});
