// pages/goodsList/goodsList.js
import http from '../../utils/http';
import {
    iscustomer,
    isAuthorizationUserInfo
} from "./../../api/user";
Page({

    /**
     * 页面的初始数据
     */
    data: {
        //类别id
        tagId:'',
        //商品列表信息
        goodsInfos:[],
        controlAuthPhone:false,
        pageNum:1,
        pageSize:10,
        nextPage:true,
        saleCountSelected:false,
        priceSelected:false,
        sort:0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        const {id}=options;
        this.setData({
            tagId:id
        });
        this.getGoodsInfo();
    },
    getGoodsInfo() {
        var app=getApp();
        const {appId}=app.globalData
        const {
            tagId,
            pageNum,
            sort,
            pageSize
        } = this.data;
        const data = {
            tagId,
            appId,
            sort,
            pageNum,
            pageSize
        }
        http("get", `/Goods/tagGoodsList`, data).then(res => {
            if (res.code === 0) {
                let {
                    list,
                    totalCount
                } = res.data.list;
                this.setData({
                    goodsInfos: [...this.data.goodsInfos, ...list],
                })
                this.data.pageNum++
                if (this.data.goodsInfos.length === totalCount) {
                    this.setData({
                        nextPage: false
                    })
                }
            }
        })
    },
    goodsDetails(e) {
        this.isCustomer((isCustomer) => {
            if (isCustomer) {
                const {
                    goodsid,
                    exchagetype
                } = e.currentTarget.dataset;
                if(exchagetype==0){
                    wx.navigateTo({
                        url: `/pages/goodsDetails/goodsDetails?goodsId=${goodsid}`
                    })
                }else{
                    wx.navigateTo({
                        url: `/pages/productDetails/productDetails?goodsId=${goodsid}`
                    })
                }
                
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
        //this.getShareInfo();
    },
    // 取消绑定手机号
    cancelBindPhone() {
        this.setData({
            controlAuthPhone: false
        })
    },
    //点击销量
    saleCountSelect() {
        const {
            saleCountSelected,
            priceSelected
        } = this.data;
        this.setData({
            saleCountSelected: !saleCountSelected,
            priceSelected: false,
            sort:1
        })
        this.setData({
            pageNum: 1,
            goodsInfos: [],
            nextPage: true
        })
        this.getGoodsInfo();
    },
    //点击价格
    priceSelect() {
        const {
            priceSelected,
            saleCountSelected
        } = this.data;
        this.setData({
            saleCountSelected: false,
            priceSelected: !priceSelected
        })
        this.setData({
            pageNum: 1,
            goodsInfos: [],
            nextPage: true,
            sort:2
        })
        this.getGoodsInfo();
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
        this.getGoodsInfo();
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    }
})