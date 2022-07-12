import http from '../../utils/http.js';

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
        this.getGoodsDetails(goodsId);
    },
    toShoppingCart() {
        wx.navigateTo({
            url: '/pages/shoppingCart/shoppingCart',
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
        console.log(hospitalid);
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
                    Num: quantity
                }
                console.log(goodsInfo);
                http("post", `/GoodsShopCar`, data).then(res => {
                    if (res.code === 0) {
                        Toast.success('添加成功');
                    } else {
                        Toast.success('添加失败');
                    }
                })
                // if (wx.getStorageSync('cart')) {
                //     const s = wx.getStorageSync('cart');
                //     console.log(s);
                //     for (let i = 0; i < s.length; i++) {
                //         if (s[i].id === goodsInfo.id) {
                //             Toast.success('购物车中已包含此商品');
                //             return;
                //         }
                //     }
                //     console.log([...s, goodsInfo])
                //     wx.setStorageSync('cart', [...s, goodsInfo]);
                //     Toast.success('添加成功');
                //     return;
                // }
                wx.setStorageSync('cart', [goodsInfo]);
                Toast.success('添加成功');
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
                    if (wx.getStorageSync('cart')) {
                        const s = wx.getStorageSync('cart');
                        console.log(s);
                        for (let i = 0; i < s.length; i++) {
                            if (s[i].id === goodsInfo.id) {
                                Toast.success('购物车中已包含此商品');
                                return;
                            }
                        }
                        wx.setStorageSync('cart', [...s, goodsInfo]);
                        Toast.success('添加成功');
                        return;
                    }
                    wx.setStorageSync('cart', [goodsInfo]);
                    Toast.success('添加成功');
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