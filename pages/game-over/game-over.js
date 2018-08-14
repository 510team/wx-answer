import { getUserLevel, updateHighScore } from "../../services/game-over";
// 使用app.js中拿到的用户信息
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {}, // 用户信息
    correctQues: 0, // 当前局答对的题数
    currentScore: 0, // 当前局的得分
    nextLevel: {}, // 下一个等级信息
    currentLevel: {}, // 当前等级信息
    gapScore: 100, // 分值差
    highestScore: 0, // 历史最高分,
    isNewRecord: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // options是获取页面路径中的参数
    const quesTimes = options.time.split(",");
    const currentScores = this.onCalculateScores(quesTimes, options.account);

    // 获取用户信息
    this.setData({
      userInfo: app.globalData.userInfo,
      correctQues: options.account, //当前答对的题数
      currentScore: currentScores
    });
    // 添加分数到score表
    updateHighScore({ score: currentScores }).then(res => {
      console.log("res", res);
      if (res.success) {
        this.setData({
          isNewRecord: res.data.new_record
        });
        this.onGetCurrentLevel();
      }
    });

    // 是否获取群信息
    wx.showShareMenu({
      withShareTicket: true
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
  onShareAppMessage: function(options) {
    console.log("options", options);
    if (options.from === "button") {
      console.log(options.target);
    }
    debugger;
    return {
      title: "快来拯救我～～～",
      path: "pages/index/index",
      imageUrl: "../../assets/image/index_bg@2x.png",
      success: function(res) {
        console.log("res", res);
        /* const shareTickets = res.shareTickets;
        if (shareTickets.length == 0) {
          return false;
        }
        // 获取群信息
        wx.getShareInfo({
          shareTicket: shareTickets[0]
        }); */
      },
      fail: function(res) {
        console.log("转发到群失败");
      }
    };
  },

  /**
   * 再来一局
   */
  onPlay: function() {
    wx.redirectTo({
      url: "/pages/answer/answer"
    });
  },

  /**
   * 再来一局
   */
  onRanks: function() {
    wx.redirectTo({
      url: "/pages/ranks/ranks"
    });
  },

  /**
   * 计算分数
   */
  onCalculateScores(arr, items) {
    /* 
    * 计算规则
    * arr是所有题目完成的时间，包括打错的时间
    * items是答对了多少题
    * 0~3秒内完成得30分
    * 4～7秒内完成得17分
    * 8～10秒内完成得10分
    */
    let sum = 0; //用来存储最后得分
    for (let i = 0; i < items; i++) {
      const time = parseInt(arr[i]);
      if (time >= 0 && time <= 3) {
        // 0~3秒
        sum += 30;
      } else if (time >= 4 && time <= 7) {
        // 4～7秒
        sum += 17;
      } else if (time >= 8 && time <= 10) {
        //8～10秒
        sum += 10;
      }
    }
    return sum;
  },
  onGetCurrentLevel() {
    // 当前用户级别
    getUserLevel().then(res => {
      if (res.success) {
        if (res.current_level && res.next_level) {
          const score = res.next_level.lowest_score - res.score_info.score;
          this.setData({
            nextLevel: res.next_level,
            currentLevel: res.current_level,
            gapScore: score,
            highestScore: res.score_info.score
          });
        }
      }
    });
  }
});
