const formatTime = date => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();

  return (
    [year, month, day].map(formatNumber).join("/") +
    " " +
    [hour, minute, second].map(formatNumber).join(":")
  );
};

const formatNumber = n => {
  n = n.toString();
  return n[1] ? n : "0" + n;
};

// 提示框
var showModal = ({
  title,
  content,
  confirmText,
  cancelText,
  successFun,
  cancleFun
}) => {
  wx.hideToast();
  wx.showModal({
    title: title || "",
    cancelColor: "#646464",
    confirmColor: "#ff777c",
    cancelText: cancelText || "取消",
    confirmText: confirmText || "确定",
    content: content || "",
    success: function(res) {
      if (res.confirm) {
        successFun && successFun();
      } else if (res.cancel) {
        cancleFun && cancleFun();
      }
    }
  });
};

// 清理storgage

var removeStorage = key => {
  wx.removeStorage({
    key: key,
    success: function(res) {
      console.log(key + "缓存已被清理");
    }
  });
};

var goBackIndex = () => {
  removeStorage("code");
  wx.reLaunch({
    url: "../index/index"
  });
};

module.exports = {
  formatTime,
  formatNumber,
  showModal,
  removeStorage,
  goBackIndex
};
