//index.js
import httpRequest from "../../utils/request.js";
import { loginAction } from "../../services/login.js";
import { getUserLevel } from "../../services/game-over";
import { getAllBackground } from "../../services/background";

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
// const serverHost = "https://adazhang.com";
const serverHost = "http://localhost:8362";

Page({
  data: {
    motto: "Hello World",
    userInfo: {},
    hasUserInfo: false,
    level: "",
    canIUse: wx.canIUse("button.open-type.getUserInfo"),
    backgroundUrl: ""
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: "../logs/logs"
    });
  },
  onLoad: function() {
    wx.showShareMenu({
      withShareTicket: true
    });
    //检查code
    wx.getStorage({
      key: "code",
      success: res => {
        getUserLevel().then(res => {
          this.setData({
            level: res.current_level.name
          });
        });
        getAllBackground().then(res => {
          if (res.success) {
            app.globalData.background = serverHost + res.data.cur;
            this.setData({ backgroundUrl: app.globalData.background });
          }
        });
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
  },
  onShare(options) {
    if (options.from === "button") {
      console.log(options.target);
    }
    return {
      title: "敢来和我pk下吗？",
      path: "pages/index/index",
      imageUrl: "../../assets/image/share.jpg",
      success: function(res) {
        console.log("res", res);
      },
      fail: function(res) {
        console.log("转发到群失败");
      }
    };
  }
});
