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
        havePoint: true,
        address: "",
        tradeId: "",
        hospitalid: 0,
        remark: "",
        moneyTradeId: "",
        removeList: [],
        showOverAllVoucher: true,
        overAllVoucher:[],
        selectVoucherIndex:-1,
        selectOverAllVoucherId:'',
        deductMoney: 0,
        show:false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        const goodsinfo = JSON.parse(decodeURIComponent(options.goodsInfo));
        for (let i = 0; i < goodsinfo.length; i++) {
            if (goodsinfo[i].isMaterial) {
                this.setData({
                    isMaterial: true
                })
                break;
            }
        }
        for (let i = 0; i < goodsinfo.length; i++) {
            if (goodsinfo[i].voucherId) {
                this.setData({
                    showOverAllVoucher: false
                })
                break;
            }
        }
        for (let i = 0; i < goodsinfo.length; i++) {
            if (goodsinfo[i].exchangeType!=0) {
                this.setData({
                    show:true
                })
                break;
            }
        }
        if(this.data.showOverAllVoucher&&this.data.show){
            this.getOverAllVoucher();
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
        this.getAllPoint();
    },
    selectOverAllVoucher(e){
        const {index,id,deduct}=e.currentTarget.dataset;
        this.setData({
            selectVoucherIndex:index,
            selectOverAllVoucherId:id,
            deductMoney:deduct
        }) 
    },
    //获取用户拥有的全局使用的抵用券
    getOverAllVoucher(){
        http("get", `/customerConsumptionVoucher/overAllList`).then(res => {
            if (res.code === 0) {
                const voucher=res.data.customerOverAllConsumptionVoucher;
                this.setData({
                    overAllVoucher:voucher
                })
            }
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
        const {
            goodsInfo,
            isMaterial,
            address,
            remark,
            selectOverAllVoucherId,
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
        let pointItemList = [];
        let moneyItemList = [];

        //将订单拆分为积分订单和三方支付订单
        for (let i = 0; i < goodsInfo.length; i++) {
            //积分商品
            if (goodsInfo[i].exchangeType === 0) {
                pointItemList = [...pointItemList, goodsInfo[i]]
            } else if (goodsInfo[i].exchangeType === 1) {
                //非积分商品
                moneyItemList = [...moneyItemList, goodsInfo[i]]
            }
        }
        //积分商品下单
        if (pointItemList.length > 0) {
            const data = {
                // 备注
                remark,
                orderItemList: pointItemList.map(_item => {
                    return {
                        // 商品编号
                        goodsId: _item.goodsId,
                        // 购买数量
                        quantity: _item.num,
                        hospitalId: _item.hospitalId ? _item.hospitalid : 0,
                        actualPayment: Number(_item.interGrationAccount * _item.num) ? Number(_item.interGrationAccount * _item.num) : 0,
                        selectStandard: _item.selectStandards
                    }
                })
            }
            if (isMaterial) {
                data.addressId = address && address.id
            }
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
                    wx.showModal({
                        title: '提示',
                        content: '是否支付',
                        success: (res) => {
                            if (res.confirm) {
                                //this.pay(tradeId)
                                http("post", `/Order/pay/${tradeId}`).then(res => {
                                    //积分下单成功
                                    if (res.code === 0) {
                                        //判断包含三方支付订单
                                        if (moneyItemList.length > 0) {

                                            const data = {
                                                remark,
                                                exchangeType: 4,
                                                voucherId:selectOverAllVoucherId,
                                                orderItemList: moneyItemList.map(_item => {
                                                    return {
                                                        // 商品编号
                                                        goodsId: _item.goodsId,
                                                        // 购买数量
                                                        quantity: _item.num,
                                                        hospitalId: _item.hospitalId ? _item.hospitalId : 0,
                                                        actualPayment: _item.isMember ? (Number(_item.memberPrice * _item.num)) : (Number(_item.singleprice) ? Number(_item.singleprice * _item.num) : 0),
                                                        selectStandard: _item.selectStandards,
                                                        voucherId: _item.voucherId
                                                    }
                                                })
                                            }
                                            if (isMaterial) {
                                                data.addressId = address && address.id
                                            }
                                            http("post", `/Order`, data).then(res => {
                                                if (res.code === 0) {
                                                    this.deleteFormShopCart()
                                                    const {
                                                        tradeId,
                                                        payRequestInfo,
                                                        alipayUrl
                                                    } = res.data.orderAddResult;
                                                    this.setData({
                                                        moneyTradeId: tradeId
                                                    })
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

                                                }
                                            })
                                        } else {
                                            this.deleteFormShopCart();
                                            wx.showToast({
                                                title: '支付成功',
                                                icon: 'success',
                                                duration: 2000,
                                                success: function () {
                                                    setTimeout(function () {
                                                        wx.redirectTo({
                                                            url: '/pages/orderList/orderList',
                                                        })
                                                    }, 1000);
                                                }
                                            })
                                        }
                                    } else {}
                                })
                            } else if (res.cancel) {
                                // 取消支付
                            }
                        }
                    })
                }
            })
        } else {
            if (moneyItemList.length > 0) {
                const data = {
                    // 备注
                    remark,
                    exchangeType: 4,
                    voucherId:selectOverAllVoucherId,
                    orderItemList: moneyItemList.map(_item => {
                        return {
                            // 商品编号
                            goodsId: _item.goodsId,
                            // 购买数量
                            quantity: _item.num,
                            hospitalId: _item.hospitalId ? _item.hospitalId : 0,
                            //actualPayment: Number(_item.singleprice) ? Number(_item.singleprice*_item.num) : 0
                            actualPayment: _item.isMember ? (Number(_item.memberPrice * _item.num)) : (Number(_item.singleprice) ? Number(_item.singleprice * _item.num) : 0),
                            selectStandard: _item.selectStandards,
                            voucherId: _item.voucherId
                        }
                    })
                }
                if (isMaterial) {
                    data.addressId = address && address.id
                }
                http("post", `/Order`, data).then(res => {
                    console.log("调用");
                    if (res.code === 0) {
                        console.log("调用");
                        this.deleteFormShopCart();
                        const {
                            tradeId,
                            payRequestInfo,
                            alipayUrl
                        } = res.data.orderAddResult;
                        this.setData({
                            tradeId
                        })
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

                    }
                })
            }
        }

        // const {
        //     //address,
        //     // goodsInfo,
        //     //isMaterial,
        //     tradeId,
        //     allMoney,
        //     allPoint,
        //     hospitalid,
        // } = this.data;
        // if (tradeId && type == 2) {
        //     // 支付
        //     this.pay(tradeId)
        //     return;
        // }
        // // if (isMaterial && !address) {
        // //     wx.showToast({
        // //         title: '请选择地址',
        // //         icon: 'none',
        // //         duration: 2000
        // //     })
        // //     return;
        // // }
        // const data = {
        //     // 地址编号
        //     addressId: address && address.id,
        //     // 备注
        //     remark,
        //     orderItemList: goodsInfo.map(_item => {
        //         return {
        //             // 商品编号
        //             goodsId: _item.id,
        //             // 购买数量
        //             quantity: _item.quantity,
        //             hospitalId: _item.hospitalid ? _item.hospitalid : 0,
        //             actualPayment: Number(_item.allmoney) ? Number(_item.allmoney) : 0
        //         }
        //     })
        // }
        // // 生成订单
        // http("post", `/Order`, data).then(res => {
        //     if (res.code === 0) {
        //         const {
        //             tradeId,
        //             payRequestInfo,
        //             alipayUrl
        //         } = res.data.orderAddResult;
        //         this.setData({
        //             tradeId
        //         })
        //         // type为2是积分兑换
        //         if (type == 2) {
        //             wx.showModal({
        //                 title: '提示',
        //                 content: '是否支付',
        //                 success: (res) => {
        //                     if (res.confirm) {
        //                         this.pay(tradeId)
        //                     } else if (res.cancel) {
        //                         // 取消支付
        //                     }
        //                 }
        //             })
        //         } else {
        //             // type为1 是商城支付
        //             // wx.requestPayment({
        //             //   timeStamp:  payRequestInfo.timeStamp,
        //             //   nonceStr:  payRequestInfo.nonceStr,
        //             //   package:  payRequestInfo.package,
        //             //   signType:  payRequestInfo.signType,
        //             //   paySign: payRequestInfo.paySign,
        //             //   success (res) { 
        //             //     http("post", `/Order/pay/${tradeId}`).then(res => {
        //             //       if (res.code === 0) {
        //             //         wx.showToast({
        //             //           title: '支付成功',
        //             //           icon: 'success',
        //             //           duration: 2000,
        //             //           success: function () {
        //             //             // http("post", `/Order/pay/${tradeId}`).then(res => {})
        //             //             setTimeout(function () {
        //             //               wx.redirectTo({
        //             //                 url: '/pages/purchasedOrder/purchasedOrder',
        //             //               })
        //             //             }, 2000);
        //             //           }
        //             //         })
        //             //       }
        //             //     })
        //             //   },
        //             //   fail (res) { 
        //             //     wx.showToast({ title: '支付失败', icon: 'none', duration: 2000 })
        //             //   }
        //             // })
        //             wx.redirectTo({
        //                 url: '/pages/alipay/alipay?tradeId=' + tradeId + '&alipayUrl=' + encodeURIComponent(alipayUrl),
        //             })
        //         }
        //     }
        // })
    },
    deleteFormShopCart() {
        // var pages = getCurrentPages();
        // var prevPage = pages[pages.length - 2]; //购物车页面
        // var list = prevPage.data.list;
        // const {
        //     removeList
        // } = this.data;
        // let newCart=[];
        // for (let i = 0; i < removeList.length; i++) {
        //     const item = removeList[i];
        //     for (let j = 0; j < list.length; j++) {
        //         if(item===list[j].id){
        //             continue;
        //         }else{
        //             newCart=[...newCart,list[j]]
        //         }
        //     }
        // }
        // prevPage.setData({

        // })
        // prevPage.setData({
        //     //直接给上一个页面赋值
        //     storeInfo: this.data.storeInfo
        // });
        // wx.navigateBack({
        //     //返回
        //     delta: 1
        // })
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
            //console.log("生成的订单信息为"+res.data.orderAddResult)
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
                    // type为1 是商城支付
                    // wx.requestPayment({
                    //   timeStamp:  payRequestInfo.timeStamp,
                    //   nonceStr:  payRequestInfo.nonceStr,
                    //   package:  payRequestInfo.package,
                    //   signType:  payRequestInfo.signType,
                    //   paySign: payRequestInfo.paySign,
                    //   success (res) { 
                    //     http("post", `/Order/pay/${tradeId}`).then(res => {
                    //       if (res.code === 0) {
                    //         wx.showToast({
                    //           title: '支付成功',
                    //           icon: 'success',
                    //           duration: 2000,
                    //           success: function () {
                    //             // http("post", `/Order/pay/${tradeId}`).then(res => {})
                    //             setTimeout(function () {
                    //               wx.redirectTo({
                    //                 url: '/pages/purchasedOrder/purchasedOrder',
                    //               })
                    //             }, 2000);
                    //           }
                    //         })
                    //       }
                    //     })
                    //   },
                    //   fail (res) { 
                    //     wx.showToast({ title: '支付失败', icon: 'none', duration: 2000 })
                    //   }
                    // })
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
        for (let i = 0; i < this.data.goodsInfo.length; i++) {
            if (this.data.goodsInfo[i].exchangeType === 1) {
                if (!this.data.goodsInfo[i].isMember) {
                    if (this.data.goodsInfo[i].voucherId) {
                        if (this.data.goodsInfo[i].voucherType === 0) {
                            sumMoney += (this.data.goodsInfo[i].singleprice * this.data.goodsInfo[i].num) - this.data.goodsInfo[i].deductMoney;
                        } else {
                            sumMoney += Math.ceil((this.data.goodsInfo[i].singleprice * this.data.goodsInfo[i].num) * this.data.goodsInfo[i].deductMoney);
                        }
                    }else{
                        sumMoney += this.data.goodsInfo[i].singleprice * this.data.goodsInfo[i].num;
                    }
                } else {
                    sumMoney += this.data.goodsInfo[i].singleprice * this.data.goodsInfo[i].num;
                }
            }
        }
        console.log("sum" + sumMoney);
        this.setData({
            allMoney: sumMoney
        })
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