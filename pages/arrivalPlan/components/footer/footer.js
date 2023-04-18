import http from "./../../../../utils/http";

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    defaultValue: {
      type: String,
      observer() {
        this.display();
      },
    },
    

    // 项目信息
    itemInfo: {
      type: Object,
      value: ''
    },

    // 剩余人数
    surplusQuantity: {
      type: Object
    },

    // 机构编号
    hospitalId: {
      type: String,
    },

    // 项目编号
    itemInfoId: {
      type: String
    },
    //预约地区
    appointArea:{
        type:String
    }

  },

  /**
   * 组件的初始数据
   */
  data: {
    // 当前时间
    currentDate: "",

    // 星期
    week: "",

    weekText: ['日', '一', '二', '三', '四', '五', '六'],

    // 中午|下午
    time: "",
    noon:true,
    afternoon:true
  },

  ready() {
    this.display();
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //补全0
    zero(i) {
      return i >= 10 ? i : '0' + i;
    },

    display() {
      let DATE = this.data.defaultValue ? new Date(this.data.defaultValue) : new Date(new Date().getTime()+1000*3600*24),
        year = DATE.getFullYear(),
        month = DATE.getMonth() + 1,
        date = DATE.getDate(),
        currentDate = year + '-' + this.zero(month) + '-' + this.zero(date);
      this.setData({
        currentDate,
        week: this.data.weekText[new Date(Date.UTC(year, month - 1, date)).getDay()]
      })
    },

    handleReserve(e) {
      const {currentdate , time , week ,hospitalid,appointarea} = e.currentTarget.dataset;
        this.triggerEvent("AppointChange",{currentDate:currentdate,time,week})
        if(time=='上午'){
            this.setData({
                noon:false,
                afternooon:true
            })
        }else{
            this.setData({
                noon:true,
                afternoon:false
            })
        }
        
        // wx.navigateTo({
        //   url: '/pages/storeUserMessage/storeUserMessage?appointmentDate=' + currentdate + '&week=星期' + week + '&time=' + time + '&hospitalId=' + hospitalid+'&appointarea='+appointarea,
        // })
    },


    handleIscustomer() {
      http("get", `/Appointment/checkOrder/${this.data.itemInfoId}`).then(res => {
        if (res.code === 0) {
          const { currentDate, itemInfo, week, hospitalId, itemInfoId, time } = this.data;
          wx.navigateTo({
            url: `/pages/reserve/reserve?itemInfo=${JSON.stringify(itemInfo)}&appointmentDate=${currentDate}&week=星期${week}&time=${time}&hospitalId=${hospitalId}&itemInfoId=${itemInfoId}`,
          })
        }
      })
    }
  },
})
