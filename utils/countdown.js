/**
 * 倒计时圆环
 * totalTime    计数倒计时秒数
 * ringSpace    环倒计时间隔
 * textSpace    文字倒计时间隔
 */
class CountdownCanvas {
  _begin = -((1 / 2) * Math.PI);
  _pai2 = 2 * Math.PI;
  _ringPos = 0;
  _textXPos = 0;
  _textYPos = 0;
  constructor(
    canvasId = "secondCanvas",
    ringSpace = 100,
    textSpace = 1000,
    canvasRaidus = 33,
    ringConfig = { ringColor: "#FFD700", ringWidth: 8 },
    textConfig = { fontSize: "30", fontColor: "#fff" },
    totalTime = 10
  ) {
    this.canvasId = canvasId;
    this.ringSpace = ringSpace;
    this.textSpace = textSpace;
    this.totalTime = totalTime;
    this.canvasRaidus = canvasRaidus;
    this.ringConfig = ringConfig;
    this.textConfig = textConfig;

    this._countdownNum = this.totalTime;
    this._countdownInterval = null;
    this._ringRun = 0;
    this._ringPos = this.canvasRaidus + this.ringConfig.ringWidth;
    this._textXPos = this.canvasRaidus;
    this._textYPos = this.canvasRaidus;

    this._drawRang = this._drawRang.bind(this);
    this.countdown = this.countdown.bind(this);
    this.stop = this.stop.bind(this);
  }
  _drawRang(precent) {
    const cxt_arc = wx.createCanvasContext(this.canvasId);
    //绘制灰色的外圆
    cxt_arc.setLineWidth(8);
    cxt_arc.setStrokeStyle("#ccc");
    cxt_arc.setLineCap("round");
    cxt_arc.beginPath();
    //圆心X,Y,半径，开始弧度，结束弧度，弧度的方向是否是逆时针
    cxt_arc.arc(
      this._ringPos,
      this._ringPos,
      this.canvasRaidus,
      0,
      this._pai2,
      false
    );
    cxt_arc.stroke();

    //绘制动态的内园
    let end = this._pai2 * precent + this._begin;
    if (precent == 0) {
      end = this._pai2 * this._begin;
    } else if (1 == precent) {
      this.ringConfig.ringColor = "#ef8b62";
      //   cxt_arc.setFillStyle(this.textConfig.fontColor);
      //   cxt_arc.setFontSize(this.textConfig.fontSize);
      //   cxt_arc.fillText(this._countdownNum, this._textXPos, this._textYPos);
    }
    cxt_arc.setLineWidth(this.ringConfig.ringWidth);
    cxt_arc.setStrokeStyle(this.ringConfig.ringColor);
    cxt_arc.setLineCap("round");
    cxt_arc.beginPath();
    cxt_arc.arc(
      this._ringPos,
      this._ringPos,
      this.canvasRaidus,
      this._begin,
      end,
      true
    );
    cxt_arc.stroke();
    // cxt_arc.setFillStyle(this.textConfig.fontColor);
    // cxt_arc.setFontSize(this.textConfig.fontSize);
    // cxt_arc.fillText(this._countdownNum, this._textYPos, this._textYPos);
    cxt_arc.draw();
  }
  countdown() {
    const _this = this;
    clearInterval(this._countdownInterval);
    this._countdownInterval = setInterval(() => {
      var n = _this.totalTime - Math.floor(_this._ringRun / _this.textSpace);
      var precent = _this._ringRun / (_this.totalTime * _this.textSpace);
      _this._countdownNum = n;
      _this._drawRang(precent);
      _this._ringRun = _this._ringRun + _this.ringSpace;
      if (precent >= 1) {
        clearInterval(this._countdownInterval);
        return;
      }
    }, _this.ringSpace);
  }
  stop(val) {
    clearInterval(this._countdownInterval);
    this._countdownInterval = null;
  }
  carvasEnd() {
    cxt_arc.setLineWidth(8);
    cxt_arc.setStrokeStyle("#ef8b62");
    cxt_arc.setLineCap("round");
    cxt_arc.beginPath();
  }
}

export default CountdownCanvas;
