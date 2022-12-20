// pages/appointmentCarList/appointmentCarList.js
import http from './../../utils/http';
Page({

    /**
     * 页面的初始数据
     */
    data: {
        appointCarList: [],
        pageNum: 1,
        currentPageIndex: 1,
        pageSize: 10,
        goodsNextPage: true
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        this.getAppointmentCarList();
    },
    getAppointmentCarList() {
        const {
            currentPageIndex,
            pageSize,
            goodsNextPage
        } = this.data;
        if (!goodsNextPage) return;
        const pageNum = currentPageIndex
        const data = {
            pageNum,
            pageSize
        }
        http("get", `/appointmentCar/list`, data).then(res => {
            if (res.code === 0) {
                let {
                    list,
                    totalCount
                } = res.data.appointment;
                 list = list.map((item,index)=>{
                    var data= new Date(item.appointmentDate).toJSON();
                    var creationTimeStr= new Date(+new Date(data) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '') 
                    return  {
                      ...item,
                      appointmentDate:creationTimeStr
                    }
                  })
                this.setData({
                    appointCarList: [...this.data.appointCarList, ...list],
                })
                //callback && callback();
                this.data.currentPageIndex++;
                if (this.data.appointCarList === totalCount) {
                    this.setData({
                        goodsNextPage: false
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

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    }
})