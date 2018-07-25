//app.js
import { loginApi, loginServer, setUserInfo, getUserInfo  } from "./services/login.js";

App({
    onLaunch: function () {
        //检查用户登录状态
        wx.checkSession({
            // 如果已经登录过，则跳过登录
            success: res => {
                getUserInfo().then(data => {
                    this.globalData.userInfo = res.userInfo;
                    //由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回 所以此处加入 callback 以防止这种情况
                    if (this.userInfoReadyCallback) {
                        this.userInfoReadyCallback(res);
                    }
                    return true;
                }).then(()=>{
                    return setUserInfo();
                })
            },
            // 登录过期需要重新登录
            fail: res => {
                loginApi()
                    .then(code => {
                        return loginServer(code);
                    }).then(data => {
                        return wx.setStorage({
                            key: "code",
                            data: code
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



