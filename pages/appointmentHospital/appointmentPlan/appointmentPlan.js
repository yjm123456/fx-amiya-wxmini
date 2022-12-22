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
        activeTabs:0,
        show:false,
    },
    ready: function() {
        this.setData({
            activeTabs:0
        })
        console.log("active值之前为"+this.data.activeTabs);
        this.selectComponent('#tabs').resize();
     },
    /**
     * 组件的方法列表
     */
    methods: {
        setActive(){
            this.setData({
                show:true
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
                this.selectComponent('#tabs').resize();
                break;
              default:
                this.selectComponent("#cancel").getOrderList()
                this.selectComponent('#tabs').resize();
            }
          }
    }
})
