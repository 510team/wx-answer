var util = require("../../utils/util.js");
import { getQuestionsRequest, answerQuestion } from "../../services/answer.js";
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
    correctAmount: 0, //正确数量
    answerItems: [], //所有题目
    curRight: false, //当前题目正确（添加动画所需变量）
    curWrong: false, //当前题目回答错误
    animation: ""
  },
  onReady: function() {
    // 页面渲染完成
    //实例化一个动画
    const animation = wx.createAnimation({
      duration: 2000,
      timingFunction: "ease-in-out",
      delay: 100,
      transformOrigin: "center center 0",
      success: function(res) {
        console.log(res);
      }
    });
    this.animation = animation;
  },
  onTapCheck: function(e) {
    // 回答正确题目继续，回答错误自动退出，超时直接退出
    
    const userAnswer = e.target.dataset.key;
    this.setData({ curKey: userAnswer });
    this.onAnswer({
      question_id: this.data.answerItem.id,
      answer: userAnswer
    });
    if (userAnswer == this.data.answerItem.answer) {
      const curDuration = this.data.initDuration - this.data.countdown;
      // console.log("!!!!!", curDuration);
      this.setData({
        recordTime: curDuration + this.data.recordTime,
        correctAmount: this.data.correctAmount + 1,
        curRight: true
      });
      // this.animation
      //   .opacity(1)
      //   .step()
      //   .translate("50%")
      //   .scale(1)
      //   .step()
      //   .opatity(0)
      //   .step()
      //   .translate("200%")
      //   .step({ ducation: 2000 });
      // this.setData({
      //   //输出动画
      //   animation: this.animation.export()
      // });
      util.showModel("恭喜你，答对了！");
      setTimeout(() => {
        this.goNextQuestion();
      }, 500);
    } else {
      //回答错误
      clearTimeout(this.timer);
      this.setData({ ["answerItem.disabled"]: true, curWrong: true });
      util.showModel("答错了，当心回家跪键盘！",undefined,()=>{
        wx.redirectTo({
          url: "/pages/game-over/game-over"
        });
      });
    
    }
    wx.reportAnalytics('action_tap_check', {
      connet: userAnswer
    });
  },
  setCountdown: function() {
    this.timer = setTimeout(() => {
      this.setData({ countdown: this.data.countdown - 1 });
      if (this.data.countdown == 0) {
        //超时退出
        this.setData({ ["answerItem.disabled"]: true });
        clearTimeout(this.timer);
        util.showModel("回答超时了哦！", undefined, () => {
          wx.redirectTo({
            url: "/pages/game-over/game-over"
          });
        });
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
      /*
      util.showModel(
        "恭喜你，答对了" +
          this.data.correctAmount +
          "道题，总时长" +
          this.data.recordTime +
          "秒"
      );
      */
      wx.redirectTo({
        url: "/pages/game-over/game-over"
      });
      return;
    }
    //每题开始，初始化数据
    this.setData({
      countdown: this.data.initDuration,
      curRight: false,
      curWrong: false,
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
