import { getUserLevel } from "../../services/game-over";
import { getAllBackground, setBackground } from "../../services/background";
import { showModal } from "../../utils/util";
import { serverHost } from "../../config/index";

const app = getApp();

Page({
  data: {
    changeNum: 0,
    pics: []
  },
  onTapChange: function(e) {
    const _self = this;
    const index = e.target.dataset.index;
    const pic = e.target.dataset.src;
    if (index < this.data.changeNum) {
      //更换壁纸
      // const picUrl = pic.
      setBackground({ img: pic }).then(res => {
        if (res.success) {
          app.globalData.background = pic;
          showModal({
            title: "更换成功",
            content: "赶紧去首页看看效果吧！",
            confirmText: "去看看",
            cancelText: "先不去",
            successFun: function() {
              wx.navigateTo({
                url: "/pages/index/index",
                success: function(res) {},
                fail: function(res) {
                  console.log("fail:", res);
                }
              });
            }
          });
        } else {
          wx.showToast({
            title: "更新失败，请稍后再试"
          });
        }
      });
    } else {
      //提示不能更换
      showModal({
        title: "快来看",
        content:
          "您现在的积分还不能更换该张壁纸哦，赶紧玩起来增加自己的积分吧！",
        confirmText: "增加积分",
        cancelText: "再看看",
        successFun: function() {
          wx.redirectTo({
            url: "/pages/answer/answer",
            success: function(res) {},
            fail: function(res) {
              console.log("fail:", res);
            }
          });
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
      if (res.success) {
        var pics = [];
        if (res.data.lists.length > 0) {
          pics = res.data.lists.map(item => {
            return serverHost + item;
          });
        }
        this.setData({
          pics: pics,
          cur: res.data.cur
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
          changeNum: grade - 1 //等级和可换背景的数量相同
        });
      }
    });
  }
});
