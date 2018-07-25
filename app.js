//app.js
App({
    onLaunch: function () {
        //检查用户登录状态
        wx.checkSession({
            // 如果已经登录过，则跳过登录
            success: res => {
                getUserInfo.call(this);
            },
            // 登录过期需要重新登录
            fail: res => {
                login().then((code) => {
                    return requestLogin(code);
                }).then((res) => {
                    if (res && res.data && res.data.success) {
                        wx.setStorage({
                            key: "code",
                            data: code
                        })
                    }
                }).catch((data) => {
                    console.error('data', data);
                })
            }
        });
    },
    globalData: {
        userInfo: null
    }
});

function getUserInfo() {
    wx.getSetting({
        success: res => {
            if (res.authSetting['scope.userInfo']) {
                // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                wx.getUserInfo({
                    success: res => {
                        // 可以将 res 发送给后台解码出 unionId
                        this.globalData.userInfo = res.userInfo

                        // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                        // 所以此处加入 callback 以防止这种情况
                        if (this.userInfoReadyCallback) {
                            this.userInfoReadyCallback(res)
                        }
                    }
                })
            }
        }
    })
}
//拿code 取sessionId
function requestLogin(code) {
    return new Promise((resolve, reject) => {
        wx.request({
            url: 'https://adazhang.com/login', 
            data: {
                code
            },
            success: function (res) {
                // console.log(res.data)
                resolve(res);
            },
            fail: function (res) {
                reject(res);
            }
        })
        console.log('code', code);//发起请求
    })
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
    })
}
