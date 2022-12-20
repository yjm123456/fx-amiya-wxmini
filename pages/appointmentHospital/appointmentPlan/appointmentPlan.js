// pages/appointmentHospital/appointmentPlan/appointmentPlan.js
import http from '../../../utils/http';
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        
    },

    /**
     * 组件的初始数据
     */
    data: {
        activeTabs:0
    },
    ready: function() {
        console.log("active值为"+this.data.activeTabs);
        this.setData({
            activeTabs:0
        })
     },
    /**
     * 组件的方法列表
     */
    methods: {
        setActive(){
            console.log('调用初始函数');
            this.setData({
                activeTabs:0
            })
        },
        handleTabChange(event) {
            const { name } = event.detail;
            this.setData({
                activeTabs: name
            })
          },
        
          onReachBottom() {
            const { activeTabs } = this.data;
            switch (activeTabs) {
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
