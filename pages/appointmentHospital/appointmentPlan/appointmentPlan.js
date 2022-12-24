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
        activeTabs: 0,
        show: false,
    },
    ready: function () {
        this.setData({
            activeTabs: 0
        })
        console.log("active值之前为" + this.data.activeTabs);
        this.selectComponent('#tabs').resize();
    },
    /**
     * 组件的方法列表
     */
    methods: {
        setActive() {
            this.setData({
                show: true
            })
        },
        handleTabChange(event) {
            const {
                name
            } = event.detail;
            console.log("选中为"+name);
            this.setData({
                activeTabs: name
            })
        },

        onReachBottom() {
            const {
                activeTabs
            } = this.data;
            
            switch (activeTabs) {
                case 1:
                    this.selectComponent("#planned").getOrderList()
                    break;
                case 2:
                    this.selectComponent("#cancel").getOrderList()
                    break;
            }
        }
    }
})