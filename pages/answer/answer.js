import { getQuestionsRequest, answerQuestion } from "../../services/answer.js";
const app = getApp();
Page({
  data: {
    loaded: false,
    timer: null,
    answer: "",
    initDuration: 30, //每题最长时长
    curKey: "", //当前的key
    countdown: 0, //当前计时器的展示时间
    curIndex: 0, //当前题目的索引值
    answerItem: null, //当前的题目
    recordTime: [], //每题时间组成的数组
    correctAmount: 0, //正确数量
    answerItems: [], //所有题目
    showRightBox: false, //动画框是否显示
    showRight: "", //动画l类型
    animationData: {},
    backgroundUrl: ""
  },
  onReady: function() {
    // 页面渲染完成,实例化一个动画
    this.animationReset();
    this.setData({ backgroundUrl: app.globalData.background });
    console.log(app.globalData.background);
  },
  onTapCheck: function(e) {
    var _self = this;
    // 回答正确题目继续，回答错误自动退出，超时直接退出
    this.setData({ curKey: e.target.dataset.key });
    const userAnswer = e.target.dataset.key;

    const curDuration = this.data.initDuration - this.data.countdown;
    let recordTime = this.data.recordTime;
    recordTime.push(curDuration);
    this.onAnswer({
      question_id: this.data.answerItem.id,
      answer: userAnswer,
      duration: curDuration
    });
    if (this.data.curKey == this.data.answerItem.answer) {
      this.setData({
        recordTime: recordTime,
        correctAmount: this.data.correctAmount + 1,
        showRight: "right",
        showRightBox: true
      });
      this.animationFun(function() {
        setTimeout(function() {
          _self.goNextQuestion();
        }, 400);
      });
    } else {
      // 回答错误
      clearTimeout(this.timer);
      this.setData({
        ["answerItem.disabled"]: true,
        recordTime: recordTime,
        showRight: "wrong",
        showRightBox: true
      });
      this.animationFun(function() {
        _self.goLink();
      });
    }
  },
  animationFun: function(callback) {
    var _self = this;
    this.animation
      .opacity(1)
      .translate3d("-50%", "-100%", 0)
      .scale(1)
      .step();
    this.setData({
      animationData: this.animation.export()
    });
    function timeout() {
      return new Promise(function(resolve, reject) {
        setTimeout(function() {
          _self.animation.opacity(0).step();
          _self.setData({
            animationData: _self.animation.export()
          });
          resolve();
        }, 1000);
      });
    }
    timeout().then(function() {
      //重置animation
      _self.animationReset();
      callback();
    });
  },
  animationReset: function() {
    var animation = wx.createAnimation({
      transformOrigin: "50% 50%",
      duration: 300,
      timingFunction: "ease-in",
      delay: 0
    });
    this.animation = animation;
    this.animation
      .translate3d("-50%", "-100%", 0)
      .scale(0)
      .opacity(1)
      .step();
    this.setData({
      animationData: this.animation.export()
    });
  },
  setCountdown: function() {
    const _self = this;
    this.timer = setTimeout(() => {
      _self.setData({ countdown: _self.data.countdown - 1 });
      if (_self.data.countdown == 0) {
        //超时退出
        clearTimeout(this.timer);
        this.setData({
          ["answerItem.disabled"]: true,
          showRight: "timeout",
          showRightBox: true
        });
        this.animationFun(function() {
          _self.goLink();
        });
      } else {
        _self.setCountdown();
      }
    }, 1000);
  },
  goNextQuestion() {
    if (this.timer) {
      clearTimeout(this.timer);
    }
    if (this.data.curIndex == this.data.answerItems.length) {
      this.setData({
        ["answerItem.disabled"]: true
      });
      this.goLink();
      return;
    }
    //每题开始，初始化数据
    this.setData({
      showRightBox: false,
      countdown: this.data.initDuration,
      showRight: "",
      curKey: "",
      answerItem: {
        ...this.data.answerItems[this.data.curIndex],
        showId: this.data.curIndex + 1
      }
    });
    //初始化后，curIndex再+1
    this.setData({
      curIndex: this.data.curIndex + 1
    });
    this.setCountdown();
  },
  goLink: function() {
    const recordTimeStr = this.data.recordTime.join(",");
    const correctAmount = this.data.correctAmount;

    wx.redirectTo({
      url: `/pages/game-over/game-over?account=${correctAmount}&time=${recordTimeStr}`,
      success: function(res) {},
      fail: function(res) {
        console.log("fail:", res);
      }
    });
  },
  onLoad: function() {
    getQuestionsRequest({ count: 100 }).then(res => {
      if (res.success) {
        this.setData({
          loaded: true,
          answerItems: res.data,
          answerItem: res.data[0]
        });
        this.goNextQuestion();
      } else {
        console.log(res);
      }
    });
  },
  onAnswer(param) {
    answerQuestion(param);
  },
  onUnload() {
    clearTimeout(this.timer);
  }
});
