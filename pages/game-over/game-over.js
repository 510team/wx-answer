import { getUserLevel } from "../../services/game-over";
// 使用app.js中拿到的用户信息
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    currentRound: {
      questions: 3
    },
    currentScore: 0,
    nextLevel: {},
    currentLevel: {},
    gapScore: 100,
    levelInfo: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // 获取用户信息
    this.setData({ userInfo: app.globalData.userInfo });

    // 当前用户级别
    getUserLevel({
      open_id: this.data.userInfo.openid
    }).then(res => {
      if (res.success) {
        if (res.current_level && res.next_level) {
          const score = res.next_level.lowest_score - res.score_info.score;
          this.setData({
            nextLevel: res.next_level,
            currentLevel: res.current_level,
            gapScore: score,
            currentScore: res.score_info.score
          });
        }
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
  onShareAppMessage: function() {
    console.log(123);
  },

  /**
   * 再来一局
   */
  onPlay: function() {
    wx.navigateTo({
      url: "/pages/answer/answer"
    });
  }
});
