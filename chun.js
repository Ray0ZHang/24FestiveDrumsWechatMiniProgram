Page({
  data: {
    circles: new Array(9) ,// 创建一个长度为9的数组
    animation: {}, // 存储动画数据
    originalSeasons: ["立春", "雨水", "惊蛰", "春分", "清明", "谷雨"],
    infoText: "",
    playing: false, // 初始状态为未播放
    audioSrc: '/audio/ChineseNewYear.mp3',//音乐文件路径
    auto: false, // 控制图片切换
  },
  audioContext: null, // 用于控制音乐播放的context

  onLoad: function () {
    this.audioContext = wx.createInnerAudioContext();
    this.audioContext.src = this.data.audioSrc; // 设置音乐源

    // 监听音乐自然结束事件
    this.audioContext.onEnded(() => {
      this.setData({ playing: false, auto: false });
    });
  },

  music: function () {
    if (this.data.playing) {
      this.audioContext.pause(); // 暂停音乐
      this.setData({ playing: false, auto: false });
    } else {
      this.audioContext.play(); // 播放音乐
      this.setData({ playing: true, auto: true });
    }
  },

  onUnload: function () {
    // 页面销毁时停止音乐播放
    this.audioContext.stop();
    this.audioContext.destroy(); // 销毁当前实例
  },

  help: function() {
    wx.showModal({
      title: '来看看介绍吧！', // 对话框标题
      content: '此小程序为云游猫猫开发(≧∇≦)ﾉ\r\n点击小鼓进行敲击吧\r\n上方会弹出随机顺序的节气\r\n顺序正确就是黄色的哦!\r\n右侧有背景音乐🎵ChineseNearYear\r\n或者点击分享把小程序分享给好友吧！', // 帮助的具体内容
      showCancel: false, // 不显示取消按钮
      confirmText: '确定', // 确认按钮的文本，默认为“确定”
      confirmColor: '#FFD700', // 确认按钮的文字颜色
      success: function (res) {
        if (res.confirm) {
          // 用户点击了确认按钮
          console.log('用户点击确认');
        }
      }
    });
  },
  onShareAppMessage: function() {
    // 用户点击右上角分享给好友
    return {
      title: '二十四节令鼓小程序，好棒！', // 分享标题
      desc: '敲响廿四节令之鼓，传潮汕文化之魂！', // 分享描述
      path: '/pages/spring/index.wxml', // 分享页面路径，必须是以 / 开头的完整路径
      imageUrl: '/images/main/drum.png', // 分享图标URL,
    };
  },

  onShareTimeline: function() {
    // 用户点击右上角分享到朋友圈
    return {
      title: '二十四节气鼓小程序，好棒！', // 分享标题
      imageUrl: '/images/main/drum.png', // 分享图标URL,
    };
  },

  // 分享按钮绑定的方法
  share: function() {
    // 显示当前页面的转发按钮
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    });
  },
  tapDrum: function() {
    this.playSound(); // 播放音频
    this.showText(); // 显示文字
  },
  playSound: function() {
    const innerAudioContext = wx.createInnerAudioContext();
    innerAudioContext.autoplay = true;
    innerAudioContext.src = '/audio/7beat.mp3'; // 音频文件路径
    innerAudioContext.onPlay(() => {
      console.log('开始播放');
    });
    innerAudioContext.onError((res) => {
      console.log(res.errMsg);
      console.log(res.errCode);
    });
  },
  showText: function() {
    let newText, isOriginalOrder = false;
    // 50%概率使用原始顺序
    if (Math.random() < 0.5) {
      newText = this.data.originalSeasons.slice(0, 4).join(" ") + "\n" + this.data.originalSeasons.slice(4).join(" ");
      isOriginalOrder = true;
    } else {
      // 50%概率使用随机顺序
      let shuffledSeasons = [...this.data.originalSeasons].sort(() => Math.random() - 0.5);
      newText = shuffledSeasons.slice(0, 4).join(" ") + "\n" + shuffledSeasons.slice(4).join(" ");
    }
    this.setData({
      infoText: newText,
      isOriginalOrder: isOriginalOrder // 添加判断是否为原始顺序的字段
    });
    this.createAnimation();
  },
  createAnimation: function() {
    let animation = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease',
    });
    this.animation = animation;

    // 文字逐渐出现
    animation.opacity(1).step({ duration: 500 });
    // 维持一段时间后文字逐渐消失
    setTimeout(() => {
      animation.opacity(0).step({ duration: 500 });
      this.setData({
        animation: animation.export(),
      });
    }, 2500); // 维持2.5秒

    this.setData({
      animation: animation.export(),
    });
  },
});

