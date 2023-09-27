// pages/CustomerConsumptionCredentials/CustomerConsumptionCredentials.js
import http from "./../../utils/http"
import {
    iscustomer
} from "./../../api/user"
Page({

    /**
     * 页面的初始数据
     */
    data: {
        pageNum: 1,
        pageSize: 10,
        nextPage: true,
        //当前商品展示列表页码
        currentPageIndex: 1,
        reportList: [],
        // 授权手机号
        controlAuthPhone: false,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {

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



    toDetail(e) {
        let {
            id,
            status
        } = e.currentTarget.dataset;
        if (status == 0) {
            status = 'commit'
        }
        if (status == 1) {
            status = 'design'
        }
        wx.navigateTo({
            url: e.currentTarget.dataset.url + "?reportId=" + id + '&status=' + status
        })
    },
    GetReports() {
        const {
            currentPageIndex,
            pageSize,
            nextPage
        } = this.data;
        if (!nextPage) return;
        const pageNum = currentPageIndex
        const data = {
            pageNum,
            pageSize,
        }
        http("get", `/aestheticsDesignReport/list`, data).then(res => {
            if (res.code === 0) {
                let {
                    list,
                    totalCount
                } = res.data.list;
                list = list.map((item, index) => {
                    return {
                        ...item,
                        CreateDate1: item.createDate.split("T")[0]
                    };
                });
                this.setData({
                    reportList: [...this.data.reportList, ...list]
                });
                this.data.currentPageIndex++;
                if (this.data.reportList.length === totalCount) {
                    this.setData({
                        nextPage: false
                    })
                }
            }
        })
    },
    to(e) {
        wx.navigateTo({
            url: e.currentTarget.dataset.url + '?status=add'
        })
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {
        this.setData({
            pageNum: 1,
            pageSize: 10,
            nextPage: true,
            //当前商品展示列表页码
            currentPageIndex: 1,
            reportList: []
        });
        this.isCustomer((isCustomer) => {
            if (isCustomer) {
                this.GetReports();
            } else {
                // this.handleBindPhone();
            }
        })
        
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {
        this.GetReports();
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    }
})