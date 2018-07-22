//app.js
App({
  onLaunch: function() {
    //检查用户登录状态
    wx.checkSession({
      // 如果已经登录过，则跳过登录
      success: res => {
        console.log("登录状态未失效");
      },
      // 登录过期需要重新登录
      fail: res => {
        wx.login({
          success: res => {
            if (res.code) {
              // 发送 res.code 到后台换取 openId, sessionKey, unionId
              wx.request({
                url: "/wx/ajax-login",
                data: {
                  code: res.code
                },
                success: data => {
                  // 本地storge存储 sessionId
                  wx.setStorage({
                    key: "session_key",
                    data: data.sessionKey
                  });
                },
                fail: data => {
                  console.log("向后台换取openId接口失败");
                }
              });
            } else {
              console.log("获取用户登录态失败" + res.errMsg);
            }
          }
        });
      }
    });

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (!res.authSetting["scope.userInfo"]) {
          // 未授权需要询问用户是否授权
          wx.authorize({
            scope: "scope.userInfo",
            success: res => {
              //授权成功，保存用户信息，获取userid
              saveUser(this);
            },
            fail: err => {
              //授权失败， 在此提示用户去授权
              showModal(this);
            }
          });
        } else {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          saveUser(this);
        }
      }
    });
  },

  globalData: {
    userInfo: null
  }
});

//保存用户信息
function saveUser(t) {
  wx.getUserInfo({
    success: res => {
      let userInfo = res.userInfo;
      // 初始化用户数据
      t.globalData.userInfo = userInfo;

      wx.getStorage({
        key: "userId",
        complete: mes => {
          if (!mes.data) {
            // 发送请求
            wx.request({
              url: "/user/ajax-update-employee-info",
              method: "POST",
              data: {
                signature: res.signature,
                nickName: userInfo.nickName,
                gender: userInfo.gender
              },
              success: data => {
                if (data.success) {
                  // 本地缓存
                  wx.setStorage({
                    key: "userId",
                    data: data.userId
                  });
                  t.globalData.userInfo["userId"] = data.userId;
                }
              },
              fail: err => {
                console.log("接口调用失败：" + err);
              }
            });
          } else {
            t.globalData.userInfo["userId"] = mes.data;
          }
        }
      });
    }
  });
}

//弹出授权模态框
function showModal(t) {
  wx.showModal({
    title: "提示",
    content: "必须授权登陆之后才能继续使用小程序，是否重新授权登陆？",
    success: res => {
      // 点击确定，重新授权
      if (res.confirm) {
        wx.openSetting({
          success: data => {
            saveUser(t);
          },
          fail: err => {
            console.log("模态框加载失败：" + err);
          }
        });
        // 点击取消,退出到上一个页面
      } else if (res.cancel) {
        wx.navigateBack({
          delta: 1
        });
      }
    },
    fail: err => {
      console.log(err);
    }
  });
}
