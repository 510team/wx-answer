import { getQuestionsRequest, answerQuestion } from "../../services/answer.js";
import CountdownCanvas from "../../utils/countdown";
const app = getApp();
let countdownCanvas = null;
Page({
  data: {
    loaded: false,
    timer: null,
    answer: "",
    initDuration: 10, //每题最长时长
    countdown: 0, //当前计时器的展示时间
    curIndex: 0, //当前题目的索引值
    answerItem: null, //当前的题目
    recordTime: [], //每题时间组成的数组
    correctAmount: 0, //正确数量
    answerItems: [], //所有题目
    backgroundUrl: "", //背景
    buttonClass: ["", "", "", ""], //按钮的样式class
    rightAnswerIndex: 0, //正确答案的索引
    answerRight: "", //回答正确否
    contentShow: false //内容是否显示
  },
  onReady: function() {
    this.setData({ backgroundUrl: app.globalData.background });
  },
  onTapCheck: function(e) {
    var _self = this;
    const userAnswer = e.target.dataset.key;
    const index = e.target.dataset.index * 1;
    const curIndexClass = "buttonClass[" + index + "]";
    this.setData({
      [curIndexClass]: "btn-cur"
    });
    const curDuration = this.data.initDuration - this.data.countdown;
    let recordTime = this.data.recordTime;
    recordTime.push(curDuration);
    //上传问题和回答
    this.onAnswer({
      question_id: this.data.answerItem.id,
      answer: userAnswer,
      duration: curDuration
    });
    //倒计时结束
    countdownCanvas.stop();

    // 回答正确题目继续，回答错误自动退出，超时直接退出
    if (userAnswer == this.data.answerItem.answer) {
      this.setData({
        recordTime: recordTime,
        correctAmount: this.data.correctAmount + 1,
        [curIndexClass]: "btn-right"
      });
      setTimeout(() => {
        this.setData({ answerRight: "true" });
      }, 500);
      setTimeout(function() {
        _self.goNextQuestion();
      }, 1500);
    } else {
      // 回答错误
      clearTimeout(this.timer);
      const rightIndexClass = "buttonClass[" + this.data.rightAnswerIndex + "]";
      this.setData({
        ["answerItem.disabled"]: true,
        recordTime: recordTime,
        [rightIndexClass]: "btn-right",
        [curIndexClass]: "btn-wrong"
      });
      setTimeout(() => {
        this.setData({ answerRight: "false" });
      }, 500);
      setTimeout(function() {
        _self.goLink();
      }, 1500);
    }
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
          countdown: "时间到"
        });

        setTimeout(() => {
          _self.goLink();
        }, 1500);
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
      countdown: this.data.initDuration,
      answerItem: {
        ...this.data.answerItems[this.data.curIndex],
        showId: this.data.curIndex + 1
      },
      buttonClass: ["", "", "", ""],
      answerRight: "",
      contentShow: false
    });
    //初始化样式的数据
    setTimeout(() => {
      this.setData({ contentShow: true });
      countdownCanvas = new CountdownCanvas();
      countdownCanvas.countdown();
      this.setCountdown();
    }, 800);

    //计算正确答案的index值
    for (let i = 0, l = this.data.answerItem.items.length; i < l; i++) {
      if (this.data.answerItem.items[i].key == this.data.answerItem.answer) {
        this.setData({ rightAnswerIndex: i * 1 });
        break;
      }
    }

    //初始化后，curIndex再+1
    this.setData({
      curIndex: this.data.curIndex + 1
    });
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
    getQuestionsRequest().then(res => {
      if (res.success) {
        this.setData({
          loaded: true,
          answerItems: res.data
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
