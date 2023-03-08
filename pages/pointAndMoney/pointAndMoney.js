// pages/pointAndMoney/pointAndMoney.js
import http from '../../utils/http.js';
import {
    iscustomer,
    isAuthorizationUserInfo
} from "./../../api/user";
Page({

    /**
     * 页面的初始数据
     */
    data: {
        pageNum:1,
        pageSize:10,
        nextPage:true,
        goodsInfos:[],
        goodsCategorys:"",
        categoryActive:0,
        isScrolling: false,
        categoryActive: 0,
        // 商品分类
        goodsCategoryList: [],
        // 商品分类
        categoryId: "",
        controlAuthPhone:false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad() {
        //this.getGoodsInfo();
        this.getGoodsCategory();
    },
    getGoodsCategory() {
        http("get", `/Goods/categoryList?showDirectionType=0`).then(res => {
            if (res.code === 0) {
                const {
                    goodsCategorys
                } = res.data;
                //判断是否有已存在的类别
                if(!this.data.goodsCategorys){
                    this.setData({
                        goodsCategorys,
                        categoryActive: 0,
                        categoryId: goodsCategorys.length && goodsCategorys[0].id
                    })
                    this.getGoodsInfo();
                }else{
                    console.log("类别已存在");
                    if(this.data.goodsCategorys.length!=goodsCategorys.length){
                        this.setData({
                            pageNum: 1,
                            goodsInfos: [],
                            nextPage: true
                        })
                        this.setData({
                            goodsCategorys,
                            categoryActive: 0,
                            categoryId: goodsCategorys.length && goodsCategorys[0].id
                        })
                        this.getGoodsInfo();
                        return;
                    }
                    for (let index = 0; index < goodsCategorys.length; index++) {
                        var exist= this.data.goodsCategorys.findIndex(item=>item.name==goodsCategorys[index].name);
                        if(exist<0){
                            this.setData({
                                pageNum: 1,
                                goodsInfos: [],
                                nextPage: true
                            })
                            this.setData({
                                goodsCategorys,
                                categoryActive: 0,
                                categoryId: goodsCategorys.length && goodsCategorys[0].id
                            })
                            this.getGoodsInfo();
                        }
                    }
                }    
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
    to(e){
        const {page}=e.currentTarget.dataset;
        this.isCustomer((isCustomer) => {
            if (isCustomer) {
                wx.navigateTo({
                    url: page
                })
            } else {
                this.handleBindPhone();
            }
        })
    },
    loadMore() {
        if (this.data.nextPage) {
            if (this.data.isScrolling === true) return;
            this.data.isScrolling = true;
            this.getGoodsInfo(() => {
                this.data.isScrolling = false;
            });
        }
    },
    handleGoodsCategoryClick(e) {
        const {
            categoryid,
            index
        } = e.currentTarget.dataset;
        if (this.data.categoryId !== categoryid) {
            this.setData({
                categoryId: categoryid,
                categoryActive: index,
                pageNum: 1,
                goodsInfos: [],
                nextPage: true
            })
            this.getGoodsInfo();
        }
    },
    // 获取商品列表
    getGoodsInfo(callback) {
        const {
            categoryId,
            pageNum,
            pageSize
        } = this.data;
        const data = {
            categoryId,
            pageNum,
            pageSize
        }
        http("get", `/Goods/infoList`, data).then(res => {
            if (res.code === 0) {
                let {
                    list,
                    totalCount
                } = res.data.goodsInfos;
                this.setData({
                    goodsInfos: [...this.data.goodsInfos, ...list],
                })
                callback && callback();
                this.data.pageNum++
                console.log("参数为" + this.data.goodsInfos.length === totalCount);
                if (this.data.goodsInfos.length === totalCount) {
                    this.setData({
                        nextPage: false
                    })
                }
            }
        })
    },
    // 商品详情
    goodsDetails(e) {
        const {
            goodsid
        } = e.currentTarget.dataset;
        wx.navigateTo({
            url: `/pages/goodsDetails/goodsDetails?goodsId=${goodsid}`
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

    },
    onReachBottom(){
        this.getGoodsInfo();
    }
})