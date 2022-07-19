// pages/personalInfo/personalInfo.js
import http from "../../utils/http";
import {
    iscustomer,
    isAuthorizationUserInfo
} from "./../../api/user";
Page({

    /**
     * 页面的初始数据
     */
    data: {
        userInfo: {},
        isEdit: false,
        isEditBirth:false,
        showBirthPicker: false,
        date: ""
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        this.getUserInfo();
    },
    showBirthPicker() {
        this.setData({
            showBirthPicker: true
        })
    },
    onClose() {
        this.setData({
            showBirthPicker: false
        })
    },
    edit() {
        this.setData({
            isEdit: true
        })
    },
    save() {

        this.setData({
            isEdit: false,
            date:'',
            isEditBirth:false,
            isEditArea:false
        })
    },
    bindChange: function (e) {
        console.log('picker发送选择改变，携带值为', e.detail.value)
        this.setData({
            date: e.detail.value,
            isEditBirth:true
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

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {
        this.getUserInfo();
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
    to(e) {
        this.isCustomer((isCustomer) => {
            if (isCustomer) {
                wx.navigateTo({
                    url: e.currentTarget.dataset.url,
                })
            } else {
                this.handleBindPhone();
            }
        })
    },
    getUserInfo() {
        http("get", "/User/info").then(res => {
            if (res.code === 0) {
                this.setData({
                    userInfo: res.data.userInfo
                })
            }
        });
    },
    editPhone() {
        // 获取加载的页面
        const pages = getCurrentPages();
        // 当前页面url
        const url = pages[pages.length - 1].route;
        // 是否修改手机号
        const editPhone = true;
        wx.navigateTo({
            url: `/pages/login/login?path=${url}&editPhone=${editPhone}`
        });

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