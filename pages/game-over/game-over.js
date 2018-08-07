Page({
  /**
   * 页面的初始数据
   */
  data: {
    currentRound: {
      score: 150,
      questions: 3
    },
    processData: [
      {
        id: "1",
        name: "初学乍到",
        start: "transparent",
        end: "rgb(136, 99, 29)",
        icon: "../../assets/image/level1-2.svg"
      },
      {
        id: "2",
        name: "",
        start: "rgb(136, 99, 29)",
        end: "rgb(136, 99, 29)",
        icon: "../../assets/image/level2-1.svg"
      },
      {
        id: "3",
        name: "",
        start: "rgb(136, 99, 29)",
        end: "transparent",
        icon: "../../assets/image/level3-1.svg"
      }
    ],
    nextLevel: "游学而至",
    nextScore: 100
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {},

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
  }
});
