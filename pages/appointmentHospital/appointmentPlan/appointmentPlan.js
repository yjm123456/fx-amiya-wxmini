// pages/appointmentHospital/appointmentPlan/appointmentPlan.js
import http from '../../../utils/http';
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        pageNums:1,
        pageSizes:10,
        currentCity:''
    },

    /**
     * 组件的初始数据
     */
    data: {
        active:0
    },

    /**
     * 组件的方法列表
     */
    methods: {
        handleTabChange(event) {
            const { name } = event.detail;
            this.setData({
              active: name
            })
          },
        
          onReachBottom() {
            const { active } = this.data;
            switch (active) {
              case 0:
                this.selectComponent("#planned").getOrderList()
                break;
              case 1:
                this.selectComponent("#completed").getOrderList()
                break;
              default:
                this.selectComponent("#cancel").getOrderList()
            }
          }
    }
})
