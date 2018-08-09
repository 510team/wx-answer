var util = require("../../utils/util.js");
import { getQuestionsRequest } from "../../services/answer.js";
// const app = getApp();

Page({
  data: {
    timer: null,
    initDuration: 10, //每题最长时长
    recordTime: 0, //总时间
    countdown: 0, //当前计时器的展示时间
    curIndex: 0, //当前题目的索引值
    answerItem: null, //当前的题目
    correctAmount: 0, //正确数量
    answerItems: []
  },
  onTapCheck: function(e) {
    // 回答正确题目继续，回答错误知己退出，超时直接退出
    if (e.target.dataset.value == this.data.answerItem.answer) {
      const curDuration = this.data.initDuration - this.data.countdown;
      // console.log("!!!!!", curDuration);
      this.setData({
        recordTime: curDuration + this.data.recordTime,
        correctAmount: this.data.correctAmount + 1
      });
      util.showModel("恭喜你，答对了！");
      setTimeout(() => {
        this.goNextQuestion();
      }, 500);
    } else {
      //回答错误
      clearTimeout(this.timer);
      this.setData({ ["answerItem.disabled"]: true });
      // util.showModel("答错了，当心回家跪键盘！");
      wx.redirectTo({
        url: "/pages/game-over/game-over"
      });
    }
  },
  setCountdown: function() {
    this.timer = setTimeout(() => {
      this.setData({ countdown: this.data.countdown - 1 });
      if (this.data.countdown == 0) {
        //超时退出
        this.setData({ ["answerItem.disabled"]: true });
        clearTimeout(this.timer);
        util.showModel("回答超时了哦！");
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
  onUnload(){
    clearTimeout(this.timer);
  }
});
