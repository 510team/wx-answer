// pages/demo/demo.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    requestData: '---'
  },
  requestTask() {
    let t = this;
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      mask: true
    }) 
    wx.request({
      url: 'https://adazhang.com/', //仅为示例，并非真实的接口地址
      data: {},
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        t.setData({
          requestData: JSON.stringify(res.data)
        })
      },
      fail(err) {
        t.setData({
          requestData: JSON.stringify(err)
        })
      },
      complete: function (res) {
        wx.stopPullDownRefresh();
        wx.hideToast();
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.requestTask();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})