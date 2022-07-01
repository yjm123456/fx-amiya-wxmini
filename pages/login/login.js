import { sendCode, validateCode, bind, editPhone } from "./../../api/user";

Page({
  data: {
    phone: null,          //手机号
    code: null,           //验证码
    sendAuthCode: true,   //文字显示隐藏
    auth_time: 0,         //倒计时
    path: "",
    editPhone: false,      // 是否修改手机号
  },

  onLoad(e) {
    this.data.path = e.path;
    this.data.editPhone = e.editPhone ? JSON.parse(e.editPhone) : false;
  },

  // 手机号
  phoneInput(e) {
    const { value } = e.detail;
    this.data.phone = value;
  },

  // 验证码
  codeInput(e) {
    const { value } = e.detail;
    this.data.code = value;
  },

  // 获取验证码
  getCode() {
    let reg = /^1\d{10}$/;
    const { phone } = this.data;
    if (!phone) {
      wx.showToast({
        title: '请输入手机号 ',
        icon: 'none',
        duration: 2000
      })
      return false
    } else if (!reg.test(phone)) {
      wx.showToast({
        title: '请输入正确的手机号 ',
        icon: 'none',
        duration: 2000
      })
      return false
    } else {
      this.setData({
        sendAuthCode: false,
        auth_time: 60
      })
      let auth_timetimer = setInterval(() => {
        this.data.auth_time--
        this.setData({
          auth_time: this.data.auth_time
        })
        if (this.data.auth_time <= 0) {
          this.setData({
            sendAuthCode: true
          })
          clearInterval(auth_timetimer);
        }
      }, 1000);
      // 发送验证码
      sendCode(phone)
    }
  },

  // 绑定
  login() {
    let reg = /^1\d{10}$/;
    const { phone, code } = this.data;
    if (!phone) {
      wx.showToast({
        title: '请输入手机号 ',
        icon: 'none',
        duration: 2000
      })
      return false
    } else if (!reg.test(phone)) {
      wx.showToast({
        title: '请输入正确的手机号 ',
        icon: 'none',
        duration: 2000
      })
      return false
    } else if (!code) {
      wx.showToast({
        title: '请输入验证码 ',
        icon: 'none',
        duration: 2000
      })
      return false
    } else {
      const data = {
        phone,
        code
      }
      // 验证码是否有效
      validateCode(data).then(res => {
        if (res.code === 0) {
          if (this.data.editPhone) {
            // 修改手机号
            editPhone(phone).then(res => {
              if (res.code === 0) {
                this.back()
              }
            })
          } else {
            // 绑定手机号
            bind(phone).then(res => {
              if (res.code === 0) {
                this.back()
              }
            })
          }
        }
      })
    }
  },

  back() {
    const pages = getCurrentPages();
    let delta = 0;
    for (let i = pages.length - 1; i >= 0; i--) {
      if (pages[i].route === this.data.path) {
        break;
      }
      delta += 1;
    }
    wx.navigateBack({
      delta
    })
  }
})