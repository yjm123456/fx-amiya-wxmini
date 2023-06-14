// pages/cartConfirmOrder/cartConfirmOrder.js
import http from "./../../utils/http";
Page({

    /**
     * 页面的初始数据
     */
    data: {
        goodsInfo: [],
        isMaterial: false,
        allMoney: 0,
        allPoint: 0,
        address: "",
        tradeId: "",
        hospitalid: 0,
        remark: "",
        moneyTradeId: "",
        removeList: [],
        deductMoney: 0,
        show: false,
        voucher: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        const {
            vouchertype,
            deductmoney
        } = options;
        const goodsinfo = JSON.parse(decodeURIComponent(options.goodsInfo));
        const voucher = options.selectedvoucher;
        if (!voucher) {
            this.setData({
                voucher: null
            })
        } else {
            this.setData({
                voucher
            })
        }
        this.setData({
            deductMoney: deductmoney,
            voucherType: vouchertype
        })
        for (let i = 0; i < goodsinfo.length; i++) {
            if (goodsinfo[i].isMaterial) {
                this.setData({
                    isMaterial: true
                })
                break;
            }
        }
        for (let i = 0; i < goodsinfo.length; i++) {
            if (goodsinfo[i].exchangeType != 0) {
                this.setData({
                    show: true
                })
                break;
            }
        }
        for (let i = 0; i < goodsinfo.length; i++) {
            this.setData({
                removeList: [...this.data.removeList, goodsinfo[i].id]
            })
        }
        this.setData({
            goodsInfo: goodsinfo
        })
        this.getAllMoney();
        // this.getAllPoint();
    },
    authorizeNotice() {
        var app = getApp();
        const tmplIds = app.globalData.tmplIds;
        wx.requestSubscribeMessage({
            tmplIds: tmplIds,
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

            },
            fail: err => {
                console.log("授权失败");

            },
        })
    },
    handleRemarkChange(e) {
        const {
            detail
        } = e;
        this.setData({
            remark: detail
        })
    },
    handleSelectAddress() {
        const path = 'pages/cartConfirmOrder/cartConfirmOrder';
        wx.navigateTo({
            url: `/pages/addressList/addressList?selectAddress=${true}&path=${path}`
        })
    },
    pay(tradeId) {
        http("post", `/Order/pay/${tradeId}`).then(res => {
            if (res.code === 0) {
                wx.showToast({
                    title: '支付成功',
                    icon: 'success',
                    duration: 2000,
                    success: function () {
                        var app = getApp();
                        const tmplIds = app.globalData.tmplIds;
                        wx.requestSubscribeMessage({
                            tmplIds: tmplIds,
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
                                setTimeout(function () {
                                    wx.switchTab({
                                        url: '/pages/orderList/orderList?active=0'
                                    })
                                }, 2000);
                            },
                            fail: err => {
                                console.log("授权失败");
                                setTimeout(function () {
                                    wx.switchTab({
                                        url: '/pages/orderList/orderList?active=0'
                                    })
                                }, 2000);
                            },
                        })
                        setTimeout(function () {
                            wx.switchTab({
                                url: '/pages/orderList/orderList?active=0'
                            })
                        }, 2000);
                    }
                })
            }
        })
    },
    handlePay(e) {
        // this.authorizeNotice();
        const {
            goodsInfo,
            isMaterial,
            address,
            remark,
            voucher
        } = this.data
        if (isMaterial) {
            if (!address) {
                wx.showToast({
                    title: '请选择收货地址',
                    icon: 'none',
                    duration: 1000
                })
                return;
            }
        }
        const data = {
            addressId: address.id,
            remark,
            voucherId: voucher==='0'?'':voucher,
            orderItemList: goodsInfo.map(item => {
                return {
                    goodsId: item.goodsId,
                    quantity: item.num,
                    standardId: item.selectStandards
                }
            })
        }
        wx.showModal({
            title:'提示',
            content:'是否支付',
            success:(res)=>{
                if(res.confirm){
                    http("post", `/Order/newCartOrder`, data).then(res => {
                        if (res.code === 0) {
                            const {
                                payInfo
                            } = res.data;
                            wx.requestPayment({
                                timeStamp: payInfo.timeStamp,
                                nonceStr: payInfo.nonceStr,
                                package: payInfo.package,
                                signType: payInfo.signType,
                                paySign: payInfo.paySign,
                                success(res) {
                                    wx.showToast({
                                        title: '支付成功',
                                        icon: 'none',
                                        duration: 2000
                                    })
                                    setTimeout(function () {
                                        wx.redirectTo({
                                            url: '/pages/orderList/orderList',
                                        })
                                    }, 1000);
                                },
                                fail(res) {
                                    wx.showToast({
                                        title: '支付失败',
                                        icon: 'none',
                                        duration: 2000
                                    })
                                }
                            })
                        }
                    })
                }
            }
        });
    },
    deleteFormShopCart() {
        const {
            removeList
        } = this.data;
        const data = {
            idList: removeList
        }
        http("put", "/GoodsShopCar/deleteGoodsShopCar", data).then(res => {
            if (res.code === 0) {
                console.log("移除成功")
            }
        })
    },
    //生成订单,type为1支付订单,type为2积分支付订单
    generateOrder(data, type) {
        http("post", `/Order`, data).then(res => {
            if (res.code === 0) {
                const {
                    tradeId,
                    payRequestInfo,
                    alipayUrl
                } = res.data.orderAddResult;
                this.setData({
                    tradeId
                })
                // type为2是积分兑换
                if (type == 2) {
                    wx.showModal({
                        title: '提示',
                        content: '是否支付',
                        success: (res) => {
                            if (res.confirm) {
                                this.pay(tradeId)
                            } else if (res.cancel) {
                                // 取消支付
                            }
                        }
                    })
                } else {
                    wx.redirectTo({
                        url: '/pages/alipay/alipay?tradeId=' + tradeId + '&alipayUrl=' + encodeURIComponent(alipayUrl),
                    })
                }
            } else if (res.code === -1 && type === 2) {
                //如果积分下单失败
                console.log("积分订单下单失败")
                return;

            }
        })
    },
    //获取总计金额
    getAllMoney() {
        let sumMoney = 0;
        let sumPoint = 0;
        for (let i = 0; i < this.data.goodsInfo.length; i++) {
            if (this.data.goodsInfo[i].exchangeType === 1 || this.data.goodsInfo[i].exchangeType === 7) {
                if (!this.data.goodsInfo[i].isMember) {
                    if (this.data.goodsInfo[i].voucherId) {
                        if (this.data.goodsInfo[i].voucherType === 0) {
                            sumMoney += (this.data.goodsInfo[i].singleprice * this.data.goodsInfo[i].num) - this.data.goodsInfo[i].deductMoney;
                        } else {
                            sumMoney += Math.ceil((this.data.goodsInfo[i].singleprice * this.data.goodsInfo[i].num) * this.data.goodsInfo[i].deductMoney);

                        }
                    } else {
                        sumMoney += this.data.goodsInfo[i].voucherPrice;
                    }
                    if(this.data.goodsInfo[i].exchangeType === 1){
                        sumPoint+= 0;
                    }else{
                        sumPoint += this.data.goodsInfo[i].interGrationPrice * this.data.goodsInfo[i].num;
                    }
                    
                } else {
                    sumMoney += this.data.goodsInfo[i].voucherPrice;
                }
            }
        }
        if (this.data.voucherType == 0) {
            this.setData({
                allMoney: (sumMoney - this.data.deductMoney).toFixed(2),
                allPoint: sumPoint
            })
        } else {
            this.setData({
                allMoney: sumMoney,
                allPoint: sumPoint
            })
        }

    },
    //获取总计积分
    getAllPoint() {
        let sumPoint = 0;
        for (let i = 0; i < this.data.goodsInfo.length; i++) {
            if (this.data.goodsInfo[i].exchangeType === 0) {
                sumPoint += this.data.goodsInfo[i].interGrationAccount * this.data.goodsInfo[i].num;
            }
        }
        this.setData({
            allPoint: sumPoint
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
    onUnload() {},

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