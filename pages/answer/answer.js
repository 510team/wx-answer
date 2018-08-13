// var util = require("../../utils/util.js");
import { getQuestionsRequest, answerQuestion } from "../../services/answer.js";
// import { callbackify } from "util";
// const app = getApp();

Page({
  data: {
    timer: null,
    answer: "",
    initDuration: 10, //每题最长时长
    curKey: "", //当前的key
    countdown: 0, //当前计时器的展示时间
    curIndex: 0, //当前题目的索引值
    answerItem: null, //当前的题目
    recordTime: [], //每题时间组成的数组
    correctAmount: 0, //正确数量
    answerItems: [], //所有题目
    showRightBox: false, //动画框是否显示
    showRight: "", //动画l类型
    animationData: {}
  },
  onReady: function() {
    // 页面渲染完成,实例化一个动画
    this.animationReset();
  },
  onTapCheck: function(e) {
    var _self = this;
    // 回答正确题目继续，回答错误自动退出，超时直接退出
    this.setData({ curKey: e.target.dataset.key, showRightBox: true });
    const userAnswer = e.target.dataset.key;
    this.onAnswer({
      question_id: this.data.answerItem.id,
      answer: userAnswer
    });
    if (this.data.curKey == this.data.answerItem.answer) {
      const curDuration = this.data.initDuration - this.data.countdown;
      let recordTime = this.data.recordTime;
      recordTime.push(curDuration);
      this.setData({
        recordTime: recordTime,
        correctAmount: this.data.correctAmount + 1,
        showRight: "right"
      });
      this.animationFun(function() {
        _self.goNextQuestion();
      });
    } else {
      // 回答错误
      clearTimeout(this.timer);
      this.setData({
        ["answerItem.disabled"]: true,
        showRight: "wrong"
      });
      this.animationFun(function() {
        _self.goLink();
      });
    }
  },
  animationFun: function(callback) {
    var _self = this;
    this.animation
      .translate3d("-50%", "-100%", 0)
      .scale(6)
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
      animationData: this.animation.export(),
      showRightBox: ""
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
          showRightBox: true,
          ["answerItem.disabled"]: true,
          showRight: "timeout"
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
      this.goLink();
      return;
    }
    //每题开始，初始化数据
    this.setData({
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

    wx.navigateTo({
      url: `/pages/game-over/game-over?account=${correctAmount}&time=${recordTimeStr}`
    });
  },
  onLoad: function() {
    getQuestionsRequest().then(res => {
      this.setData({
        answerItems: res.data
      });
      this.goNextQuestion();
    });
  },
  onAnswer(param) {
    answerQuestion(param);
  },
  onUnload() {
    clearTimeout(this.timer);
  }
});
