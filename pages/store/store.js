// pages/store/store.js
import http from '../../utils/http.js';
Page({
  /**
   * 页面的初始数据
   */
  data: {
    radioArr: [
      {
        radio:1,
        title:'上海薇琳医疗美容医院1',
        price:123312,
        time:'2021-07-01',
        address:'浙江省杭州市滨江1111111111',
        phone:'13666666666'
      },
      {
        radio:2,
        title:'上海薇琳医疗美容医院2',
        price:6666,
        time:'2021-07-01',
        address:'浙江省杭州市滨江2222222222',
        phone:'13666666666'
      },
      {
        radio:3,
        title:'上海薇琳医疗美容医院3',
        price:7777,
        time:'2021-07-01',
        address:'浙江省杭州市滨江',
        phone:'13666666666'
      },
      {
        radio:4,
        title:'上海薇琳医疗美容医院1',
        price:123312,
        time:'2021-07-01',
        address:'浙江省杭州市滨江1111111111',
        phone:'13666666666'
      },
      {
        radio:5,
        title:'上海薇琳医疗美容医院2',
        price:6666,
        time:'2021-07-01',
        address:'浙江省杭州市滨江2222222222',
        phone:'13666666666'
      },
      {
        radio:6,
        title:'上海薇琳医疗美容医院3',
        price:7777,
        time:'2021-07-01',
        address:'浙江省杭州市滨江',
        phone:'13666666666'
      },
    ],
    // 门店列表
    hospitalInfoList: [],

    radio:0,

    // 选中门店
    storeInfo:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let goodsId = options.goodsId
    let city = options.city
    this.getStoreList(goodsId,city)
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  // 获取门店列表
  getStoreList(goodsId,city){
    const data = {
      goodsId,
      city
    }
    http("get", `/HospitalInfo/GoodsOfflineDoor`,data).then(res => {
      if(res.code === 0){
        const { hospitalInfoList } = res.data
        this.setData({
          hospitalInfoList
        })
      }else{
        wx.showToast({ title: res.msg, icon: 'none', duration: 2000 })
      }
    })
  },
  // 选择门店
  onChange(params) {
    let radio = params.detail
    const {storeinfo} = params.currentTarget.dataset
    this.setData({
      radio : radio,
      storeInfo:storeinfo
    })
  },
  // 导航
  navAddress(e){
    const { latitude , longitude ,address} = e.currentTarget.dataset.storeinfo
    wx.getLocation({
      type:'wgs84', 
      success: function (res) {
        wx.openLocation({
          latitude: latitude, // 纬度，范围为-90~90，负数表示南纬
          longitude: longitude, // 经度，范围为-180~180，负数表示西经
          scale: 8, // 缩放比例
          address:address,
        })
      }
    })
  },
  // 拨打
  phone(e){
    const {phone} = e.currentTarget.dataset.storeinfo
    wx.makePhoneCall({
      phoneNumber: phone 
    })
  },
  // 确定选择门店
  storeSubmit(){
    var pages = getCurrentPages();   //当前页面
    var prevPage = pages[pages.length - 2];   //上一页面
    prevPage.setData({
          //直接给上一个页面赋值
          storeInfo: this.data.storeInfo
    });
    wx.navigateBack({
        //返回
        delta: 1
    })
  }
})




