// pages/selectVoucher/selectVoucher.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        list: [],
        radio: '',
        voucherId: '',
        deductmoney: '',
        vouchername: '',
        voucherType: '',
        goodsId: '',
        type: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        const list = JSON.parse(options.list);
        if (options.type === 'shopcar') {
            this.setData({
                type: options.type,
                goodsId: options.goodsId
            })
        }
        this.setData({
            list
        })
    },
    onChange(event) {

        this.setData({
            radio: event.detail,
        });
    },
    onClick(event) {
        this.setData({
            voucherId: event.currentTarget.dataset.voucherid,
            deductmoney: event.currentTarget.dataset.deductmoney,
            vouchername: event.currentTarget.dataset.vouchername,
            voucherType: event.currentTarget.dataset.type
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

    },
    //将选中的抵用券id传递给商品页
    storeSubmit() {
        var pages = getCurrentPages(); //当前页面
        var prevPage = pages[pages.length - 2]; //上一页面
        if (this.data.type == 'shopcar') {
            const voucherInfo = {
                voucherId: this.data.voucherId,
                deductmoney: this.data.deductmoney,
                vouchername: this.data.vouchername,
                voucherType: this.data.voucherType,
                goodsId: this.data.goodsId
            }
            var list = prevPage.data.list;
            for (let index = 0; index < list.length; index++) {
                const element = list[index];
                if (element.goodsId === this.data.goodsId) {
                    element.voucherId = this.data.voucherId;
                    if(this.data.voucherType==4){
                        
                        element.voucherName=this.data.vouchername;
                        element.voucherType=this.data.voucherType;
                        element.deductMoney= this.data.deductmoney;
                    }else if(this.data.voucherType==0){
                        
                        element.voucherName=this.data.vouchername;
                        element.voucherType=this.data.voucherType;
                        element.deductMoney= this.data.deductmoney;
                    }
                }
                list[index] = element;
                prevPage.setData({
                    list: list,
                    voucherId: this.data.voucherId,
                    deductmoney: this.data.deductmoney,
                    vouchername: this.data.vouchername,
                    voucherType: this.data.voucherType
                })
            }
            prevPage.getAllMoney();
            // prevPage.setData({
            //     //直接给上一个页面赋值
            //     voucherInfoList:[...prevPage.data.voucherInfoList,voucherInfo]
            // });
            wx.navigateBack({
                //返回
                delta: 1
            })
        } else {
            prevPage.setData({
                //直接给上一个页面赋值
                voucherId: this.data.voucherId,
                deductmoney: this.data.deductmoney,
                vouchername: this.data.vouchername,
                voucherType: this.data.voucherType
            });
            wx.navigateBack({
                //返回
                delta: 1
            })
        }


    }
})