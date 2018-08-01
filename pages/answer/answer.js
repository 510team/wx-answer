var util = require("../../utils/util.js");

// const app = getApp();

Page({
  data: {
    timer: null,
    initDuration: 10, //时长
    countdown: 0, //当前计时器的展示时间
    curIndex: 0, //当前题目的索引值
    answerItem: null, //当前的题目
    correctAmount: 0, //正确数量
    answerItems: [
      //所有题目
      {
        id: 1,
        title: "我和范冰冰谁好看",
        A: "你好看",
        B: "范冰冰好看",
        C: "你和谁比都是你好看",
        D: "你俩都不好看",
        answer: "C"
      },
      {
        id: 2,
        title: "我把口红弄到你衣服上了",
        A: "没事儿，再买件衣服就行",
        B: "怎么这么不小心",
        C: "宝贝儿别伤心，再给你买只新口红",
        D: "口红还能接着用吗",
        answer: "C"
      },
      {
        id: 3,
        title: "你去参加同学聚会，有女同学坐你的大腿上，怎么办",
        A: "我不会让她做我大腿上的",
        B: "放心，我根本不会参加同学聚会",
        C: "没事儿，不会的",
        D: "怎么可能呢",
        answer: "B"
      }
    ]
  },
  radioChange: function(e) {
    // console.log(e.detail.value);
    if (e.detail.value == this.data.answerItem.answer) {
      this.setData({ correctAmount: this.data.correctAmount + 1 });
      util.showSuccess("恭喜你，答对了！");
    } else {
      util.showModel("答错了，当心回家跪键盘！");
    }
    this.setData({ ["answerItem.disabled"]: true }); //只能选择一次，不能二次选择
  },
  requestList: function() {
    this.goNextQuestion();
    // wx.request({
    //   url: "getList",
    //   data: {
    //     x: "",
    //     y: ""
    //   },
    //   header: {
    //     "content-type": "application/json" // 默认值
    //   },
    //   success: function(res) {
    //     // util.showSuccess("请求成功完成");
    //     this.setData({
    //       answerItems: res.data
    //     });
    //     //开始展示题目
    //     this.goNextQuestion();
    //   },
    //   fail(error) {
    //     // util.showModel("请求失败", error);
    //     console.log("request fail", error);
    //   }
    // });
  },
  setCountdown: function() {
    const _this = this;
    this.timer = setTimeout(() => {
      _this.setData({ countdown: this.data.countdown - 1 });
      if (this.data.countdown == 0) {
        clearTimeout(this.timer);
        this.goNextQuestion();
        return false;
      }
      _this.setCountdown();
    }, 1000);
  },
  goNextQuestion() {
    if (this.timer) {
      clearTimeout(this.timer);
    }
    this.setData({ countdown: this.data.initDuration });
    if (this.data.curIndex == this.data.answerItems.length) {
      util.showModel(
        "恭喜你，答对了" + this.data.correctAmount + "道题！",
        "获得###男友的称号"
      );
      return;
    }
    this.setCountdown();
    this.setData({
      answerItem: {
        ...this.data.answerItems[this.data.curIndex],
        checked: false,
        disabled: false
      }
    });
    this.setData({
      curIndex: this.data.curIndex + 1
    });
  },
  onLoad: function() {
    this.requestList();
  }
});
