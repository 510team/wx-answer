// pages/demo/demo.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    requestData: '',
    animationData: {}
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
  onVibrate() {
    wx.vibrateShort({
      success: function(res) {
        console.log(res);
      },
      fail(err) {
        console.log(err);
      }
    })
  },
  onAnimatio() {
    var animation = wx.createAnimation({
      duration: 1000,
      timingFunction: "linear"
    })
    this.animation = animation
    animation.scale(2, 2).rotate3d(45,45,45,45).backgroundColor('#000').step();
    this.setData({
      animationData: animation.export()
    })
    setTimeout(function () {
      animation.translate(30).step();
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 1000)
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