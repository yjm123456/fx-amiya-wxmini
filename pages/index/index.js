import http from '../../utils/http';

Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 轮播图
    carouselImage: [],
    projectArr:[
      {
        name:"水光补水",
        img:"/images/icon_1.png"
      },
      {
        name:"光子嫩肤",
        img:"/images/icon_2.png"
      },
      {
        name:"热玛吉",
        img:"/images/icon_3.png"
      },
      {
        name:"欧洲之星",
        img:"/images/icon_4.png"
      },
      {
        name:"玻尿酸",
        img:"/images/icon_5.png"
      },
      {
        name:"瘦脸瘦腿",
        img:"/images/icon_6.png"
      },
      {
        name:"注射除皱",
        img:"/images/icon_7.png"
      },
      {
        name:"整形手术",
        img:"/images/icon_8.png"
      }
    ],
    // 当前地址
    currentCity: '',
    pageNum:1,
    pageSize:10,
    nextPage:true,
    pageNums:1,
    pageSizes:10,
    // 通过城市获取医院列表
    hospitalList:[],
    // 切换城市model
    cityModel:false,
    cityList:[],
    // 热门选中id
    currentId:'',
    // 省份下面选中的id
    currentIds:'',
     // 授权
     controlAuth: false,
     // 授权手机号
     controlAuthPhone: false,
     //  获取热热门城市
     hosCityList:[],
      list: [],
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getCarouselImage()
    this.getLocation()
    this.getHospitalList()
    this.getCityList()
    this.getHotList()
    // http("post", `/Order/pay/f2702bb0b2dc4b7f944f05408f60980a`).then(res => {})
  },
  onShow(){
    // this.getLocationAuth();
    this.setData({
      controlAuthPhone: false
    })
    this.setData({
      nextPage:true,
      pageNum:1,
      pageSize:10,
      list:[]
    })
    this.getDiary()
  },
   // 日记
   getDiary(callback){
    const { pageNum, pageSize, nextPage } = this.data;
      if (!nextPage) return;
      const data = {
        pageNum, pageSize
      }
      http("get", `/BeautyDiary/list`, data).then(res => {
        if (res.code === 0) {
          let { list, totalCount } = res.data.beautyDiaryManages;
          this.setData({
            list: [...this.data.list, ...list],
          })
          callback && callback();
          this.data.pageNum++;
          if (this.data.list.length === totalCount) {
            this.setData({
              nextPage: false
            })
          }
        }
      })
    },
   // 授权位置
   getLocationAuth() {
    let ths = this;
    if (this.data.currentCity) return;
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.userLocation']) {
          // 请求用户权限:获取定位信息
          wx.authorize({
            scope: 'scope.userLocation',
            success() {
              ths.getLocation();
            },
            fail() {
              wx.showModal({
                content: '检测到您未打开地理位置权限，是否前往开启',
                cancelText: "手动定位",
                confirmText: "前往开启",
                success: (res) => {
                  if (res.cancel) {
                    //点击取消,默认隐藏弹框
                  } else {
                    //点击确定
                    wx.openSetting({
                      success: res => {
                        ths.getLocation()
                      }
                    })
                  }
                }
              })
            }
          })
        }
        else {
          ths.getLocation();
        }
      }
    });
  },
   // 获取经纬度
   getLocation() {
    wx.getLocation({
      type: 'wgs84',
      success: (res) => {
        const longitude = res.longitude
        const latitude = res.latitude
        this.loadCity(longitude, latitude)
      },
      fail: (err) => {
      },
    })
  },
  // 获取地区信息
  loadCity(longitude, latitude) {
    const data = {
      longitude,
      latitude
    }
    http("get", `/Location/city`, data).then(res => {
      if (res.code === 0) {
        const { city } = res.data;
        this.getHospitalList(city)
        this.setData({ currentCity: city });
        wx.setStorageSync('currentCity', city)
      }
    }).catch(err => {
      this.setData({ currentCity: "获取定位失败" });
    })
  },
  // 获取轮播图
  getCarouselImage(){
    http("get", `/CarouselImage/list`).then(res => {
      if (res.code === 0) {
        const { carouselImage } = res.data;
        this.setData({
          carouselImage
        })
      }
    })
  },
  // 项目介绍/项目分类
  projectClass(){
    wx.navigateTo({
      url: '/pages/shoppingMall/shoppingMall',
    })
  },
 
  // 根据所在城市获取医院列表
  getHospitalList(city){
    const {pageNums,pageSizes,currentCity} = this.data
    const data = {
      pageNum:pageNums,
      pageSize:pageSizes,
      city
    }
    http("get", `/HospitalInfo/getListHospital`, data).then(res => {
      if (res.code === 0) {
        const { list} = res.data.hospitalInfo;
        this.setData({
          hospitalList:list
        })
      }
    })
  },
  // 导航
  navAddress(e){
    const { latitude , longitude ,address} = e.currentTarget.dataset.item
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
  // 切换城市
  switchCity(){
    this.setData({
      cityModel:true,
      currentId:"",
      currentIds:""
    })
  },
  onCancel() {
    this.setData({
      cityModel:false,
    })
  },
  // 获取合作过的城市列表
  getCityList(){
    http("get", `/CooperativeHospitalCity/provinceAndCityList`).then(res => {
      if(res.code === 0){
        const {cityList} = res.data
        this.setData({
          cityList:cityList
        })
      }
    })
  },
   // 获取热门城市
   getHotList(){
    http("get", `/CooperativeHospitalCity/hotCity`).then(res => {
      if(res.code === 0){
        const {cityList} = res.data
        this.setData({
          hosCityList:cityList
        })
      }
    })
  },
  selectedCity(e){
    const {id,name} = e.currentTarget.dataset.item
    const { type } = e.currentTarget.dataset
    if(type==1){
      this.setData({
        currentId : id,
        currentCity:name,
        cityModel:false
      })
      this.getHospitalList(this.data.currentCity)
    }else{
      this.setData({
        currentIds : id,
        currentCity:name,
        cityModel:false
      })
      this.getHospitalList(this.data.currentCity)
    }
    
  },

  // 到店计划
  arrivalPlan(e){
    const {item} =  e.currentTarget.dataset
    http("get", `/User/iscustomer`).then(res => {
      if(res.code === 0){
        const {isCustomer } =res.data
        if(isCustomer==true){
          wx.navigateTo({
            url: '/pages/arrivalPlan/arrivalPlan?item=' +JSON.stringify(item),
          })
        }else{
          this.handleBindPhone();
        }
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
    },
  
    // 取消绑定手机号
    cancelBindPhone() {
      this.setData({
        controlAuthPhone: false
      })
    },
   
})