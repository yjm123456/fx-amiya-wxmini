import http  from "./../../utils/http"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 预约日期
    appointmentDate:"",
    // 星期
    week:"",
    // 上午/下午
    time:"",
    // 医院id
    hospitalId:null,
    // 姓名
    customerName:"",
    phone:"",
    // 项目名称
    itemInfoName:"",
    // 验证码
    code:"",
    // model
    projectModel:false,
    // 选中的项目
    currentId:"",
    // 验证码按钮显示状态
    send:true,
    // 当前倒计时秒数
    seconds:"",
    // 总秒数
    max_seconds:59,
    AmiyaGoodsDemandList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const {appointmentDate,week,time,hospitalId} = options
    this.setData({
      appointmentDate : appointmentDate,
      week : week,
      time : time,
      hospitalId:Number(hospitalId)
    })
    this.getProject()
  },
  // 姓名
  nameInput(e){
    this.setData({
      customerName:e.detail.value
    })
  },
  // 手机号
  phoneInput(e){
    this.setData({
      phone:e.detail.value
    })
  },
  // 验证码
  verificationCodeInput(e){
    this.setData({
      code:e.detail.value
    })
  },
  // 选择项目
  selectProject(){
    this.setData({
      projectModel:true,
    })
  },
  onCancel() {
    this.setData({
      projectModel:false,
    })
  },
  // 实现选项目
  selected(e){
    const {id,projectName} = e.currentTarget.dataset.item
    this.setData({
      currentId : id,
      itemInfoName:projectName,
      projectModel:false,
    })
  },
  // 获取项目列表
  getProject(){
    http("get", `/GoodsDemand/getAmiyaHospitalDepartmentAndGoodsDemandList`).then(res => {
      if(res.code === 0){
        const {AmiyaHospitalDepartmentList} = res.data
        this.setData({
          AmiyaGoodsDemandList:AmiyaHospitalDepartmentList
        })
      }
    })
  },
  submit(){
    this.setData({
      projectModel:false,
    })
  },
  // 发送验证码
  sendCode(){
    const {phone} = this.data
    if(phone){
      http("POST", `/ValidateCode/send/${phone}`).then(res => {
        setTimeout(()=>{
          wx.showToast({ title: '发送成功', icon: 'none', duration: 2000 })
          var that=this;
          // 获取总秒数
          var seconds=this.data.max_seconds;
          this.setData({
            // 显示倒计时
            send:false,
            // 设置秒数
            seconds:seconds,
          })
          // 设置定时器
          var t=setInterval(function(){
            // 如果秒数小于0
            if(seconds<=0){
              // 停止定时器
              clearInterval(t);
              that.setData({
                // 显示发送按钮
                send:true,
              })
              // 停止执行
              return;
            }
            // 秒数减一
            seconds--;
            that.setData({
              // 更新当前秒数
              seconds:seconds,
            })
          },1000)
        },1000)
      })
      
    }else{
      wx.showToast({ title: '请先输入手机号', icon: 'none', duration: 2000 })
    }
  },
  // 提交
  submitUserMessage(){
    const { week , appointmentDate , time , hospitalId ,customerName , phone, itemInfoName ,code} = this.data
    const data = {
      week, appointmentDate , time , hospitalId ,customerName , phone,
      remark:"",
      itemInfoName,
      code
    }
    if(!itemInfoName){
      wx.showToast({ title: '请选择项目', icon: 'none', duration: 2000 })
      return
    }
    if(!customerName){
      wx.showToast({ title: '请输入姓名', icon: 'none', duration: 2000 })
      return
    }
    if(!phone){
      wx.showToast({ title: '请输入手机号', icon: 'none', duration: 2000 })
      return
    }else{
      if (!(/^1[3456789]\d{9}$/.test(phone))) {
        wx.showToast({
          title: '手机号码有误',
          duration: 2000,
          icon:'none'
        });
        return
      }
    }
    if(!code){
      wx.showToast({ title: '请输入验证码', icon: 'none', duration: 2000 })
      return
    }
    this.isValidate(data)
  },
  // 判断验证码是否有效
  isValidate(e){
    const isphone = {
      phone:e.phone,
      code:e.code
    }
    const data = {
      phone:e.phone,
      appointmentDate:e.appointmentDate,
      hospitalId:e.hospitalId,
      itemInfoName:e.itemInfoName,
      remark:e.remark,
      time:e.time,
      week:e.week,
      customerName:e.customerName
    }
    http("get", `/ValidateCode/validate`,isphone).then(res => {
      if(res.code === 0){
    //     wx.showToast({ title: '发送成功', icon: 'none', duration: 2000 })
        http("POST", `/Appointment/add`,data).then(res => {
          if(res.code === 0){
            setTimeout(()=>{
              wx.showToast({ title: '提交成功，请耐心等待工作人员审核', icon: 'none', duration: 2000 })
            },1000)
            setTimeout(()=>{
              wx.reLaunch({
                url: '/pages/toStoreList/toStoreList',
              })
            },2000)
          }
        })
      }else{
        // wx.showToast({ title: '', icon: 'none', duration: 2000 })
      }
    })
  },
})