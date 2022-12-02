// pages/subordinateOrder/subordinateOrder.js
import http from "./../../utils/http"
Page({

    /**
     * 页面的初始数据
     */
    data: {
        customerid:'',
        pageNum: 1,
        pageSize: 10,
        nextPage: true,
        //当前商品展示列表页码
        currentPageIndex: 1,
        orderList:[]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        const customerid=options.customerid
        this.setData({
            customerid
        });
        this.getSubordinatelist(customerid);
    },
    //获取下级订单
    getSubordinatelist(customerid){
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
            customerId:customerid
        }
        http("get", `/order/subordinateList`,data).then(res => {
            if (res.code === 0) {
                let {
                    list,
                    totalCount
                } = res.data.orders;
                list=list.map((item, index) => {
 
                    var orderDate = item.orderDate.replace(/T/g, ' ')
                    
                    return {
                        ...item,
                        orderDate: orderDate
                    };
                });
                this.setData({
                    orderList:[...this.data.orderList,...list]
                });
                this.data.currentPageIndex++;
                if (this.data.orderList.length === totalCount) {
                    this.setData({
                        nextPage: false
                    })
                }
            }
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
        this.getSubordinatelist();
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    }
})