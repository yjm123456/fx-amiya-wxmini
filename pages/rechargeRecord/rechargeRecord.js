// pages/integral/integral.js
import http from "./../../utils/http"
import {
    iscustomer,
    isAuthorizationUserInfo
} from "./../../api/user";
Page({

    /**
     * 页面的初始数据
     */
    data: {
        balance: 0,
        pageNum: 1,
        pageSize: 10,
        list: [],
        // 是否还有下一页
        nextPage: true,
        active: 0,
        //要获取的记录类型
        type: 1
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        //this.isCustomer();
        this.getBalace()
        this.getRecordList()
    },
    onChange(event) {
        this.setData({
            active: event.detail.name,
            list: [],
            nextPage: true,
            pageNum: 1,
            pageSize: 10
        });
        const {
            active
        } = this.data;
        if (active == 0) {
            this.setData({
                type: 1
            })
            this.getRecordList();
        }
        if (active == 1) {
            this.getUseRecordList();
        }
        if (active == 2) {
            this.setData({
                type: 2
            })
            this.getRecordList();
        }
    },
    // 获取客户的积分余额
    getBalace() {
        http("get", `/Recharge/balance`).then(res => {
            if (res.code === 0) {
                const {
                    balance
                } = res.data;
                this.setData({
                    balance
                })
            }
        })
    },
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
    getRecordList() {
        const {
            pageNum,
            pageSize,
            nextPage,
            type
        } = this.data;
        if (!nextPage) return;
        const data = {
            pageNum,
            pageSize,
            type
        }
        http("get", `/Recharge/list`, data).then(res => {
            if (res.code === 0) {
                let {
                    list,
                    totalCount
                } = res.data.recordList;
                list = list.map((item, index) => {
                    var rechargeDate = item.rechargeDate.replace(/T/g, ' ')
                    return {
                        ...item,
                        rechargeDate: rechargeDate
                    };
                });
                this.setData({
                    list: [
                        ...this.data.list,
                        ...list
                    ],
                })
                this.data.pageNum++;
                if (this.data.list.length === totalCount) {
                    this.setData({
                        nextPage: false
                    })
                }
            }
        })
    },
    //获取余额消费记录
    getUseRecordList() {
        const {
            pageNum,
            pageSize,
            nextPage
        } = this.data;
        if (!nextPage) return;
        const data = {
            pageNum,
            pageSize
        }
        http("get", `/Recharge/useList`, data).then(res => {
            if (res.code === 0) {
                let {
                    list,
                    totalCount
                } = res.data.useRecordList;
                console.log("总数" + totalCount);
                list = list.map((item, index) => {
                    var rechargeDate = item.useDate.replace(/T/g, ' ')
                    console.log(rechargeDate);
                    return {
                        ...item,
                        useDate: rechargeDate
                    };
                });
                this.setData({
                    list: [
                        ...this.data.list,
                        ...list
                    ]
                })
                this.data.pageNum++;
                if (this.data.list.length === totalCount) {
                    this.setData({
                        nextPage: false
                    })
                }
            }
        })
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        if (this.data.active == 1) {
            this.getUseRecordList();
        } else {
            this.getRecordList()
        }
    },
})