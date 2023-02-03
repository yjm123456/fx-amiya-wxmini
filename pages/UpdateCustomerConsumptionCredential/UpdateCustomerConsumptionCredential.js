// pages/AddConsumptionCredential/AddConsumptionCredential.js
import http from "./../../utils/http"
Page({

    /**
     * 页面的初始数据
     */
    data: {
        id:"",
        customerName: "",
        toHospitalPhone: "",
        liveAnchorBaseId: "",
        consumeDate: "",
        payVoucherPicture1: "",
        payVoucherPicture2: "",
        payVoucherPicture3: "",
        payVoucherPicture4: "",
        payVoucherPicture5: "",
        fileList:[],
        fileList2:[],
        fileList3:[],
        fileList4:[],
        fileList5:[],
        radio:0,
        display:false,
        minDate: new Date(2020,0,1).getTime(),
        currentDate:new Date().getTime()
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        
        const {id}=options;
        this.CustomerConsumptionCredentials(id);
    },
    onClose() {
        this.setData({
            display: false
        });
    },
    
    formatDate(date) {
        date = new Date(date);
        var month = (date.getMonth() + 1) >= 10 ? (date.getMonth() + 1) : '0' + (date.getMonth() + 1);
        var day = (date.getDate()) >= 10 ? (date.getDate()) : '0' + (date.getDate())
        return `${date.getFullYear()}-${month}-${day}`;
    },
    onConfirm(event) {
        this.setData({
            display: false,
            consumeDate: this.formatDate(event.detail),
        });
    },
    authorizeNotice() {
        var app = getApp();
        const tmplIds = app.globalData.tmplIds;
        wx.requestSubscribeMessage({
            tmplIds: tmplIds,
            success: res => {
                tmplIds.forEach(item => {
                    if (res[item] === 'reject') {
                        wx.showToast({
                            title: '此次操作会导致您接收不到通知',
                            icon: 'none',
                            duration: 2000,
                        })
                    }
                })
                console.log("授权成功");
                this.updateConsumptionCredentials();
            },
            fail: err => {
                console.log("授权失败");
                this.updateConsumptionCredentials();
            },
        })
    },
    selectDate(){
        this.setData({
            display:true
        });
    },
    onNameChange(event) {
        this.setData({
            customerName: event.detail
        });
    },
    onPhoneChange(event) {
        this.setData({
            toHospitalPhone: event.detail
        });
    },
    onConsumptionDateChange(event) {
        this.setData({
            consumeDate: event.detail
        });
    },
    onRecommendChange(event) {
        const radio = event.detail;
        if (radio == 1) {
            this.setData({
                liveAnchorBaseId: "a5d4f584-f412-4e39-af5b-76c903668ac0",
                radio
            });
        } else if (radio == 2) {
            this.setData({
                liveAnchorBaseId: "44b0e329-fe66-4690-9a50-1873822fa54d",
                radio
            });
        }

    },
    delete1(event) {
        this.setData({
          fileList: [],
          payVoucherPicture1: ""
        });
      },
      delete2(event) {
        this.setData({
          fileList2: [],
          payVoucherPicture2: ""
        });
      },
      delete3(event) {
        this.setData({
          fileList3: [],
          payVoucherPicture3: ""
        });
      },
      delete4(event) {
        this.setData({
          fileList4: [],
          payVoucherPicture4: ""
        });
      },
      delete5(event) {
        this.setData({
          fileList5: [],
          payVoucherPicture5: ""
        });
      },
      afterRead1(event) {
        const {
          file
        } = event.detail;
        self = this;
        var list = [];
        list.push({
          url: file.path,
          deletable: true
        });
        this.setData({
          fileList: list
        });
        // 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
        wx.uploadFile({
          url: 'https://app.ameiyes.com/fxopenoss/aliyunoss/uploadone', // 仅为示例，非真实的接口地址
          filePath: file.path,
          name: 'uploadfile',
          success(res) {
            var url = JSON.parse(res.data).data.url
            self.setData({
              payVoucherPicture1: url
            });
          },
        });
      },
      afterRead2(event) {
        const {
          file
        } = event.detail;
        self = this;
        var list = [];
        list.push({
          url: file.path,
          deletable: true
        });
        this.setData({
          fileList2: list
        });
        // 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
        wx.uploadFile({
          url: 'https://app.ameiyes.com/fxopenoss/aliyunoss/uploadone', // 仅为示例，非真实的接口地址
          filePath: file.path,
          name: 'uploadfile',
          success(res) {
            var url = JSON.parse(res.data).data.url
            self.setData({
              payVoucherPicture2: url
            });
          },
        });
      },
      afterRead3(event) {
        const {
          file
        } = event.detail;
        self = this;
        var list = [];
        list.push({
          url: file.path,
          deletable: true
        });
        this.setData({
          fileList3: list
        });
        // 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
        wx.uploadFile({
          url: 'https://app.ameiyes.com/fxopenoss/aliyunoss/uploadone', // 仅为示例，非真实的接口地址
          filePath: file.path,
          name: 'uploadfile',
          success(res) {
            var url = JSON.parse(res.data).data.url
            self.setData({
              payVoucherPicture3: url
            });
          },
        });
      },
      afterRead4(event) {
        const {
          file
        } = event.detail;
        self = this;
        var list = [];
        list.push({
          url: file.path,
          deletable: true
        });
        this.setData({
          fileList4: list
        });
        // 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
        wx.uploadFile({
          url: 'https://app.ameiyes.com/fxopenoss/aliyunoss/uploadone', // 仅为示例，非真实的接口地址
          filePath: file.path,
          name: 'uploadfile',
          success(res) {
            var url = JSON.parse(res.data).data.url
            self.setData({
              payVoucherPicture4: url
            });
          },
        });
      },
      afterRead5(event) {
        const {
          file
        } = event.detail;
        self = this;
        var list = [];
        list.push({
          url: file.path,
          deletable: true
        });
        this.setData({
          fileList5: list
        });
        // 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
        wx.uploadFile({
          url: 'https://app.ameiyes.com/fxopenoss/aliyunoss/uploadone', // 仅为示例，非真实的接口地址
          filePath: file.path,
          name: 'uploadfile',
          success(res) {
            var url = JSON.parse(res.data).data.url
            self.setData({
              payVoucherPicture5: url
            });
          },
        });
      },
    updateConsumptionCredentials() {
        const data={
            id:this.data.id,
            customerName: this.data.customerName,
            toHospitalPhone: this.data.toHospitalPhone,
            liveAnchorBaseId: this.data.liveAnchorBaseId,
            consumeDate: this.data.consumeDate,
            payVoucherPicture1: this.data.payVoucherPicture1,
            payVoucherPicture2: this.data.payVoucherPicture2,
            payVoucherPicture3: this.data.payVoucherPicture3,
            payVoucherPicture4: this.data.payVoucherPicture4,
            payVoucherPicture5: this.data.payVoucherPicture5
        }
        if(!data.customerName){
            console.log("调用");
            wx.showToast({
              title: '请输入姓名',
              icon:'none'
            })
            return;
        }
        if(!data.toHospitalPhone){
            wx.showToast({
              title: '请输入到院手机号',
              icon:'none'
            })
            return;
        }
        if(!data.consumeDate){
            wx.showToast({
              title: '请输入实际消费时间',
              icon:'none'
            })
            return;
        }
        http("put", `/customerConsumptionCredentials`,data).then(res => {
            if (res.code === 0) {
                //this.CustomerConsumptionCredentials(id);
                wx.showToast({
                    title: '提交成功',
                    icon:'none',
                    duration:500
                  });
                  setTimeout(function () {
                    wx.navigateBack({
                        delta: 1
                      });
                  }, 500);
            }
        })
    },
    CustomerConsumptionCredentials(id) {
        http("get", `/customerConsumptionCredentials/byId/`+id).then(res => {
            if (res.code === 0) {
                const result= res.data.cCustomerConsumptionCredentialsInfo;
                var list1=[];
                if(result.payVoucherPicture1){
                    list1.push({url:result.payVoucherPicture1,deletable: true});
                }
                
                var list2=[];
                if(result.payVoucherPicture2){
                    list2.push({url:result.payVoucherPicture2,deletable: true});
                }
                var list3=[];
                if(result.payVoucherPicture3){
                    list3.push({url:result.payVoucherPicture3,deletable: true});
                }
                var list4=[];
                if(result.payVoucherPicture4){
                    list4.push({url:result.payVoucherPicture4,deletable: true});
                }

                var list5=[];
                if(result.payVoucherPicture5){
                    list5.push({url:result.payVoucherPicture5,deletable: true});
                }
                
                this.setData({
                    id:result.id,
                    customerName:result.customerName,
                    toHospitalPhone:result.toHospitalPhone,
                    liveAnchorBaseId:result.liveAnchorBaseId,
                    consumeDate:result.consumeDate.split("T")[0],
                    payVoucherPicture1:result.payVoucherPicture1,
                    payVoucherPicture2:result.payVoucherPicture2,
                    payVoucherPicture3:result.payVoucherPicture3,
                    payVoucherPicture4:result.payVoucherPicture4,
                    payVoucherPicture5:result.payVoucherPicture5,
                    fileList:list1,
                    fileList2:list2,
                    fileList3:list3,
                    fileList4:list4,
                    fileList5:list5,
                });
                if(result.liveAnchorBaseId=="a5d4f584-f412-4e39-af5b-76c903668ac0"){
                    this.setData({radio:"1"})
                }
                if(result.liveAnchorBaseId=="44b0e329-fe66-4690-9a50-1873822fa54d"){
                    this.setData({radio:"2"})
                }
            }
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

    }
})