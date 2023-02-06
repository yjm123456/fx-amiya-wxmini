// pages/birthDayCard/birthDayCard.js
import http from './../../utils/http';
import {
    iscustomer,
    isAuthorizationUserInfo
} from "./../../api/user";
import { checkUserTokenInfo } from "../../utils/login";
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';
Page({

    /**
     * 页面的初始数据
     */
    data: {
        sysheight:0,
        birthDayCardInfo:{},
        id:'',
        phone:'',
        name:'',
        birthDay:'',
        detailAddress:'',
        city:'',
        area2:'',
        area:[],
        province:'',
        city:'',
        timeNow:new Date(),
        controlAuthPhone:false,
        show:false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        wx.getSystemInfo({//获取设备屏幕真实高度
            success: (result) => {
              this.setData({
                sysheight:result.windowHeight
              })
            },
          })
          
    },
    getVoucher(){
        this.setData({show:false})
        this.handleBindPhone();
    },
    showVoucherTips() {
        Dialog.alert({
            theme: 'round-button',
            confirmButtonText: "",
            closeOnClickOverlay: true,
            customStyle:"background-color:transparent !important;height:900rpx;margin-top:50rpx;postion:relative;width:550rpx;",
            selector: "#bind_tips"
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
        this.getShareInfo();
    },

    // 取消绑定手机号
    cancelBindPhone() {
        this.setData({
            controlAuthPhone: false
        })
        wx.switchTab({
          url: '/pages/index/index',
        })
    },
    bindAreaChange: function (e) {
        const area = e.detail.value
        this.setData({
            area: area,
            isEditArea: true,
            province: area[0],
            city: area[1],
            area2:area[2]
        })
    },
    bindChange: function (e) {
        this.setData({
            birthDay: e.detail.value,
        })
    },
    onNameChange(event){
        var name=event.detail;
        console.log("name值为"+name);
        this.setData({
            name
        });
    },
    onDetailAdressChange(event){
        var detailAddress=event.detail;
        this.setData({
            detailAddress
        });
    },
    getBirthCard(){
        http("get", "/User/birthDayCard").then(res => {
            if (res.code === 0) {
                var cardInfo= res.data.birthDay;
                this.setData({
                    id:cardInfo.id,
                    phone:cardInfo.phone==null?"":cardInfo.phone,
                    name:cardInfo.name==null?"":cardInfo.name,
                    birthDay:cardInfo.birthDay==null?"": cardInfo.birthDay.split("T")[0],
                    detailAddress:cardInfo.detailAddress==null?"":cardInfo.detailAddress,
                    city:cardInfo.city==null?"":cardInfo.city,
                    area2:cardInfo.area==null?"":cardInfo.area,
                    province:cardInfo.province==null?"":cardInfo.province
                })           
            }
        });
    },
    authorizeNotice (){
        var app=getApp();
        const tmplIds = app.globalData.giftTmpId;
        wx.requestSubscribeMessage({
            tmplIds:tmplIds,
            success: res => {
                tmplIds.forEach(item => {
                    if (res[item] === 'reject') {
                        wx.showToast({
                            title: '此次操作会导致您接收不到通知',
                            icon: 'none',
                            duration: 2000,
                        })
                    }
                })
                console.log("授权成功");
                this.updateBirthCard();
            },
            fail: err => {
                console.log("授权失败");
                this.updateBirthCard();
            },
        })
    },
    updateBirthCard(){
        const{
            name,
            phone,
            city,
            area2,
            detailAddress,
            province,
            birthDay
        }=this.data
        if(!name){
            wx.showToast({
              title: '请输入姓名',
              icon:'none',
              duration:1000
            })
            return;
        }
        if(!phone){
            wx.showToast({
              title: '请输入手机号',
              icon:'none',
              duration:1000
            })
            return;
        }
        if(!city){
            wx.showToast({
              title: '请选择所在地区',
              icon:'none',
              duration:1000
            })
            return;
        }
        if(!detailAddress){
            wx.showToast({
              title: '请输入详细地址',
              icon:'none',
              duration:1000
            })
            return;
        }
        if(!birthDay){
            wx.showToast({
              title: '请选择生日',
              icon:'none',
              duration:1000
            })
            return;
        }
        const data={
            name,
            phone,
            city,
            area:area2,
            detailAddress,
            province,
            birthDay
        }
        http("post", "/User/updateBirthDayCard",data).then(res => {
            if (res.code === 0) {
                wx.showToast({
                  title: '提交成功',
                  icon:'none',
                  duration:1000
                })    
            }
        });
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
        this.init();
    },
    init() {
        checkUserTokenInfo().then(res => {
          this.isCustomer();
        })
      },
    
      isCustomer() {
        iscustomer().then(res => {
          if (res.code === 0) {
            const { isCustomer } = res.data;
            this.setData({
              isCustomer
            })
            
            if(isCustomer){
                this.getBirthCard();
            }else{
                this.showVoucherTips();
            }
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

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    }
})