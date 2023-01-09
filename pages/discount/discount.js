// pages/discount/discount.js
import http from "./../../utils/http";
import Dialog from '@vant/weapp/dialog/dialog';
Page({

    /**
     * 页面的初始数据
     */
    data: {
        voucherName:'',
        canRecieve:true,
        deductMoney:0,
        voucher:''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        this.isRecieveConsumptionVoucher();
    },
    receiveVoucher(e) {
        const {code}=e.currentTarget.dataset;
        http("post","/CustomerConsumptionVoucher/reciveConsumptionVoucherWeek/"+code).then(res => {
            if (res.code === 0) {
                wx.showToast({
                  title: '领取成功',
                  icon:'none',
                  duration:1000
                })
                wx.switchTab({
                  url: '/pages/shoppingMall/shoppingMall',
                })
            }
        })
    },
    //展示使用说明
    showUseDesc(e){
        const {remark}=e.currentTarget.dataset
        Dialog.alert({
            title: '使用说明',
            message: remark,
            showConfirmButton:false,
            closeOnClickOverlay:true
          }).then(() => {
             
          });
    },
    ///是否领取会员抵用券
    isRecieveConsumptionVoucher() {
        http("get", `/CustomerConsumptionVoucher/isReciveConsumptionVoucherThisWeek`).then(res => {
            if (res.code === 0) {
                const {voucher}=res.data
                this.setData({
                    voucher
                })
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