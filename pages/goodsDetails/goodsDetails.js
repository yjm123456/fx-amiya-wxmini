import http from '../../utils/http.js';
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
import {
    iscustomer,
    isAuthorizationUserInfo
} from "./../../api/user";
Page({
    data: {
        control: false,

        goodsId: "",

        goodsInfo: null,
    },

    onLoad(e) {
        const {
            goodsId
        } = e;
        
        this.isCustomer((isCustomer) => {
            if (isCustomer) {
                this.getGoodsDetails(goodsId);
            } else {
                wx.switchTab({
                  url: '/pages/index/index',
                })
            }
        })
    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {
        return {
            title: this.data.goodsInfo.name,
            path: '/pages/productDetails/productDetails?goodsId=' + this.data.goodsId,
            imageUrl: this.data.goodsInfo.thumbPicUrl
        }
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
    toShoppingCart() {
        wx.navigateTo({
            url: '/pages/shoppingCart/shoppingCart',
        })
    },
    onSelectStandard(e){
        this.setData({
            selectStandardId: e.detail
        })
    },
    addToShoppingCart(e) {
        const {
            hospitalid,
            cityname,
            type,
            hospitalsaleprice,
            allmoney
        } = e.currentTarget.dataset
        
        const {
            goodsInfo
        } = this.data
        let token = wx.getStorageSync("token")
        if (!token) {
            wx.showToast({
                title: '请先登录',
                icon: 'none',
                duration: 2000
            })
        } else {
            if (goodsInfo.isMaterial) {
                console.log("实体商品")
                goodsInfo.allmoney = allmoney
                goodsInfo.hospitalid = hospitalid
                //设置新属性后重新更新值
                this.setData({
                    goodsInfo
                })
                const {
                    id,
                    quantity
                } = this.data.goodsInfo
                const data = {
                    GoodsId: id,
                    Num: quantity,
                    selectStandard:this.data.selectStandardId
                }
                console.log("选中的规格为"+this.data.selectStandardId);
                if(!this.data.selectStandardId){
                    wx.showToast({
                      title: '请选择规格',
                      icon:'none',
                      duration:1000
                    })
                    return;
                }
                http("post", `/GoodsShopCar`, data).then(res => {
                    if (res.code === 0) {
                        Toast('添加成功');
                    } else {
                        Toast('添加失败,请稍后重试');
                    }
                })
            } else {
                if (!cityname) {
                    wx.showToast({
                        title: '请选择城市',
                        icon: 'none',
                        duration: 2000
                    })
                } else if (!hospitalid) {
                    wx.showToast({
                        title: '请选择门店',
                        icon: 'none',
                        duration: 2000
                    })
                } else {
                    goodsInfo.salePrice = hospitalsaleprice
                    goodsInfo.allmoney = allmoney
                    goodsInfo.hospitalid = hospitalid
                    this.setData({
                        goodsInfo
                    })
                }
            }
        }

    },
    // 根据商品编号获取商品详情
    getGoodsDetails(goodsId) {
        this.setData({
            goodsId
        })
        http("get", `/Goods/infoById/${goodsId}`, ).then(res => {
            if (res.code === 0) {
                const {
                    goodsInfo
                } = res.data;
                if (goodsInfo.goodsDetailHtml) {
                    goodsInfo.goodsDetailHtml = goodsInfo.goodsDetailHtml.replace(/\<img/g, '<img style="width:100%;height:auto;display:block"')
                }
                this.setData({
                    goodsInfo:{
                        ...goodsInfo,
                        quantity: 1
                    }
                })
            }
        })
    },

    purchase() {
        this.setData({
            control: true,
        })
    },

    resetControlStandard() {
        this.setData({
            control: false
        })
    }
});