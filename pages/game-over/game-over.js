Page({
  /**
   * 页面的初始数据
   */
  data: {
    currentRound: {
      score: 150,
      questions: 3
    },
    currentLevel: 2,
    processData: [
      {
        id: 1,
        name: "初学乍到",
        icon: "iconfont icon-level1"
      },
      {
        id: 2,
        name: "游学四方",
        icon: "iconfont icon-level2"
      },
      {
        id: 3,
        name: "有学而志",
        icon: "iconfont icon-level3"
      },
      {
        id: 4,
        name: "青年俊才",
        icon: "iconfont icon-level4"
      },
      {
        id: 5,
        name: "学长师友",
        icon: "iconfont icon-level5"
      }
    ],
    nextLevel: "",
    nextScore: 100
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log("~~~~~~~", options);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.setData({
      nextLevel: this.data.processData[this.data.currentLevel + 1].name
    });
  },

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
