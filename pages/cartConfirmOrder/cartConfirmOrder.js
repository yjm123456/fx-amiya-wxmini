// pages/cartConfirmOrder/cartConfirmOrder.js
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
        hospitalid: 0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        const goodsinfo = JSON.parse(decodeURIComponent(options.goodsInfo));
        for (let i = 0; i < goodsinfo.length; i++) {
            if (goodsinfo[i].isMaterial) {
                console.log("真实商品")
                this.setData({
                    isMaterial: true
                })
                break;
            }
        }
        this.setData({
            goodsInfo: goodsinfo
        })
        this.getAllMoney();
        this.getAllPoint();
    },
    handleSelectAddress() {
        const path = 'pages/confirmOrder/confirmOrder';
        wx.navigateTo({
            url: `/pages/addressList/addressList?selectAddress=${true}&path=${path}`
        })
    },
    handlePay(e) {
        const {goodsInfo}=this.data
        // const {
        //     ismaterial
        // } = e.currentTarget.dataset
        for (let i = 0; i < goodsInfo.length; i++) {
            if(goodsInfo[i].exchangeType===0){

            }else if(goodsInfo[i].exchangeType===1){}
            
        }
        const {
            address,
            goodsInfo,
            isMaterial,
            tradeId,
            allMoney,
            allPoint,
            hospitalid,
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
            orderItemList: goodsInfo.map(_item => {
                return {
                    // 商品编号
                    goodsId: _item.id,
                    // 购买数量
                    quantity: _item.quantity,
                    hospitalId: _item.hospitalid ? _item.hospitalid : 0,
                    actualPayment: Number(_item.allmoney) ? Number(_item.allmoney) : 0
                }
            })
        }
        // 生成订单
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
            }
        })
    },
    getAllMoney() {
        let sumMoney = 0;
        for (let i = 0; i < this.data.goodsInfo.length; i++) {
            if (this.data.goodsInfo[i].exchangeType === 1) {
                sumMoney += this.data.goodsInfo[i].price;
            }
        }
        this.setData({
            allMoney: sumMoney
        })
    },
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