// pages/productDetails/productDetails.js
import http from '../../utils/http.js';
let app =getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    swiperArr:[
      {
        id:1,
        img:"/images/hc.png"
      },
      {
        id:2,
        img:"/images/receiveCard.png"
      }
    ],
    // 获取医院合作过的城市
    cityList: [],
    

    // 选中的城市
    cityValue:"",

    // 商品数量
    goodNums:0,
    
    // 计算价格
    totalPrice: 0,

    // 兼容底部那条杠
    isIphoneX:false,

    // 根据商品编号获取商品详情
    goodsInfo:{},

    // 城市列表
    cityLists:[],

    // 备注
    remarksValue:"",

    // 选完门店返回到这个页面接收参数
    storeInfo:{},

    // 城市弹窗显示
    cityShow:false,

    // 判断选中城市
    current:"",

    // 城市id
    cityId:"",

    // 城市名称
    cityName:"",
    cityIds:"",
    cityNames:"",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const { goodsId } = options;
    this.getGoodsDetails(goodsId);
    this.getCooperativeHospitalCity(goodsId)
    this.setData({
      "isIphoneX": this.isIphoneX()
    })
  },
  // 选择城市 改
  citysName(e){
    const {index} = e.currentTarget.dataset
    const {id,name} = e.currentTarget.dataset.cityinfo
    this.setData({
      current : index,
      cityId:id,
      cityName:name
    })
  },

  // 获取合作医院城市列表
  getCooperativeHospitalCity(goodsId){
    const data = {
      goodsId : goodsId
    }
    http("get", `/CooperativeHospitalCity/getListByGoodsId`,data).then(res => {
      if(res.code === 0){
        const cityList = []
        res.data.cityList.map((item,index)=>{
          cityList.push(item.name)
        })
        this.setData({
          cityList,
          cityLists:res.data.cityList
        })
      }
    })
  },
  // 选择门店
  selectStore(e){
    let cityValue  = this.data.citysNames
    const {cityname,hospitalSalePrice} = e.currentTarget.dataset
    let goodsId = this.data.goodsInfo.id
    if(cityname){
      this.data.cityLists.find(item =>{
        if(item.name == cityname){
          this.setData({
            cityId:item.id
          })
          wx.navigateTo({
            url: '/pages/store/store?city=' + item.id  + '&goodsId=' + goodsId,
          })
        }
      })
    }else{
      wx.showToast({ title: '请先选择城市', icon: 'none', duration: 2000 })
    }
  },
  // 根据商品编号获取商品详情
  getGoodsDetails(goodsId) {
    this.setData({
      goodsId
    })
    http("get", `/Goods/infoById/${goodsId}`,).then(res => {
      if (res.code === 0) {
        const { goodsInfo } = res.data;
        if(goodsInfo.goodsDetailHtml){
          goodsInfo.goodsDetailHtml = goodsInfo.goodsDetailHtml.replace(/\<img/g, '<img style="width:100%;height:auto;display:block"')
        }
        this.setData({
          goodsInfo,
          goodsInfo: { ...goodsInfo, quantity: 1 }
        })
      }
    })
  },
  // 兼容小程序底部按钮遮挡问题
  isIphoneX() {
    let info = wx.getSystemInfoSync();
    if (/iPhone X/i.test(info.model) || /iPhone 11/i.test(info.model) || /iPhone 12/i.test(info.model)) {
      return true;
    } else {
      return false;
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  // 城市选择
  cityChoice : function (e) {
    this.setData({
      cityShow:true
    })
  },
  
  cityConfirms(e){
    const {cityid,cityname} = e.currentTarget.dataset
    this.setData({
      storeInfo:{},
      cityShow:false,
      cityIds:cityid ? cityid : this.data.cityLists[0].id,
      cityNames:cityname ? cityname : this.data.cityLists[0].name,
    })
  },
  // 城市选择 取消
  cityCancel: function (e) {
    this.setData({
      cityShow:false
    })
  },
  // 城市选择 弹出层
  onClose: function (params) {
    this.setData({
      cityShow:false
    })
  },
  
  // 购买数量
  handleNumChange(event) {
    const {
      goodsInfo
    } = this.data;
    const {  type , saleprice ,ismaterial} = event.currentTarget.dataset
    let  quantity = event.detail
    // type==1 判断是否为实物 如果是实物的话需要发货 总价计算的是销售价格x数量
    if(ismaterial==true){
      goodsInfo.quantity = quantity
      this.setData({
        goodsInfo
      })
      if(saleprice){
        this.setData({
          totalPrice: (saleprice * goodsInfo.quantity).toFixed(2),
          goodsInfo
        })
      }
    }else{
       // type==0是虚拟商品 总价计算的是门店价格x数量
      let hospitalSalePrice = this.data.storeInfo.hospitalSalePrice
      goodsInfo.salePrice = hospitalSalePrice
      goodsInfo.quantity = quantity
      this.setData({
        goodsInfo
      })
      if(hospitalSalePrice){
        this.setData({
          totalPrice: (hospitalSalePrice * goodsInfo.quantity).toFixed(2),
        })
      }else{
        wx.showToast({ title: '请选择门店在添加购买数量', icon: 'none', duration: 2000 })
      }
    }
  },
  // 没有选择门店不让它选择购买数量
  disabledNum(){
    wx.showToast({ title: '请先选择城市和门店', icon: 'none', duration: 2000 })
  },
  // 备注
  bindKeyInput: function (params) {
    let remarksValue = params.detail.value
    this.setData({
      remarksValue
    })
  },
  // 购买
  purchase(e){
    const {hospitalid,cityname,type,hospitalsaleprice,allmoney} = e.currentTarget.dataset
    const {goodsInfo} = this.data
    let token = wx.getStorageSync("token")
    if(!token){
      wx.showToast({ title: '请先登录', icon: 'none', duration: 2000 })
    }else{
      // 判断是否实物商品 false不是实物 false不需要发货
      if(goodsInfo.isMaterial===false){
        if(!cityname){
          wx.showToast({ title: '请选择城市', icon: 'none', duration: 2000 })
        }else if(!hospitalid){
          wx.showToast({ title: '请选择门店', icon: 'none', duration: 2000 })
        }else{
          goodsInfo.salePrice = hospitalsaleprice
          goodsInfo.allmoney = allmoney
          goodsInfo.hospitalid = hospitalid
          this.setData({
            goodsInfo
          })
          wx.navigateTo({
            // url: `/pages/confirmOrder/confirmOrder?goodsInfo=${JSON.stringify([goodsinfo])}`
            url: "/pages/confirmOrder/confirmOrder?goodsInfo=" + encodeURIComponent(JSON.stringify([goodsInfo])) + '&type=' + type +  '&allmoney=' + allmoney
          })
        }
      }else{
        goodsInfo.allmoney = allmoney
        goodsInfo.hospitalid = hospitalid
        this.setData({
          goodsInfo
        })
        wx.navigateTo({
          url: "/pages/confirmOrder/confirmOrder?goodsInfo=" + encodeURIComponent(JSON.stringify([goodsInfo])) + '&type=' + type +  '&allmoney=' + allmoney
        })
      }
      
    }
  }
})
