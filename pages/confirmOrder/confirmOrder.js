import http from "./../../utils/http";

Page({

    /**
     * 页面的初始数据
     */
    data: {
        // 积分
        // 地址
        address: null,
        // 商品
        goodsInfo: [],
        // 备注
        remark: "",
        // 是否实物
        isMaterial: false,
        // 总价格
        totalPrice: 0,
        // 交易编号
        tradeId: "",
        //支付方式(默认微信)
        pay: 0,
        // 商城
        //城市id
        cityid: "",
        // 医院id
        hospitalid: "",
        // 判断是商城还是积分兑换
        type: "",
        // 总价
        allmoney: "",
        active: 1,
        voucherName: '',
        voucherId: '',
        deductMoney: '',
        isCard: false,
        nickName: '',
        phone: '',
        cardName: '',
        thumbPicUrl: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        const {
            isCard,
        } = options;
        const goodsInfo = JSON.parse(decodeURIComponent(options.goodsInfo));
        const {
            hospitalid,
            type,
            allmoney,
            voucherName,
            voucherId,
            deductMoney,
            selectStandard,
            discount,
            voucherType
        } = options
        this.setData({
            discount,
            voucherType,
            hospitalid,
            goodsInfo,
            allmoney,
            type,
            voucherId,
            voucherName,
            deductMoney,
            selectStandard,
            isMaterial: goodsInfo.some(_item => _item.isMaterial),
            totalPrice: goodsInfo.reduce((acc, cur) => {
                return acc += cur.integrationQuantity * cur.quantity
            }, 0).toFixed(2)
        })
        //商品化修改之前
        // if (isCard == 'true') {
        //     const {
        //         nickName,
        //         phone
        //     } = options;
        //     this.setData({
        //         isMaterial: false,
        //         nickName,
        //         phone,
        //         totalPrice: 1999,
        //         cardName: cardName,
        //         thumbPicUrl,
        //         isCard: true
        //     })
        // }
        //商品化修改之前
        
        //商品化修改
        if (isCard == 'true') {
            const {
                nickName,
                phone
            } = options;
            this.setData({
                nickName,
                phone,
                isCard: true
            })
        }
        //商品化修改
    },



    onChange(event) {
        // this.setData({
        //     pay: event.detail,
        // });
    },
    onClick(event) {
        const {
            name
        } = event.currentTarget.dataset;
        this.setData({
            pay: name,
        });
    },
    handleSelectAddress() {
        const path = 'pages/confirmOrder/confirmOrder';
        wx.navigateTo({
            url: `/pages/addressList/addressList?selectAddress=${true}&path=${path}`
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

    handlePay(e) {
        const {
            pay
        } = this.data;

        const {
            ismaterial
        } = e.currentTarget.dataset
        const {
            address,
            goodsInfo,
            remark,
            isMaterial,
            tradeId,
            allmoney,
            hospitalid,
            type,
            voucherName,
            voucherId,
            deductMoney,
            isCard,
            nickName,
            phone,
            cardName,
            thumbPicUrl,
            
        } = this.data;
        if (tradeId && type == 2) {
            // 支付
            this.pay(tradeId)
            return;
        }
        if (isMaterial && !address) {
            wx.showToast({
                title: '请选择地址',
                icon: 'none',
                duration: 2000
            })
            return;
        }
        const data = {
            // 地址编号
            addressId: address && address.id,
            // 备注
            remark,
            //支付方式
            exchangeType: pay,
            //使用的抵用券
            voucherId,
            isCard,
            nickName,
            phone,
            orderItemList: goodsInfo.map(_item => {
                return {
                    // 商品编号
                    goodsId: _item.id,
                    // 购买数量
                    quantity: _item.quantity,
                    hospitalId: _item.hospitalid ? _item.hospitalid : 0,
                    actualPayment: Number(_item.allmoney) ? Number(_item.allmoney) : 0,
                    appointmentCity: _item.appointmentCity ? _item.appointmentCity : null,
                    appointmentDate: _item.appointmentDate ? _item.appointmentDate : null,
                    isSkinCare: _item.isSkinCare ? _item.isSkinCare : false,
                    isFaceCard: _item.isFaceCard ? _item.isFaceCard : false,
                    selectStandard:_item.selectStandard
                }
            }),
        }
        // 生成订单
        http("post", `/Order`, data).then(res => {
            if (res.code === 0) {
                const {
                    tradeId,
                    payRequestInfo,
                    alipayUrl,
                    voucherId,
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
                                console.log("确认")
                                console.log(tradeId);
                                this.pay(tradeId)
                            } else if (res.cancel) {
                                // 取消支付
                            }
                        }
                    })
                } else {
                    if (pay === 0) {
                        wx.showToast({
                            title: '请先选择支付方式',
                            icon: 'none',
                            duration: 1000
                        })
                        return;
                    }
                    if (pay == 1) {
                        wx.redirectTo({
                            url: '/pages/alipay/alipay?tradeId=' + tradeId + '&alipayUrl=' + encodeURIComponent(alipayUrl),
                        })
                    } else if (pay == 4) {
                        wx.requestPayment({
                            timeStamp: payRequestInfo.timeStamp,
                            nonceStr: payRequestInfo.nonceStr,
                            package: payRequestInfo.package,
                            signType: payRequestInfo.signType,
                            paySign: payRequestInfo.paySign,
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
                    } else if (pay == 3) {
                        wx.showModal({
                            title: '提示',
                            content: '是否支付',
                            success: (res) => {
                                if (res.confirm) {
                                    this.balancePay(tradeId)
                                } else if (res.cancel) {
                                    // 取消支付
                                }
                            }
                        })
                    }
                }
            }
        })
    },
    balancePay(tradeId) {
        http("post", `/Order/balancePay/${tradeId}`).then(res => {
            if (res.code === 0) {
                wx.showToast({
                    title: '支付成功',
                    icon: 'success',
                    duration: 2000,
                    success: function () {
                        setTimeout(function () {
                            wx.redirectTo({
                                url: '/pages/orderList/orderList'
                            })
                        }, 2000);
                    }
                })
            }
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
                        setTimeout(function () {
                            wx.redirectTo({
                                url: '/pages/orderList/orderList'
                            })
                        }, 2000);
                    }
                })
            }
        })
    }
})