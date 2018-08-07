//index.js
import httpRequest from "../../utils/request.js";
import {
  loginApi,
  getUserInfoApi,
  getUserSettingApi,
  loginRequest,
  setUserRequest
} from "../../services/login.js";
import {
  testRequest
} from "../../services/test.js";
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
        return res;
      };
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      getUserInfoApi()
        .then(res => {
          app.globalData.userInfo = res.userInfo;
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          });
          return res;
        })
        .then(res => setUserRequest(res.rawData, res.signature));
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
  },
  getUserInfo:function(e){
    console.log('userinfo',e);
    if(this.data.hasUserInfo){
      wx.navigateTo({
        url: e.target.dataset.url
      })
    }else{
      app.globalData.userInfo = e.detail.userInfo
      this.setData({
        userInfo: e.detail.userInfo,
        hasUserInfo: true
      })
      setUserRequest(e.detail.rawData, e.detail.signature).then(()=>{
        wx.navigateTo({
          url: e.target.dataset.url
        })
      })
    }
  },
  test(){
    testRequest().then((data)=>{
      console.log(data);
    })
  }
});


