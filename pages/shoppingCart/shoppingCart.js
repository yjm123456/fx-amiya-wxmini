// pages/shoppingCart/shoppingCart.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        selectAll: false,
        //购物车商品列表
        list: [],
        //选中的商品列表
        result: [],
        sum:0
    },
    onChange(event) {
        this.setData({
            result: event.detail,
        });
        if (this.data.result.length === this.data.list.length) {
            this.setData({
                selectAll: true
            })
        } else {
            this.setData({
                selectAll: false
            })
        }
        //let sumMoney=0;
        // for(let i=0;i<this.data.result.length;i++){
        //     console.log("价格"+this.data.result[i].allmoney);
        //     sumMoney+=this.data.result[i].allmoney;
        // }
        // this.setData({
        //     sum:sumMoney
        // })
    },
    //单元格触发复选框点击事件
    toggle(event) {
        const {
            index
        } = event.currentTarget.dataset;
        const checkbox = this.selectComponent(`.checkboxes-${index}`);
        checkbox.toggle();
    },

    noop() {},
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        this.getCartProduct();
    },
    getCartProduct() {
        const cart = wx.getStorageSync('cart');
        if (cart) {
            this.setData({
                list: cart
            })
        }
    },
    radioChange(e) {
        if (this.data.selectAll) {
            this.setData({
                selectAll: false,
                result: []
            })
        } else {
            this.setData({
                selectAll: true,
                result: this.data.list
            })

        }
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