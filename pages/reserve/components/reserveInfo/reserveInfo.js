import { getCustomerPhone } from "./../../../../api/user";
import http from "./../../../../utils/http";

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    appointmentDate: {
      type: String
    },

    hospitalId: {
      type: String
    },

    itemInfoId: {
      type: String
    },

    time: {
      type: String
    },

    week: {
      type: String
    },

    // 当前年月日
    currentDate: {
      type: String
    },

    // 当前星期
    currentWeek: {
      type: String
    },

    // 当前中午|下午
    currentTime: {
      type: String
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    // 备注
    remark: '',
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 备注
    remarkInputChange(e) {
      const { value } = e.detail;
      this.setData({
        remark: value
      })
    },
    // 根据时间戳获取年月日时分秒
    getNowDate() {
      const DATE = new Date()
      let year = DATE.getFullYear(),
        month = DATE.getMonth() + 1,
        date = DATE.getDate(),
        hours = DATE.getHours(),
        minutes = DATE.getMinutes(),
        seconds = DATE.getSeconds();
      if (month < 10) { month = '0' + month };
      if (date < 10) { date = '0' + date };
      if (hours < 10) { hours = '0' + hours };
      if (minutes < 10) { minutes = '0' + minutes };
      if (seconds < 10) { seconds = '0' + seconds };
      return `${year}-${month}-${date}T${hours}:${minutes}:${seconds}`;
    },
    // 核销
    handleReserve() {
      const { appointmentDate, week, time, remark, hospitalId, itemInfoId } = this.data;
      const createDate = this.getNowDate();
      // 获取用户手机号
      getCustomerPhone().then(res => {
        if (res.code === 0) {
          const data = {
            appointmentDate,
            week,
            time,
            createDate,
            phone: res.data.phone,
            remark,
            hospitalId: JSON.parse(hospitalId),
            itemInfoId: JSON.parse(itemInfoId)
          }
          http("post", `/Appointment/add`, data).then(res => {
            if (res.code === 0) {
              wx.showToast({
                title: '核销成功',
                icon: 'none',
                duration: 2000,
                success: () => {
                  setTimeout(() => {
                    wx.reLaunch({
                      url: '/pages/personal/personal',
                    })
                  }, 2000);
                }
              });
            }
          })
        }
      })
    },
  }
})
