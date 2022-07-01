import area from "./../../jsonData/area";
import http from './../../utils/http';
Page({
  data: {
    // 地区列表
    areaList: area,

    // 控制省市区
    controlArea: false,

    // 省
    province: "",
    provinceCode: "",

    // 市
    city: "",
    cityCode: "",

    // 区
    district: "",
    districtCode: "",

    // 详细地址
    other: "",

    // 收货人姓名
    contact: "",

    // 电话
    phone: "",

    // 默认地址
    isDefault: false,

    // 修改
    id: "",

    // 选择地址
    selectAddress: false,

    // 添加完毕直接跳转到这个页面
    path: ""
  },

  onLoad: function (params) {
    if (params.item) {
      const address = JSON.parse(params.item);
      const { id, contact, phone, province, provinceCode, city, cityCode, district, districtCode, other, isDefault } = address;
      this.setData({
        id,
        contact,
        phone,
        province,
        provinceCode,
        city,
        cityCode,
        district,
        districtCode,
        other,
        isDefault
      })
    }
    // 选择地址
    if (params.selectAddress && params.path) {
      this.setData({
        selectAddress: params.selectAddress,
        path: params.path,
      })
    }
  },

  // 操作地区
  handleSelectArea() {
    this.setData({
      controlArea: true
    })
  },

  cancel() {
    this.setData({
      controlArea: false
    })
  },

  confirm(arr) {
    /**
     * province, 省
     * city, 市
     * district 区
     */
    const [provinceObj, cityObj, districtObj] = arr.detail.values;
    // 省
    const province = provinceObj.name;
    const provinceCode = provinceObj.code;
    // 市
    const city = cityObj.name;
    const cityCode = cityObj.code;
    // 区
    const district = districtObj.name;
    const districtCode = districtObj.code;
    this.setData({
      province,
      provinceCode,
      city,
      cityCode,
      district,
      districtCode,
      controlArea: false
    })
  },

  handleContactChange({ detail }) {
    this.setData({
      contact: detail
    })
  },

  handlePhoneChange({ detail }) {
    this.setData({
      phone: detail
    })
  },

  handleOtherChange({ detail }) {
    this.setData({
      other: detail
    })
  },

  handleIsDefaultChange({ detail }) {
    this.setData({
      isDefault: detail
    })
  },

  // 保存
  submit() {
    const regPhone = /^1\d{10}$/;
    const { id, province, provinceCode, city, cityCode, district, districtCode, other, contact, phone, isDefault } = this.data;
    const data = {
      id,
      province,
      provinceCode,
      city,
      cityCode,
      district,
      districtCode,
      other,
      contact,
      phone,
      isDefault
    }
    if (!contact) {
      wx.showToast({ title: '请填写收货人', icon: 'none', duration: 2000 });
      return;
    } else if (!phone) {
      wx.showToast({ title: '请填写手机号', icon: 'none', duration: 2000 });
      return;
    } else if (phone && !regPhone.test(phone)) {
      wx.showToast({ title: '请填写正确手机号', icon: 'none', duration: 2000 });
      return;
    } else if (!province && !city && !district) {
      wx.showToast({ title: '请选择所在地区', icon: 'none', duration: 2000 });
      return;
    } else if (!other) {
      wx.showToast({ title: '请填写详细地址', icon: 'none', duration: 2000 });
      return;
    }
    // 获取页面栈
    const pages = getCurrentPages();
    // 添加
    if (!id) {
      delete data.id;
      http("post", `/address`, data).then(res => {
        if (res.code === 0) {
          /**
           * 如果是选择地址
           */
          if (this.data.selectAddress) {
            let delta = 0;
            let prePage = null;
            for (let i = pages.length - 1; i >= 0; i--) {
              if (pages[i].route === this.data.path) {
                prePage = pages[i];
                break;
              }
              delta += 1;
            }
            prePage.setData({
              address: { ...data, id: res.data.addressId }
            })
            wx.navigateBack({
              delta
            })
            return
          }

          /**
           * 正常添加地址
           */
          // 上一个页面实例对象
          const prePage = pages[pages.length - 2];
          // 调用上一个页面的getAddressList方法
          prePage.getAddressList()
          wx.navigateBack({
            delta: 1
          })
        }
      })
      return;
    }
    // 修改
    if (id) {
      http("put", `/address`, data).then(res => {
        if (res.code === 0) {
          // 上一个页面实例对象
          const prePage = pages[pages.length - 2];
          // 调用上一个页面的getAddressList方法
          prePage.getAddressList()
          wx.navigateBack({
            delta: 1
          })
        }
      })
    }
  }
})