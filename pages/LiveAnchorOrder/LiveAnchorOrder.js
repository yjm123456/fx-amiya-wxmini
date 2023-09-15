// pages/LiveAnchorDetail/LiveAnchorOrder/LiveAnchorOrder.js
import http from '../../utils/http';
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';
import {
    iscustomer,
    isAuthorizationUserInfo
} from "./../../api/user";
import {
    checkUserTokenInfo
} from "../../utils/login";
Page({

    /**
     * 页面的初始数据
     */
    data: {
        nickName: '',
        phone: '',
        liveAnchorName: '',
        type: '',
        appointmentCity: '',
        appointmentHospital: '',
        appointmentDate: '',
        currentCity: '',
        cityModel: false,
        currentId: '',
        currentIds: '',
        cityList: [],
        cityid: '',
        hosCityList: [],
        selectHospitalId: '',
        selectCityHospital: [],
        shopGoodsInfo: {},
        goodsInfo: {},
        display: false,
        name: '',
        names: 0,
        controlAuthPhone: false,
        controlAuth: false,
        q: '',
        userInfo: '',
        trueName: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {

        let {
            name,
            q
        } = options;
        console.log(q);
        if (q) {
            q=decodeURIComponent(q);
            name = q.split("?")[1].split("=")[1];
        }
        this.setData({
            name
        })
        checkUserTokenInfo().then(res => {
            this.isAuthorizationUserInfo();
        })

    },
    getCardInfo() {
        const {
            name
        } = this.data;
        this.isCustomer((isCustomer) => {
            if (isCustomer) {
                this.getUserInfo();
                var code = name + 'mzk';
                this.getFaceCardInfo(code);
            } else {
                this.showVoucherTips()
            }
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
                    this.getCardInfo();
                }
            }
        })
    },

    //显示绑定赠送抵用券提示
    showVoucherTips() {
        Dialog.alert({
            theme: 'round-button',
            confirmButtonText: "",
            closeOnClickOverlay: true,
            customStyle: "background-color:transparent !important;height:900rpx;margin-top:50rpx;postion:relative;width:550rpx;",
            selector: "#bind_tips"
        }).then(() => {
            this.handleBindPhone();
        });
    },
    getVoucher() {
        this.setData({
            show: false
        })
        this.handleBindPhone();
    },
    // 成功获取用户信息
    getUserInfoSuccess() {
        this.setData({
            userInfo: getApp().globalData.userInfo,
            controlAuth: false
        })
        this.getCardInfo();
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
        });
        const {
            name
        } = this.data;
        this.getUserInfo();
        var code = name + 'mzk';
        this.getFaceCardInfo(code);
    },

    // 取消绑定手机号
    cancelBindPhone() {
        this.setData({
            controlAuthPhone: false
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
    onClick(event) {
        const {
            names
        } = event.currentTarget.dataset;
        let name = "";
        if (names == "1") {
            name = 'dd'
        } else {
            name = 'jn'
        }
        this.setData({
            names
        })
        const {
            type
        } = this.data;

        if (type == 'mf') {
            var code = name + 'mfq';
            this.getSkincareInfo(code);
            // const goodsInfo = JSON.parse(decodeURIComponent(options.goodsInfo));

        } else {
            //获取面诊卡信息
            var code = name + 'mzk';
            this.getFaceCardInfo(code);
        }
        this.setData({
            liveAnchorName: name,
        });
        // this.setData({
        //     pay: name,
        // });
    },
    getSkincareInfo(code) {
        this.setData({
            code
        })
        //获取的信息包含商品信息轮播图信息和对应的医院价格复制给goodsinfo同时添加一个默认购买数量quantity:1
        http("get", `/Goods/infoBySimpleCode/${code}`, ).then(res => {
            if (res.code === 0) {
                const {
                    goodsInfo
                } = res.data;
                if (goodsInfo.goodsDetailHtml) {
                    goodsInfo.goodsDetailHtml = goodsInfo.goodsDetailHtml.replace(/\<img/g, '<img style="width:100%;height:auto;display:block"')
                }
                this.setData({
                    goodsInfo,
                    goodsInfo: {
                        ...goodsInfo,
                        quantity: 1,
                        allmoney: goodsInfo.salePrice
                    }
                })
                this.setData({
                    shopGoodsInfo: this.data.goodsInfo
                });
                const {
                    shopGoodsInfo
                } = this.data
                this.getCooperativeHospitalCity(shopGoodsInfo.id);
                this.getCityList()
            }
        })
    },
    onChange() {},
    // 根据商品编号获取商品详情,同时添加一个quantity字段表示购买数量默认值为0
    getFaceCardInfo(code) {
        //获取的信息包含商品信息轮播图信息和对应的医院价格复制给goodsinfo同时添加一个默认购买数量quantity:1
        http("get", `/Goods/infoBySimpleCode/${code}`, ).then(res => {
            if (res.code === 0) {
                const {
                    goodsInfo
                } = res.data;
                if (goodsInfo.goodsDetailHtml) {
                    goodsInfo.goodsDetailHtml = goodsInfo.goodsDetailHtml.replace(/\<img/g, '<img style="width:100%;height:auto;display:block"')
                }
                this.setData({
                    // goodsInfo,
                    shopGoodsInfo: {
                        ...goodsInfo,
                        quantity: 1,
                        allmoney: goodsInfo.salePrice
                    }
                })
            }
        })
    },
    getCooperativeHospitalCity(goodsId) {
        const data = {
            goodsId: goodsId
        }
        //请求返回结果只包含城市的id和name
        http("get", `/CooperativeHospitalCity/hotCity`, data).then(res => {
            if (res.code === 0) {
                this.setData({
                    hosCityList: res.data.cityList
                })
            }
        })
    },
    // 获取门店列表
    getStoreList(goodsId, city) {
        const data = {
            goodsId,
            city
        }
        //根据城市和商品id获取医院信息
        http("get", `/HospitalInfo/GoodsOfflineDoor`, data).then(res => {
            if (res.code === 0) {
                const {
                    hospitalInfoList
                } = res.data
                this.setData({
                    selectCityHospital: hospitalInfoList
                })
            } else {
                wx.showToast({
                    title: res.msg,
                    icon: 'none',
                    duration: 2000
                })
            }
        })
    },
    selectDate() {
        this.setData({
            display: true
        });
    },

    selectHospital(event) {
        const {
            name,
            hospitalid,
            money
        } = event.currentTarget.dataset;
        const {
            shopGoodsInfo
        } = this.data;
        shopGoodsInfo.allmoney = shopGoodsInfo.quantity * money;
        shopGoodsInfo.salePrice = shopGoodsInfo.allmoney;
        this.setData({
            selectHospitalId: hospitalid,
            appointmentHospital: name,
            shopGoodsInfo
        })
    },
    onClose() {
        this.setData({
            display: false
        });
    },
    formatDate(date) {
        date = new Date(date);
        var month = (date.getMonth() + 1) >= 10 ? (date.getMonth() + 1) : '0' + (date.getMonth() + 1);
        var day = (date.getDate()) >= 10 ? (date.getDate()) : '0' + (date.getDate())
        return `${date.getFullYear()}-${month}-${day}`;
    },
    onConfirm(event) {
        this.setData({
            display: false,
            appointmentDate: this.formatDate(event.detail),
        });
    },
    getUserInfo() {
        http("get", "/User/info").then(res => {
            if (res.code === 0) {
                const {
                    phone,
                    nickName,
                    name
                } = res.data.userInfo;
                this.setData({
                    phone: phone,
                    nickName: nickName,
                    trueName: name
                })
            }
        });
    },
    // 获取合作过的城市列表
    getCityList() {
        http("get", `/CooperativeHospitalCity/provinceAndCityList`).then(res => {
            if (res.code === 0) {
                const {
                    cityList
                } = res.data
                this.setData({
                    cityList: cityList
                })
            }
        })
    },

    selectedCity(event) {
        const {
            shopGoodsInfo
        } = this.data;

        const {
            cityid,
            item
        } = event.currentTarget.dataset


        this.setData({
            appointmentCity: item,
            cityModel: false,
            cityid,
        })
        this.getStoreList(shopGoodsInfo.id, cityid);
    },
    switchCity() {
        if (this.data.names == 0) {
            wx.showToast({
                title: '请先选择主播',
                icon: 'none',
                duration: 1000
            })
            return;
        }
        this.setData({
            cityModel: true,
            currentId: "",
            currentIds: ""
        })
    },
    onCancel() {
        this.setData({
            cityModel: false,
        })
    },
    // 授权位置
    getLocationAuth() {
        let ths = this;
        if (this.data.currentCity) return;
        wx.getSetting({
            success(res) {
                if (!res.authSetting['scope.userLocation']) {
                    // 请求用户权限:获取定位信息
                    wx.authorize({
                        scope: 'scope.userLocation',
                        success() {
                            ths.getLocation();
                        },
                        fail() {
                            wx.showModal({
                                content: '检测到您未打开地理位置权限，是否前往开启',
                                cancelText: "手动定位",
                                confirmText: "前往开启",
                                success: (res) => {
                                    if (res.cancel) {
                                        //点击取消,默认隐藏弹框
                                    } else {
                                        //点击确定
                                        wx.openSetting({
                                            success: res => {
                                                ths.getLocation()
                                            }
                                        })
                                    }
                                }
                            })
                        }
                    })
                } else {
                    ths.getLocation();
                }
            }
        });
    },
    // 获取经纬度
    getLocation() {
        
        
    },
    // 获取地区信息
    loadCity(longitude, latitude) {
        const data = {
            longitude,
            latitude
        }
        http("get", `/Location/city`, data).then(res => {
            if (res.code === 0) {
                const {
                    cityList
                } = this.data
                const {
                    city
                } = res.data;
                for (let index1 = 0; index1 < cityList.length; index1++) {
                    var city1 = cityList[index1];
                    console.log(city1);
                    console.log(city);
                    if (city.indexOf(city1)) {
                        this.setData({
                            appointmentCity: city
                        });
                    }
                }

            }
        }).catch(err => {
            this.setData({
                currentCity: "获取定位失败"
            });
        })
    },
    handleNameChange(e) {
        const {
            detail
        } = e;
        this.setData({
            trueName: detail
        })
    },
    handlePhoneChange(e) {
        const {
            detail
        } = e;
        this.setData({
            phone: detail
        })
    },
    purchase() {
        this.isCustomer((isCustomer) => {
            if (isCustomer) {
                const {
                    nickName,
                    phone,
                    names,
                    name,
                    trueName,
                    liveAnchorName,
                    type,
                    appointmentCity,
                    appointmentDate,
                    selectHospitalId,
                    shopGoodsInfo
                } = this.data
                let token = wx.getStorageSync("token")
                if (!token) {
                    wx.showToast({
                        title: '请先登录',
                        icon: 'none',
                        duration: 2000
                    })
                } else {
                    if (!trueName) {
                        wx.showToast({
                            title: '请输入姓名',
                            icon: 'none',
                            duration: 1000
                        })
                        return;
                    }
                    if (!phone) {
                        wx.showToast({
                            title: '请输入手机号',
                            icon: 'none',
                            duration: 1000
                        })
                        return;
                    }
                    if (!name) {
                        wx.showToast({
                            title: '请选择主播',
                            icon: 'none',
                            duration: 1000
                        })
                        return;
                    }
                    if (type == 'mf') {
                        if (!appointmentCity) {
                            wx.showToast({
                                title: '请选择预约城市',
                                icon: 'none',
                                duration: 1000
                            })
                            return;
                        }
                        if (!appointmentDate) {
                            wx.showToast({
                                title: '请选择预约时间',
                                icon: 'none',
                                duration: 1000
                            })
                            return;
                        }
                    }
                    if (!(/^1[3456789]\d{9}$/.test(phone))) {
                        wx.showToast({
                            title: '手机号错误,请重新输入',
                            icon: 'none',
                            duration: 1000
                        })
                        return;
                    } else {
                        let goodsInfo = {};
                        //改为使用从后台查询的数据
                        if (type == 'mf') {
                            goodsInfo = {
                                ...shopGoodsInfo,
                                appointmentCity: appointmentCity,
                                appointmentDate: appointmentDate,
                                // hospitalid: selectHospitalId,
                                isSkinCare: true
                            };
                        } else {
                            goodsInfo = {
                                ...shopGoodsInfo,
                                appointmentCity: '',
                                appointmentDate: '',
                                isFaceCard: true
                            };
                        }
                        wx.redirectTo({
                            url: '/pages/confirmOrder/confirmOrder?nickName=' + nickName + '&phone=' + phone + '&isCard=true&goodsInfo=' + encodeURIComponent(JSON.stringify([goodsInfo])) + '&allmoney=' + goodsInfo.allmoney + '&type=1',
                        })
                    }
                }
            } else {
                this.showVoucherTips()
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