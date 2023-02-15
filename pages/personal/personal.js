import {
    checkUserTokenInfo
} from "../../utils/login";
import {
    iscustomer,
    isAuthorizationUserInfo
} from "./../../api/user";
import http from '../../utils/http.js';
import drawQrcode from './../../utils/weapp.qrcode.esm.js';
// 手指起始的坐标
let startY = 0;
// 手指移动的坐标
let moveY = 0;
// 手指移动的距离
let moveDistance = 0;

Page({

    data: {
        showAppoint:false,
        // 授权
        controlAuth: false,
        //会员卡信息
        memberCard: {},
        // 授权手机号
        controlAuthPhone: false,
        userInfo: {},
        coverTransform: 'translateY(0)',
        coveTransition: '',
        //储值
        totalBalance: 0,
        //抵用券弹窗
        controlConsumptionVoucher: false,
        active:0,
        growthBalanceInfo:{},
        percentage:0,
        style:"",
        voucherCount:0
    },
    visit() {
        http("get", `/ControlPageShow`).then(res => {
            if (res.code === 0) {
                const isShowAppoint=res.data.visit
                this.setData({
                    showAppoint:isShowAppoint
                });
            }
        })
    },
    //获取成长值信息
    GetGrowthPoint() {
        http("get", `/GrowthPointsAccount/balance`).then(res => {
            if (res.code === 0) {
                const {
                    growthBalanceInfo
                } = res.data;
                console.log(growthBalanceInfo.balance/(growthBalanceInfo.balance+growthBalanceInfo.upgradeGrowthPoints)*100);
                this.setData({
                    growthBalanceInfo,
                    percentage:(growthBalanceInfo.balance/(growthBalanceInfo.balance+growthBalanceInfo.upgradeGrowthPoints)*100).toFixed(2)
                })
            }
        })
    },
    getConsumptionVoucher() {
        // const {
        //     pageNum,
        //     pageSize,
        //     nextPage,
        //     type
        // } = this.data;
        // if (!nextPage) return;
        const data = {
            pageNum:1,
            pageSize:1,
            type:1
        }
        http("get", `/CustomerConsumptionVoucher/list`, data).then(res => {
            if (res.code === 0) {
                let {
                    totalCount
                } = res.data.customerConsumptionVoucherList;
                this.setData({
                    voucherCount:totalCount
                })
            }
        })
    },
    toIntegralPage(){
        wx.navigateTo({
          url: '/pages/integral/integral',
        })
    },
    toRechargeList() {
        this.isCustomer((isCustomer) => {
            if (isCustomer) {
                wx.navigateTo({
                    url: '/pages/rechargeRecord/rechargeRecord',
                })
            } else {
                wx.showToast({
                    title: '请绑定手机号',
                    icon: 'none'
                })
                this.handleBindPhone();
            }
        })
    },
    onShow() {
        this.visit();
        checkUserTokenInfo().then(res => {
            this.isAuthorizationUserInfo();
            // this.getMemberCardInfo();
            //this.getIntegral();
            // this.getBalance();
        })
        console.log("进入");
        this.isCustomer((isCustomer) => {
            console.log("是否是客户");
            if (isCustomer) {
                this.getMemberCardInfo();
                this.getIntegral();
                this.getBalance();
                this.GetGrowthPoint();
                this.getConsumptionVoucher();
            } else {
                wx.showToast({
                    title: '请绑定手机号',
                    icon: 'none'
                })
                this.handleBindPhone();
            }
        })
        
        //this.getCode()
    },
    onChange(event) {
        
      },
    getBalance() {
        http("get", `/Recharge/balance`).then(res => {
            if (res.code === 0) {
                const {
                    balance
                } = res.data;
                this.setData({
                    totalBalance: balance
                })
            }
        })
    },
    disscro() {},
    getCode() {
        const query = wx.createSelectorQuery()
        query.select('#myQrcode')
            .fields({
                node: true,
                size: true
            })
            .exec((res) => {
                var canvas = res[0].node

                // 调用方法drawQrcode生成二维码
                drawQrcode({
                    canvas: canvas,
                    canvasId: 'myQrcode',
                    width: 260,
                    padding: 30,
                    background: '#ffffff',
                    foreground: '#000000',
                    text: this.data.userInfo.id,
                })


                wx.canvasToTempFilePath({
                    canvasId: 'myQrcode',
                    canvas: canvas,
                    x: 0,
                    y: 0,
                    width: 260,
                    height: 260,
                    destWidth: 260,
                    destHeight: 260,
                    success(res) {
                        // console.log('二维码临时路径：', res.tempFilePath)
                    },
                    fail(res) {
                        console.error(res)
                    }
                })
            })
    },
    handleTouchStart(event) {
        this.setData({
            coveTransition: ''
        })
        // 获取手指起始坐标
        startY = event.touches[0].clientY;
    },
    tpPersonalInfo() {
        wx.navigateTo({
            url: '/pages/personalInfo/personalInfo',
        })
    },
    handleTouchMove(event) {
        moveY = event.touches[0].clientY;
        moveDistance = moveY - startY;
        if (moveDistance <= 0) {
            return;
        }
        if (moveDistance >= 150) {
            moveDistance = 150;
        }
        // 动态更新coverTransform的状态值
        this.setData({
            coverTransform: `translateY(${moveDistance}rpx)`
        })
    },

    handleTouchEnd() {
        // 动态更新coverTransform的状态值
        this.setData({
            coverTransform: `translateY(0rpx)`,
            coveTransition: 'transform 0.5s linear'
        })
    },

    // 判断是否需要授权微信用户信息
    isAuthorizationUserInfo() {
        isAuthorizationUserInfo().then(res => {
            if (res.code === 0) {
                const {
                    userInfo
                } = res.data
                const {
                    isAuthorizationUserInfo
                } = userInfo;
                if (isAuthorizationUserInfo) {
                    this.setData({
                        controlAuth: true,
                    })
                } else {
                    getApp().globalData.userInfo = userInfo;
                    this.setData({
                        userInfo: userInfo
                    })
                }
            }
        })
    },

    // 修改手机号
    editPhone() {
        this.isCustomer((isCustomer) => {
            if (isCustomer) {
                // 获取加载的页面
                const pages = getCurrentPages();
                // 当前页面url
                const url = pages[pages.length - 1].route;
                // 是否修改手机号
                const editPhone = true;
                wx.navigateTo({
                    url: `/pages/login/login?path=${url}&editPhone=${editPhone}`
                });
            } else {
                this.handleBindPhone();
            }
        })
    },

    unReceiveGiftOrderList() {
        this.isCustomer((isCustomer) => {
            if (isCustomer) {
                wx.navigateTo({
                    url: `/pages/unReceiveGiftOrderList/unReceiveGiftOrderList`,
                })
            } else {
                this.handleBindPhone();
            }
        })
    },
    // 到店计划
    arrivalPlan() {
        this.isCustomer((isCustomer) => {
            if (isCustomer) {
                wx.navigateTo({
                    url: `/pages/toStoreList/toStoreList`,
                })
            } else {
                this.handleBindPhone();
            }
        })
    },
    // 核销好礼
    myGift() {
        this.isCustomer((isCustomer) => {
            if (isCustomer) {
                wx.navigateTo({
                    url: `/pages/writeoffGoodGift/writeoffGoodGift?active=0`,
                })
            } else {
                this.handleBindPhone();
            }
        })
    },
    to(e) {
        this.isCustomer((isCustomer) => {
            if (isCustomer) {
                wx.navigateTo({
                    url: e.currentTarget.dataset.url + '?nickname=' + e.currentTarget.dataset.nickname,
                })
            } else {
                wx.showToast({
                    title: '请绑定手机号',
                    icon: 'none'
                })
                this.handleBindPhone();
            }
        })
    },
    toIntegral(e) {
        const {
            url
        } = e.currentTarget.dataset
        this.isCustomer((isCustomer) => {
            if (isCustomer) {
                wx.switchTab({
                    url: url,
                })
            } else {
                this.handleBindPhone();
            }
        })
    },
    // 收货地址
    myAddress() {
        this.isCustomer((isCustomer) => {
            if (isCustomer) {
                wx.navigateTo({
                    url: `/pages/addressList/addressList`,
                })
            } else {
                this.handleBindPhone();
            }
        })
    },

    // 已购买订单
    purchasedOrder() {
        this.isCustomer((isCustomer) => {
            if (isCustomer) {
                wx.navigateTo({
                    url: "/pages/purchasedOrder/purchasedOrder?active=0",
                })
            } else {
                this.handleBindPhone();
            }
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

    // 成功获取用户信息
    getUserInfoSuccess() {
        this.setData({
            userInfo: getApp().globalData.userInfo,
            controlAuth: false
        })
    },

    // 取消获取用户信息
    cancelGetUserInfo() {
        this.setData({
            controlAuth: false
        })
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
        this.setData({
            controlConsumptionVoucher: true
        })
    },

    // 取消绑定手机号
    cancelBindPhone() {
        this.setData({
            controlAuthPhone: false
        })
    },

    // 获取会员信息
    getMemberCardInfo() {
        http("get", `/MemberCard/cardinfo`).then(res => {
            if (res.code === 0) {
                console.log("结果"+res.data.memberCard.memberRankName=='MEIYA铂金卡会员');
                if(res.data.memberCard.memberRankName=='MEIYA时尚卡会员'){
                    this.setData({style:"background-image: -webkit-linear-gradient(right, #efcd71, #fff9c8, #efcf77, #fff9c8, #e4c675, #fff9c8);-webkit-background-clip: text;-webkit-text-fill-color: transparent;"})
                }
                if(res.data.memberCard.memberRankName=='MEIYA金卡会员'){
                    this.setData({style:"background-image: -webkit-linear-gradient(right, #97461a, #d36326,#6c2e16,#e9833c);-webkit-background-clip: text;-webkit-text-fill-color: transparent;"})
                }
                if(res.data.memberCard.memberRankName=='MEIYA铂金卡会员'){
                    this.setData({style:"background-image: -webkit-linear-gradient(right, #d9bfa1, #ffffff,#e8cea4,#ffffff,#e8cfa4);-webkit-background-clip: text;-webkit-text-fill-color: transparent;"})
                }
                if(res.data.memberCard.memberRankName=='MEIYA钻石卡会员'){
                    this.setData({style:"background-image: -webkit-linear-gradient(right, #fff9c8, #e1ad7b,#fff9c8,#e2ae7c,#fff9c8,#e1ad7b);-webkit-background-clip: text;-webkit-text-fill-color: transparent;"})
                }
                if(res.data.memberCard.memberRankName=='MEIYA黑卡会员'){
                    this.setData({style:"background-image: -webkit-linear-gradient(right, #e7cdc4, #fffaf3,#eacdbe,#fbeee5,#e4cfbb);-webkit-background-clip: text;-webkit-text-fill-color: transparent;"})
                }
                this.setData({
                    memberCard: res.data.memberCard
                })
            }
        })
    },
    //跳转到成长值明细页面
    toGrowthList() {
        this.isCustomer((isCustomer) => {
            if (isCustomer) {
                wx.navigateTo({
                    url: '/pages/growthPoints/growthPoints',
                })
            } else {
                wx.showToast({
                    title: '请绑定手机号',
                    icon: 'none'
                })
                this.handleBindPhone();
            }
        })
    },
    // 领取会员卡
    handleReceiveMemberCard() {
        this.isCustomer((isCustomer) => {
            if (isCustomer) {
                http("get", `/MemberCard/receive`).then(res => {
                    if (res.code === 0) {
                        this.getMemberCardInfo();
                    }
                })
            } else {
                wx.showToast({
                    title: '请绑定手机号',
                    icon: 'none'
                })
                this.handleBindPhone();
            }
        })
    },

    //获取客户的积分余额 
    getIntegral() {
        http("get", `/IntegrationAccount/balance`).then(res => {
            if (res.code === 0) {
                const {
                    balance
                } = res.data;
                this.setData({
                    balance
                })
            }
        })
    },
    concat() {
        wx.openCustomerServiceChat();
    },
    onHide() {
        this.setData({
            controlAuth: false,
            controlAuthPhone: false
        })
    }
})