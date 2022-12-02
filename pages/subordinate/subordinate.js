// pages/subordinate/subordinate.js
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
        userList:[]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        this.getSubordinateUser();
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
    getSubordinateUser(){
        const {
            currentPageIndex,
            pageSize,
            nextPage
        } = this.data;
        if (!nextPage) return;
        const pageNum = currentPageIndex
        const data = {
            pageNum,
            pageSize
        }
        http("get", `/user/subordinateList`,data).then(res => {
            if (res.code === 0) {
                let {
                    list,
                    totalCount
                } = res.data.subordinate;
                list=list.map((item, index) => {
 
                    var createDate = item.createDate.replace(/T/g, ' ')
                    
                    return {
                        ...item,
                        createDate: createDate
                    };
                });
                this.setData({
                    userList:[...this.data.userList,...list]
                });
                this.data.currentPageIndex++;
                if (this.data.list.length === totalCount) {
                    this.setData({
                        nextPage: false
                    })
                }
            }
        })
    },
    toOrder(event){
        const{customerid}=event.currentTarget.dataset
        wx.navigateTo({
          url: '/pages/subordinateOrder/subordinateOrder?customerid='+customerid,
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
        this.getSubordinateUser();
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    }
})