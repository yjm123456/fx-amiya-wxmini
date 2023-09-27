// pages/appointmentHospital/appointmentPlan/appointmentPlan.js
import http from '../../../utils/http';
import {
    iscustomer
} from "./../../../api/user";
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
        
        this.selectComponent('#tabs').resize();
    },
    /**
     * 组件的方法列表
     */
    methods: {
        isCustomer(callback) {
            iscustomer().then(res => {
                if (res.code === 0) {
                    const {
                        isCustomer
                    } = res.data;
                    callback && callback(isCustomer)
                }
            })
        },
        // 绑定手机号
        handleBindPhone() {
            this.setData({
                controlAuthPhone: true
            })
        },
     // 成功绑定手机号
        successBindPhone() {
            this.setData({
                controlAuthPhone: false
            })
            
        },
    
        // 取消绑定手机号
        cancelBindPhone() {
            this.setData({
                controlAuthPhone: false
            })
        },
        setActive() {
            this.isCustomer((isCustomer) => {
                if (isCustomer) {
                    this.setData({
                        show: true
                    })
                } else {
                    this.setData({
                        show: false
                    })
                }
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