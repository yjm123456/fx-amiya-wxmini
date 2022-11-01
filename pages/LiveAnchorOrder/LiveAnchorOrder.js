// pages/LiveAnchorDetail/LiveAnchorOrder/LiveAnchorOrder.js
import http from '../../utils/http';
Page({

    /**
     * 页面的初始数据
     */
    data: {
        nickName: '',
        phone: '',
        liveAnchorName: '',
        type: '',
        appointmentCity: '',
        appointmentHospital:'',
        appointmentDate: '',
        currentCity: '',
        cityModel: false,
        currentId: '',
        currentIds: '',
        cityList: [],
        cityid:'',
        hosCityList:[],
        selectHospitalId:'',
        selectCityHospital:[],
        openHospital:[
          {id:1,hospital:[{
            id:187,
            name:'北京丽合医疗美容医院',
            address:'北京市朝阳区将台路18号',
            phone:'16676767676677',
            thumbPicUrl: "https://ameiya.oss-cn-hangzhou.aliyuncs.com/15ef2da69ab5408b894c4bb7171948ce.jpg"
        }]},
          {id:11,hospital:[
            {
                id:17,
                name:'上海伊莱美医疗美容医院',
                address:'上海市静安区梅园路88号',
                phone:'4009001591',
                thumbPicUrl: "https://ameiya.oss-cn-hangzhou.aliyuncs.com/aeebc2d8c8144892896b78b516e25316.jpg"
            }
          ]},
        {id:14,hospital:[
            {
                id:37,
                name:'杭州维多利亚医疗美容医院',
                address:'浙江省杭州市下城区建国北路658号',
                phone:'4009001591',
                thumbPicUrl: "https://ameiya.oss-cn-hangzhou.aliyuncs.com/97ca0a45638d46208ff18f85e340f4c1.jpg"
            },
            {
                id:16,
                name:'杭州连天美医疗美容医院',
                address:'杭州市上城区秋涛路248号秋涛发展B座',
                phone:'4009001591',
                thumbPicUrl: "https://ameiya.oss-cn-hangzhou.aliyuncs.com/f6a73ec7de5548f7b86ca5801353d477.jpg"
            },
        ]},
        {id:15,hospital:[
            {
                id:185,
                name:'南京美莱医疗美容',
                address:'江苏省南京市鼓楼区广州路188号',
                phone:'16710559539',
                thumbPicUrl: "https://ameiya.oss-cn-hangzhou.aliyuncs.com/14f9226de1f44c37975daff307926a64.png"
            }
        ]},
        {id:16,hospital:[
            {
                id:24,
                name:'武汉美基元医疗美容医院',
                address:'湖北省武汉市江岸区解放大道1340号-10号',
                phone:'16676767676677',
                thumbPicUrl: "https://ameiya.oss-cn-hangzhou.aliyuncs.com/dbbf41e74e4940dab144ea2aa6387eb9.jpg"
            },
            {
                id:189,
                name:'武汉顶吉医疗美容医院',
                address:'湖北省武汉市江汉区新湾路9号',
                phone:'16676767676677',
                thumbPicUrl: "https://ameiya.oss-cn-hangzhou.aliyuncs.com/9c1de9f95ecb4b38b9abd85a0e03be44.jpeg"
            }
        ]},
        {id:45,hospital:[
            {
                id:140,
                name:'西安米兰柏羽医疗美容医院',
                address:'西安市莲湖区桃园南路21号',
                phone:'16676767676677',
                thumbPicUrl: "https://ameiya.oss-cn-hangzhou.aliyuncs.com/7afb6fba94ae4aa5b144949196bba3b7.png"
            }
        ]}
        ],
        shopGoodsInfo:{},
        display: false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        const {
            name,
            type
        } = options

        //商品化修改
        // const goodsInfo = options.goodsInfo;
        // this.setData({
        //     shopGoodsInfo:goodsInfo
        // });

        //商品化修改


        this.setData({
            liveAnchorName: name,
            type
        });
        this.getUserInfo();
        //this.getLocationAuth();
        this.getCityList()
        this.getHotList()
    },
    selectDate() {
        this.setData({
            display: true
        });
    },
    onClose() {
        this.setData({
            display: false
        });
    },
    selectHospital(event){
        const {name,hospitalid}=event.currentTarget.dataset;
        console.log(hospitalid,name);
        this.setData({
            selectHospitalId:hospitalid,
            appointmentHospital:name
        })
    },
    formatDate(date) {
        date = new Date(date);
        var month=(date.getMonth() + 1)>=10?(date.getMonth() + 1):'0'+(date.getMonth() + 1);
        var day=(date.getDate())>=10?(date.getDate()):'0'+(date.getDate())
        return `${date.getFullYear()}-${month}-${day}`;
    },
    onConfirm(event) {
        this.setData({
            display: false,
            appointmentDate: this.formatDate(event.detail),
        });
    },
    getUserInfo() {
        http("get", "/User/info").then(res => {
            if (res.code === 0) {
                const {
                    phone,
                    nickName
                } = res.data.userInfo;
                this.setData({
                    phone: phone,
                    nickName: nickName
                })
            }
        });
    },
    // 获取合作过的城市列表
    getCityList() {
        // http("get", `/CooperativeHospitalCity/provinceAndCityList`).then(res => {
        //     if (res.code === 0) {
        //         const {openCity}=this.data;
        //         const {
        //             cityList
                    
        //         } = res.data
        //         for(var item in cityList){
        //             if(item.city){}
        //         }
        //         var newCityList=[];
        //         for (let index = 0; index < cityList.length; index++) {
        //             const element = cityList[index];
        //             for (let index1 = 0; index1 < openCity.length; index1++) {
        //                 var city=openCity[index1];
        //                 var name=element.city.name;
                       
        //                 console.log(name==undefined);
        //                 if(name==undefined){
        //                     name='未知'
        //                 }
        //                 console.log("名称"+name);
        //                 if(name.indexOf(city)){
        //                     newCityList.push(element);
        //                 }                    
        //             }
        //         }
                
        //         this.setData({
        //             cityList: newCityList
        //         })
                
        //     }
        // })
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
    getHotList() {
        // http("get", `/CooperativeHospitalCity/hotCity`).then(res => {
        //     if (res.code === 0) {
        //         const {
        //             cityList
        //         } = res.data
                
        //         this.setData({
        //             hosCityList: cityList
        //         })
        //     }
        // })
        var cityList=
        [{id:1,name:'北京'},{id:11,name:'上海'},{id:14,name:'杭州'},{id:15,name:'南京'},{id:16,name:'武汉'},{id:45,name:'西安'}]
        this.setData({
            hosCityList: cityList
        })
    },
    selectedCity(event) {
        console.log("选择");
        let selecthospital=[];
        const{openHospital}=this.data;      
        const{cityid,item}=event.currentTarget.dataset
        for (let index = 0; index < openHospital.length; index++) {
            const element = openHospital[index];
            if(element.id==cityid){
                selecthospital=element.hospital;
                break;
            }
        }
        this.setData({
            appointmentCity:item,
            cityModel:false,
            cityid,
            selectCityHospital:selecthospital
        })
        
        // const {
        //     id,
        //     name
        // } = e.currentTarget.dataset.item
        // const {
        //     type
        // } = e.currentTarget.dataset
        // if (type == 1) {
        //     this.setData({
        //         currentId: id,
        //         appointmentCity: name,
        //         currentCity: name,
        //         cityModel: false
        //     })
        //     this.getHospitalList(this.data.currentCity)
        // } else {
        //     this.setData({
        //         currentIds: id,
        //         currentCity: name,
        //         appointmentCity: name,
        //         cityModel: false
        //     })
        //     //this.getHospitalList(this.data.currentCity)
        // }

    },
    switchCity() {
        this.setData({
            cityModel: true,
            currentId: "",
            currentIds: ""
        })
    },
    onCancel() {
        this.setData({
            cityModel: false,
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
                } else {
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
            fail: (err) => {},
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
                const {cityList}=this.data
                const {
                    city
                } = res.data;
                for (let index1 = 0; index1 < cityList.length; index1++) {
                    var city1=cityList[index1];
                    console.log(city1);
                    console.log(city);
                    if(city.indexOf(city1)){
                        this.setData({
                            appointmentCity: city
                        });
                    }                    
                }
                
            }
        }).catch(err => {
            this.setData({
                currentCity: "获取定位失败"
            });
        })
    },
    handleNameChange(e) {
        const {
            detail
        } = e;
        this.setData({
            nickName: detail
        })
    },
    handlePhoneChange(e) {
        const {
            detail
        } = e;
        this.setData({
            phone: detail
        })
    },
    purchase() {
        const {
            nickName,
            phone,
            liveAnchorName,
            type,
            appointmentCity,
            appointmentDate,
            selectHospitalId,
            shopGoodsInfo
        } = this.data
        let token = wx.getStorageSync("token")
        if (!token) {
            wx.showToast({
                title: '请先登录',
                icon: 'none',
                duration: 2000
            })
        } else {
            if (!nickName) {
                wx.showToast({
                    title: '请输入姓名',
                    icon: 'none',
                    duration: 1000
                })
                return;
            }
            if (!phone) {
                wx.showToast({
                    title: '请输入手机号',
                    icon: 'none',
                    duration: 1000
                })
                return;
            }
            if (type == 'mf') {
                if (!appointmentCity) {
                    wx.showToast({
                        title: '请选择预约城市',
                        icon: 'none',
                        duration: 1000
                    })
                    return;
                }
                if (!appointmentDate) {
                    wx.showToast({
                        title: '请选择预约时间',
                        icon: 'none',
                        duration: 1000
                    })
                    return;
                }
                if(!selectHospitalId){
                    wx.showToast({
                        title: '请选择预约医院',
                        icon: 'none',
                        duration: 1000
                    })
                    return;
                }
            }
            if (!(/^1[34578]\d{9}$/.test(phone))) {
                wx.showToast({
                    title: '手机号错误,请重新输入',
                    icon: 'none',
                    duration: 1000
                })
                return;
            } else {
                let cardName = '啊美雅面诊卡'
                let thumbPicUrl = 'https://ameiya.oss-cn-hangzhou.aliyuncs.com/4b7148dcacb346c99a146804267f6e07.jpg';
                if (liveAnchorName == 'dd') {
                    cardName = cardName + '-刀刀'
                    thumbPicUrl = "https://ameiya.oss-cn-hangzhou.aliyuncs.com/19542824f5bb44a994cb6b300916e336.jpg";
                } else if (liveAnchorName == 'jn') {
                    cardName = cardName + '-吉娜'
                    thumbPicUrl = "https://ameiya.oss-cn-hangzhou.aliyuncs.com/19542824f5bb44a994cb6b300916e336.jpg";
                }
                
                if (type == 'mf') {
                    cardName = '定制美肤券'
                    if (liveAnchorName == 'dd') {
                        cardName = cardName + '-刀刀'
                        thumbPicUrl = 'https://ameiya.oss-cn-hangzhou.aliyuncs.com/1318bb0b9f6f43bb8f8f339f6e162443.jpg';
                    } else if (liveAnchorName == 'jn') {
                        cardName = cardName + '-吉娜'
                        thumbPicUrl = 'https://ameiya.oss-cn-hangzhou.aliyuncs.com/e4d4ceb4532346bfa246ba072d46c0aa.jpg';
                    }
                }
                

                let goodsInfo = {
                    thumbPicUrl: thumbPicUrl,
                    allmoney: 199,
                    cardName: cardName,
                    quantity: 1,
                    salePrice: 199,
                    id: '00000000',
                    name: cardName,
                    appointmentCity: '',
                    appointmentDate: ''
                };
                let allmoney = 199;
                if (type == 'mf') {
                    goodsInfo = {
                        thumbPicUrl: thumbPicUrl,
                        allmoney: 4999,                      
                        cardName: cardName,
                        quantity: 1,
                        salePrice: 4999,
                        id: '00000000',
                        name: cardName,
                        appointmentCity: appointmentCity,
                        appointmentDate: appointmentDate,
                        hospitalid:selectHospitalId,
                        isSkinCare:true
                    };
                    allmoney = 4999;
                }
                
                //商品化修改

                //goodsInfo=shopGoodsInfo;

                //商品化修改


                wx.redirectTo({
                    url: '/pages/confirmOrder/confirmOrder?nickName=' + nickName + '&phone=' + phone + '&isCard=true&goodsInfo=' + encodeURIComponent(JSON.stringify([goodsInfo])) + '&cardName=' + cardName + '&thumbPicUrl='+thumbPicUrl+'&allmoney=' + allmoney,
                })

                //商品化修改
                // wx.redirectTo({
                //     url: '/pages/confirmOrder/confirmOrder?nickName=' + nickName + '&phone=' + phone + '&isCard=true&goodsInfo=' + goodsInfo + '&cardName=' + cardName + '&thumbPicUrl='+thumbPicUrl+'&allmoney=' + allmoney,
                // })
                //商品化修改
            }
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