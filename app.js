//app.js
import { loginAction, getUserInfoAction } from "./services/login.js";

App({
  onLaunch: function() {
    //检查用户登录状态
    // wx.getStorage({
    //   key: "code",
    //   success: res => {
    //     wx.checkSession({
    //       success: res => {
    //         console.log("登陆状态未失效");
    //       },
    //       fail: err => {
    //         // 重新登录
    //         console.log("登陆状态失效");
    //         loginAction();
    //       }
    //     });
    //   },
    //   fail: res => {
    //     loginAction();
    //   }
    // });
    // getUserInfoAction();
  },

  globalData: {
    userInfo: null,
    isLogin: false
  }
});
