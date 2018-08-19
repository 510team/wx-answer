import { getUserLevel } from "../../services/game-over";
import { getAllBackground, setBackground } from "../../services/background";
// const app = getApp();

Page({
  data: {
    changeNum: 0,
    pics: []
  },
  onTapChange: function(e) {
    const index = e.target.dataset.index;
    const pic = e.target.dataset.src;
    console.log('!!!!!!',index,pic)
    if (index < this.data.changeNum) {
      //更换壁纸
      setBackground({ img: pic }).then(res => {
        if (res.success) {
          wx.showToast({
            title: "更新成功",
            icon: "success",
            success: function() {
              wx.redirectTo({
                url: "/pages/index/index",
                success: function(res) {},
                fail: function(res) {
                  console.log("fail:", res);
                }
              });
            }
          });
        }
      });
    } else {
      //提示不能更换
      wx.showModal({
        title: "快来看",
        cancelColor: "#646464",
        confirmColor: "#ff777c",
        cancelText: "再看看",
        confirmText: "增加积分",
        content:
          "您现在的积分还不能更换该张壁纸哦，赶紧玩起来增加自己的积分吧！",
        success: function(res) {
          if (res.confirm) {
            wx.redirectTo({
              url: "/pages/answer/answer",
              success: function(res) {},
              fail: function(res) {
                console.log("fail:", res);
              }
            });
          } else if (res.cancel) {
          }
        }
      });
    }
  },
  onLoad: function() {
    // const userInfo = app.globalData.userInfo;
    // wx.showLoading({
    //   mask: true
    // });
    getAllBackground().then(res => {
      // debugger;
      if (res.success) {
        this.setData({
          pics: res.data.lists,
          cur:res.data.cur
        });
      } else {
        console.log(res);
      }
    });
    getUserLevel().then(res => {
      //   wx.hideLoading();
      if (res.success && res.current_level) {
        const grade = res.current_level.grade;
        this.setData({
          changeNum: grade //等级和可换背景的数量相同
        });
      }
    });
  }
});
