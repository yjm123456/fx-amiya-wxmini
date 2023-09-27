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

        cityList: [],

        cityShow: false,

        cityId: '',

        cityName: '',

        storeInfo: '',

        storeShow: false,
        // 授权手机号
        controlAuthPhone: false,
    },

    onLoad(e) {
        const {
            goodsId
        } = e;
        this.getGoodsDetails(goodsId);
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
    // 绑定手机号
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
        this.getShareInfo();
        if (scene != 'undefined') {
            this.setSuperior(scene);
        }
    },

    // 取消绑定手机号
    cancelBindPhone() {
        this.setData({
            controlAuthPhone: false
        })
    },
    // 根据商品id获取该商品绑定的合作医院城市列表
    getCooperativeHospitalCity(goodsId) {
        const data = {
            goodsId: goodsId
        }
        //请求返回结果只包含城市的id和name
        http("get", `/CooperativeHospitalCity/getListByGoodsId`, data).then(res => {
            if (res.code === 0) {
                const cityList = [];
                res.data.cityList.map((item, index) => {
                    cityList.push(item.name)
                })
                this.setData({
                    //包含城市名称和id
                    cityList: res.data.cityList
                })
            }
        })
    },
    // 城市选择
    cityChoice: function (e) {
        this.setData({
            cityShow: true
        })
    },
    //确认选择门店
    cityConfirms(e) {
        const {
            cityid,
            cityname
        } = e.currentTarget.dataset
        if (!cityid) {
            wx.showToast({
                title: '请选择城市',
                icon: 'none',
                duration: 1000
            })
            return;
        }
        this.setData({
            storeInfo: {},
            cityShow: false,
        })
    },
    // 城市选择 取消
    cityCancel: function (e) {
        this.setData({
            cityShow: false
        })
    },
    // 城市选择 弹出层
    onClose: function (params) {
        this.setData({
            cityShow: false
        })
    },
    //选择城市
    citysName(e) {
        const {
            index
        } = e.currentTarget.dataset
        const {
            id,
            name
        } = e.currentTarget.dataset.cityinfo
        this.setData({
            current: index,
            cityId: id,
            cityName: name
        })
    },
    //选择门店
    selectStore(e) {
        const goodsId = this.data.goodsInfo.id
        const {
            cityName
        } = this.data;
        if (cityName) {
            this.data.cityList.find(item => {
                if (item.name == cityName) {
                    this.setData({
                        cityId: item.id
                    })
                    wx.navigateTo({
                        //跳转参数city城市id,goodsId商品id
                        url: '/pages/store/store?city=' + item.id + '&goodsId=' + goodsId,
                    })
                }
            })
        } else {
            wx.showToast({
                title: '请先选择城市',
                icon: 'none',
                duration: 1000
            })
        }
    },
    // 获取门店列表
    getStoreList(goodsId, city) {
        const data = {
            goodsId,
            city
        }
        http("get", `/HospitalInfo/GoodsOfflineDoor`, data).then(res => {
            if (res.code === 0) {
                const {
                    hospitalInfoList
                } = res.data
                this.setData({
                    hospitalInfoList
                })
            } else {
                wx.showToast({
                    title: res.msg,
                    icon: 'none',
                    duration: 2000
                })
            }
        })
    },
     // 购买数量
     handleNumChange(event) {
        const {
            goodsInfo
        } = this.data;
        const {
            type,
            saleprice,
            ismaterial,
            ismember,
            memberrankprice,
            integration
        } = event.currentTarget.dataset
        let quantity = event.detail
        // type==1 判断是否为实物 如果是实物的话需要发货 总价计算的是销售价格x数量
        if (ismaterial == true) {
            goodsInfo.quantity = quantity
            this.setData({
                goodsInfo
            })
            if (saleprice) {
                this.setData({
                    totalPrice: ((ismember ? memberrankprice : saleprice) * goodsInfo.quantity).toFixed(2),
                    totalIntegrationPrice:(integration*goodsInfo.quantity).toFixed(2),
                    goodsInfo
                })
            }
        } else {
            // type==0是虚拟商品 总价计算的是门店价格x数量
            let hospitalSalePrice = this.data.storeInfo.hospitalSalePrice
            goodsInfo.salePrice = hospitalSalePrice
            goodsInfo.quantity = quantity
            this.setData({
                goodsInfo
            })
            if (hospitalSalePrice) {
                this.setData({
                    totalPrice: (hospitalSalePrice * goodsInfo.quantity).toFixed(2),
                })
            } else {
                wx.showToast({
                    title: '请选择门店在添加购买数量',
                    icon: 'none',
                    duration: 2000
                })
            }
        }
    },
    // 没有选择门店不让它选择购买数量
    disabledNum() {
        wx.showToast({
            title: '请先选择城市和门店',
            icon: 'none',
            duration: 2000
        })
    },
    handlePayment(e) {
        const {cityId,storeInfo}=this.data;
        if(!cityId){
            wx.showToast({
                title: '"请选择城市"',
                icon: 'none',
                duration: 1000
            })
            return;
        }
        if (!this.data.storeInfo.id) {
            wx.showToast({
                title: '"请选择门店"',
                icon: 'none',
                duration: 1000
            })
            return;
        }
        // 2为积分支付商品
        let type = 2;
        const {
            goodsInfo
        } = this.data;
        wx.navigateTo({
            url: "/pages/confirmOrder/confirmOrder?goodsInfo=" + encodeURIComponent(JSON.stringify([goodsInfo])) + '&type=' + type + '&storeInfo='+encodeURIComponent(JSON.stringify(storeInfo))
        })
    },
    toShoppingCart() {
        wx.navigateTo({
            url: '/pages/shoppingCart/shoppingCart',
        })
    },
    onSelectStandard(e) {
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
                    selectStandard: this.data.selectStandardId
                }
                console.log("选中的规格为" + this.data.selectStandardId);
                if (!this.data.selectStandardId) {
                    wx.showToast({
                        title: '请选择规格',
                        icon: 'none',
                        duration: 1000
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
                const {
                    isMaterial
                } = goodsInfo;
                if (!isMaterial) {
                    this.getCooperativeHospitalCity(goodsId);
                }
                this.setData({
                    goodsInfo: {
                        ...goodsInfo,
                        quantity: 1
                    }
                })
            }
        })
    },
    purchase(){
        this.isCustomer((isCustomer) => {
            if (isCustomer) {
                this.purchase2()
            } else {
                this.handleBindPhone();
            }
        })
    },
    purchase2() {
        const {isMaterial}=this.data.goodsInfo
        if(isMaterial){
            this.setData({
                control: true,
            })
        }else{
            this.handlePayment();
        }
        
    },

    resetControlStandard() {
        this.setData({
            control: false
        })
    }
});