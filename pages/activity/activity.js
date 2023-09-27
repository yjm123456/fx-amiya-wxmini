// pages/activity/activity.js
import http from '../../utils/http';
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';
import {
    iscustomer,
    isAuthorizationUserInfo
} from "./../../api/user";
Page({

    /**
     * 页面的初始数据
     */
    data: {
        activity: "",
        controlAuthPhone: false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        this.setData({
            activity: options.activityid
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
    //显示绑定赠送抵用券提示
    showVoucherTips() {
        Dialog.alert({
            title: '新人福利',
            theme: 'round-button',
            confirmButtonText: '立即领取',
            closeOnClickOverlay: true,
            customStyle: 'display:flex;flex-direction:column;justify-content:center;align-items:center;background-color: transparent !important;',
            selector: "#skbind_tip",
            context: this
        }).then(() => {
            this.handleBindPhone();
        });
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
        //绑定成功后获取分享信息
        //this.getShareInfo();
    },

    // 取消绑定手机号
    cancelBindPhone() {
        this.setData({
            controlAuthPhone: false
        })
    },
    toDetail(event) {
        const {
            name
        } = event.currentTarget.dataset;
        
        if (name == 'zl') {
            wx.showToast({
                title: '敬请期待',
                icon: 'none',
                duration: 1000
            })
            return;
        }
        wx.navigateTo({
            url: '/pages/LiveAnchorMessage/LiveAnchorMessage?name=' + name
        })
    },
    toOrder(event) {
        const {
            name
        } = event.currentTarget.dataset;
        wx.navigateTo({
            url: '/pages/LiveAnchorOrder/LiveAnchorOrder?name=' + name,
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