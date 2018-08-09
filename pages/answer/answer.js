var util = require("../../utils/util.js");

// const app = getApp();

Page({
  data: {
    timer: null,
    answer: "",
    initDuration: 10, //每题最长时长
    curKey: "",
    countdown: 0, //当前计时器的展示时间
    curIndex: 0, //当前题目的索引值
    answerItem: null, //当前的题目
    correctAmount: 0, //正确数量
    answerItems: []
  },
  onTapCheck: function(e) {
    // 回答正确题目继续，回答错误自动退出，超时直接退出
    this.setData({ curKey: e.target.dataset.key });
    if (e.target.dataset.key == this.data.answerItem.answer) {
      const curDuration = this.data.initDuration - this.data.countdown;
      // console.log("!!!!!", curDuration);
      this.setData({
        recordTime: curDuration + this.data.recordTime,
        correctAmount: this.data.correctAmount + 1
      });
      util.showSuccess("恭喜你，答对了！");
      setTimeout(() => {
        this.goNextQuestion();
      }, 500);
    } else {
      clearTimeout(this.timer);
      this.setData({ ["answerItem.disabled"]: true });
      util.showModel("答错了，当心回家跪键盘！");
      // wx.redirectTo({
      //   url: "/pages/index/index"
      // });
    }
  },
  requestList: function() {
    const _this = this;
    wx.request({
      url: "http://127.0.0.1:8362/questions",
      data: {
        offset: 0,
        count: 10
      },
      header: {
        "content-type": "application/json" // 默认值
      },
      success(res) {
        // util.showSuccess("请求成功完成");
        _this.setData({
          answerItems: res.data
        });
        //开始展示题目
        _this.goNextQuestion();
      },
      fail(error) {
        // util.showModel("请求失败", error);
        console.log("request fail", error);
      }
    });
  },
  setCountdown: function() {
    this.timer = setTimeout(() => {
      this.setData({ countdown: this.data.countdown - 1 });
      if (this.data.countdown == 0) {
        //超时退出
        this.setData({ ["answerItem.disabled"]: true });
        clearTimeout(this.timer);
        util.showModel("回答超时了哦！");
        // wx.redirectTo({
        //   url: "/pages/index/index"
        // });
      } else {
        this.setCountdown();
      }
    }, 1000);
  },
  goNextQuestion() {
    if (this.timer) {
      clearTimeout(this.timer);
    }
    if (this.data.curIndex == this.data.answerItems.length) {
      console.log(this.data.curIndex);
      //最后一道题
      util.showModel(
        "恭喜你，答对了" +
          this.data.correctAmount +
          "道题，总时长" +
          this.data.recordTime +
          "秒"
      );
      // wx.redirectTo({
      //   url: "/pages/result"
      // });
      return;
    }
    //每题开始，初始化数据
    this.setData({
      countdown: this.data.initDuration,
      curKey: "",
      answerItem: {
        ...this.data.answerItems[this.data.curIndex],
        id: this.data.curIndex + 1
      }
    });
    //初始化后，curIndex再+1
    this.setData({
      curIndex: this.data.curIndex + 1
    });
    this.setCountdown();
  },
  onLoad: function() {
    this.requestList();
  }
});
