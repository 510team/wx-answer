const io = require('../../../utils/socket/weapp.socket.io.js')

//index.js
//获取应用实例
const app = getApp()

/**
 * 生成一条聊天室的消息的唯一 ID
 */
function msgUuid() {
  if (!msgUuid.next) {
    msgUuid.next = 0
  }
  return 'msg-' + ++msgUuid.next
}

/**
 * 生成聊天室的系统消息
 */
function createSystemMessage(content) {
  return { id: msgUuid(), type: 'system', content }
}

/**
 * 生成聊天室的聊天消息
 */
function createUserMessage(content, username, isMe) {
  const color = getUsernameColor(username)
  return { id: msgUuid(), type: 'speak', content, username, isMe, color }
}

var COLORS = [
  '#e21400',
  '#91580f',
  '#f8a700',
  '#f78b00',
  '#58dc00',
  '#287b00',
  '#a8f07a',
  '#4ae8c4',
  '#3b88eb',
  '#3824aa',
  '#a700ff',
  '#d300e7',
]

// Gets the color of a username through our hash function
function getUsernameColor(username) {
  // Compute hash code
  var hash = 7
  for (var i = 0; i < username.length; i++) {
    hash = username.charCodeAt(i) + (hash << 5) - hash
  }
  // Calculate color
  var index = Math.abs(hash % COLORS.length)
  return COLORS[index]
}

Page({
  data: {
    inputContent: 'Hello everybody',
    messages: [],
    lastMessageId: 'none',
  },

  onLoad: function() {},

  /**
   * 页面渲染完成后，启动聊天室
   * */
  onReady() {
    wx.setNavigationBarTitle({ title: 'weapp.socket.io 聊天室演示' })
    if (!this.pageReady) {
      this.pageReady = true
      this.enter()
    }
  },

  /**
   * 后续后台切换回前台的时候，也要重新启动聊天室
   */
  onShow() {
    if (this.pageReady && !this.socket) {
      this.enter()
    }
  },

  onUnload() {
    this.quit()
  },

  quit() {
    if (this.socket) {
      this.socket.close()
      this.socket = null
    }
  },

  /**
   * 启动聊天室
   */
  enter() {
    this.pushMessage(createSystemMessage('正在登录...'))

    // 如果登录过，会记录当前用户在 this.me 上
    if (!this.me) {
      this.me = app.globalData.userInfo
      this.createConnect()
    } else {
      this.createConnect()
    }
  },

  /**
   * 通用更新当前消息集合的方法
   */
  updateMessages(updater) {
    var messages = this.data.messages
    updater(messages)

    this.setData({ messages })

    // 需要先更新 messagess 数据后再设置滚动位置，否则不能生效
    var lastMessageId = messages.length
      ? messages[messages.length - 1].id
      : 'none'
    this.setData({ lastMessageId })
  },

  /**
   * 追加一条消息
   */
  pushMessage(message) {
    this.updateMessages(messages => messages.push(message))
  },

  /**
   * 替换上一条消息
   */
  amendMessage(message) {
    this.updateMessages(messages => messages.splice(-1, 1, message))
  },

  /**
   * 删除上一条消息
   */
  popMessage() {
    this.updateMessages(messages => messages.pop())
  },

  changeInputContent: function(e) {
    this.setData({
      inputContent: e.detail.value,
    })
  },

  sendMessage: function(e) {
    const msg = e.detail.value
    if (!msg) {
      return
    }
    const wsData = createUserMessage(msg, this.me.nickName)
    this.socket.emit('chat', wsData)
    this.setData({ inputContent: null })
  },

  createConnect: function(e) {
    this.amendMessage(createSystemMessage('正在加入群聊...'))

    const socket = (this.socket = io(
      'ws://127.0.0.1:8362/',
    ))

    /**
     * Aboud connection
     */
    socket.on('connect', () => {
      this.popMessage()
      this.pushMessage(createSystemMessage('加入聊聊天室'))
    })

    socket.on('connect_error', d => {
      this.pushMessage(createSystemMessage(`connect_error: ${d}`))
    })

    socket.on('connect_timeout', d => {
      this.pushMessage(createSystemMessage(`connect_timeout: ${d}`))
    })

    socket.on('disconnect', reason => {
      this.pushMessage(createSystemMessage(`disconnect: ${reason}`))
    })

    socket.on('reconnect', attemptNumber => {
      this.pushMessage(
        createSystemMessage(`reconnect success: ${attemptNumber}`),
      )
    })

    socket.on('reconnect_failed', () => {
      this.pushMessage(createSystemMessage('reconnect_failed'))
    })

    socket.on('error', err => {
      this.pushMessage(createSystemMessage(`error: ${err}`))
    })

    /**
     * About chat
     */
    socket.on('login', d => {
      console.log('login', d)
    })

    socket.on('message', d => {
      console.log('message', d);
      const { username, message } = d
      this.pushMessage(createUserMessage(message, username))
    })

    socket.on('userjoin', d => {
      this.pushMessage(createSystemMessage(`${d.username} joined`))
      this.pushMessage(createSystemMessage(`当前共有 ${d.numUsers} 人`))
    })

    socket.on('userleft', d => {
      this.pushMessage(createSystemMessage(`${d.username} left`))
      this.pushMessage(createSystemMessage(`当前共有 ${d.numUsers} 人`))
    })

    socket.on('typing', d => {})

    socket.on('stop typing', d => {})

    socket.emit('adduser', {username: this.me.nickName || '路人甲'})



    socket.on('chat', d => {
      console.log('chat', d);
      const wsData = createUserMessage(d.message, d.username);
      this.pushMessage(wsData)
    })
  },
})
