import { getUserLevel } from "../../services/game-over";
import { getPointRequest } from "../../services/signIn";
const app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    point: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const t = this;
    wx.getStorage({
      key: "hasUserInfo",
      success: function(res) {
        if (res.data) {
          t.setData({
            userInfo: res.data
          });
        }
      }
    });
    getUserLevel().then(res => {
      if (res.success) {
        let uinfo = t.data.userInfo;
        uinfo.score = res.score_info.score;
        uinfo.total_score = res.score_info.total_score;
        uinfo.level = res.current_level.name;
        t.setData({
          userInfo: uinfo
        });
      }
    });
    getPointRequest().then(res => {
      if (res.success) {
        this.setData({ point: res.point });
      }
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {}
});
