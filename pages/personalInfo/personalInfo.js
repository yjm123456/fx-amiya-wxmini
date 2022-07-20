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
        isEditBirth: false,
        showBirthPicker: false,
        date: "",
        area: [],
        province: '',
        city: '',
        gender: '',
        genderList: ['男', '女'],
        isEditArea: false,
        isEditGender: false,
        timeNow: '',
        nickName: '',
        show: false,
        newName:''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        var myDate = new Date();
        var year = myDate.getFullYear(); //获取完整的年份(4位,1970-????)
        var month = myDate.getMonth() + 1; //获取当前月份(0-11,0代表1月)
        if (month < 10) {
            month = '0' + month
        }
        var day = myDate.getDate();
        if (day < 10) {
            day = '0' + day
        }
        console.log(year + '-' + month + '-' + day)
        this.setData({
            timeNow: year + '-' + month + '-' + day
        })
        this.getUserInfo();
    },
    updateNickName(){
        if(this.data.newName!==""){
            this.setData({show:false,isEditNickName:true})
        }
    

    },
    saveInfo() {
        // if(!this.data.date){
        //     wx.showToast({
        //       title: '请输入生日',
        //       icon:'none'
        //     })
        //     return
        // }
        console.log("调用")
        let {
            gender,
            // date,
            province,
            city,
            nickName,newName
        } = this.data
        if(newName!==""){
            nickName=newName
        }
        const data = {
            gender,
            //date,
            province,
            city,
            nickName
        }
        http("put", "/User/userEditInfo", data).then((res) => {
            if (res.code === 0) {
                wx.showToast({
                    title: '修改成功',
                    icon: 'none',
                    duration: 1000
                })
                this.save();
                this.getUserInfo();
            }

        })
    },
    showBirthPicker() {
        this.setData({
            showBirthPicker: true
        })
    },
    onClose() {
        this.setData({
            show: false
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
            date: '',
            isEditBirth: false,
            isEditArea: false,
            isEditGender: false,
            isEditNickName:false,
            area: [],
            province: '',
            city: '',
            gender: '',
            newName:''
        })
    },
    bindChange: function (e) {
        this.setData({
            date: e.detail.value,
            isEditBirth: true
        })
    },
    bindAreaChange: function (e) {
        const area = e.detail.value
        this.setData({
            area: area,
            isEditArea: true,
            province: area[0],
            city: area[1]
        })
    },
    chooseGender() {
        this.setData({
            isEditGender: true
        })
        wx.showActionSheet({
            itemList: this.data.genderList,
            success: (res) => {
                this.setData({
                    gender: res.tapIndex === 0 ? 1 : 2
                })
            },
            fail: (res) => {
                if (this.data.gender === '') {
                    this.setData({
                        isEditGender: false
                    })
                }

            }
        })
    },
    changeNickName() {
        this.setData({
            show:true
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
        //this.getUserInfo();
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
                console.log(res.data.userInfo.sex === '男')
                this.setData({
                    userInfo: res.data.userInfo,
                    gender: res.data.userInfo.sex === '男' ? 1 : res.data.userInfo.sex === '女' ? 2 : 0,
                    city: res.data.userInfo.city,
                    province: res.data.userInfo.province,
                    nickName:res.data.userInfo.nickName
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