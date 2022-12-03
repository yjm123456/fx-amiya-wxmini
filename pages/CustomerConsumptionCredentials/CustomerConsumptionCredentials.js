// pages/CustomerConsumptionCredentials/CustomerConsumptionCredentials.js
import http from "./../../utils/http"
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
        consumptionCredentialsList:[]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        this.CustomerConsumptionCredentials();
    },
    toDetail(e){
        const {id}=e.currentTarget.dataset;
        wx.navigateTo({
            url: e.currentTarget.dataset.url+"?id="+id
        })
    },
    CustomerConsumptionCredentials(){
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
        http("get", `/customerConsumptionCredentials/list`,data).then(res => {
            if (res.code === 0) {
                let {
                    list,
                    totalCount
                } = res.data.customerConsumptionCredentials;
                // list=list.map((item, index) => {                                     
                //     return {
                //         ...item,
                //         CreateDate: orderDate
                //     };
                // });
                this.setData({
                    consumptionCredentialsList:[...this.data.consumptionCredentialsList,...list]
                });
                this.data.currentPageIndex++;
                if (this.data.consumptionCredentialsList.length === totalCount) {
                    this.setData({
                        nextPage: false
                    })
                }
            }
        })
    },
    to(e){
        wx.navigateTo({
            url: e.currentTarget.dataset.url
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

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    }
})