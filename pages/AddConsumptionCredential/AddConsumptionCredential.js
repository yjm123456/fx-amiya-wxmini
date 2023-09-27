// pages/AddConsumptionCredential/AddConsumptionCredential.js
import http from "./../../utils/http"
import {
    iscustomer
} from "./../../api/user";
Page({

    /**
     * 页面的初始数据
     */
    data: {
        name: '',
        customerName: "",
        toHospitalPhone: "",
        liveAnchorBaseId: "",
        consumeDate: "",
        payVoucherPicture1: "",
        payVoucherPicture2: "",
        payVoucherPicture3: "",
        payVoucherPicture4: "",
        payVoucherPicture5: "",
        fileList: [],
        fileList2: [],
        fileList3: [],
        fileList4: [],
        fileList5: [],
        radio: 0,
        display: false,
        minDate: new Date(2020, 0, 1).getTime(),
        currentDate: new Date().getTime(),
        baseLiveAnchorId: '',
        uploadFileUrlList: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        const {
            baseLiveAnchorId
        } = options;
        this.setData({
            baseLiveAnchorId
        })
    },
    onClose() {
        this.setData({
            display: false
        });
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
        
    },

    // 取消绑定手机号
    cancelBindPhone() {
        this.setData({
            controlAuthPhone: false
        })
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
    selectDate() {
        this.setData({
            display: true
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
        const {
            index
        } = event.detail
        console.log(index);
        const newList = [...this.data.uploadFileUrlList]
        const newFileList = [...this.data.fileList]
        newFileList.splice(index, 1)
        newList.splice(index, 1)
        this.setData({
            fileList: newFileList,
            uploadFileUrlList: newList,
        });
    },
    afterRead1(event) {
        const {
            file,
            index
        } = event.detail;
        self = this;
        var list = this.data.fileList;
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
                const newList = [...self.data.uploadFileUrlList];
                newList[index] = url
                self.setData({
                    uploadFileUrlList: newList
                });
            },
        });
    },

    uploadSomeMsg() {
        var that = this
        var adds = that.data.img_arr;
        for (let i = 0; i < this.data.img_arr.length; i += 1) {
            wx.uploadFile({
                url: 'https://app.ameiyes.com/fxopenoss/aliyunoss/uploadone', //仅为示例，非真实的接口地址
                filePath: that.data.img_arr[i],
                name: 'content',
                formData: {
                    'user': adds
                },
                success: function (res) {
                    console.log(res, "上传图片啦")
                    if (res) {
                        wx.showToast({
                            title: '已提交发布！',
                            duration: 500
                        });
                    }
                }
            })
        }
    },

    //从本地获取照片 
    getLocalityImg() {
        let that = this;
        if (this.data.img_arr.length < 5) {
            wx.chooseMedia({
                count: 5 - that.data.img_arr.length, //上传图片的数量 当之前上传了部分图片时 ,总数 - 已上传数 = 剩余数   (限制上传的数量)
                sizeType: ['original', 'compressed'], //可以指定原图或压缩图,默认二者都有
                sourceType: ['album', 'camera'], //指定图片来源是相机还是相册,默认二者都有
                success(res) {
                    console.log(res, "---------上传的图片")

                    const tempFiles = res.tempFiles //包含图片大小的数组

                    let answer = tempFiles.every(item => { //限制上传图片大小为2M,所有图片少于2M才能上传
                        return item.size <= 2000000
                    })

                    if (answer) {
                        that.setData({
                            img_arr: that.data.img_arr.concat(res.tempFilePaths),
                        })
                    } else {
                        wx.showToast({
                            title: '上传图片不能大于2M!',
                            icon: 'none'
                        })
                    }

                }
            })

        } else {
            wx.showToast({ //超过图片张数限制提示
                title: '最多上传五张图片',
                icon: 'none',
                duration: 2000
            })

        }
    },

    //删除照片功能与预览照片功能 
    deleteImg(e) {
        let that = this;
        let img_arr = that.data.img_arr;
        let index = e.currentTarget.dataset.index; //获取长按删除图片的index
        wx.showModal({
            title: '提示',
            content: '确定要删除此图片吗？',
            success(res) {
                if (res.confirm) {
                    // console.log('点击确定了');
                    img_arr.splice(index, 1);
                } else if (res.cancel) {
                    // console.log('点击取消了');
                    return false;
                }
                that.setData({
                    img_arr: img_arr
                });
            }
        })
    },

    //预览图片
    previewImg(e) {
        let index = e.currentTarget.dataset.index;
        let img_arr = this.data.img_arr;
        wx.previewImage({
            current: img_arr[index],
            urls: img_arr
        })
    },

    authorizeNotice(){
        this.isCustomer((isCustomer) => {
            if (isCustomer) {
                this.authorizeNotice2();
            } else {
                this.handleBindPhone();
            }
        })
    },
    
    authorizeNotice2() {
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

                this.CustomerConsumptionCredentials();
            },
            fail: err => {

                this.CustomerConsumptionCredentials();
            },
        })
    },
    CustomerConsumptionCredentials() {
        let payVoucherPicture1 = "";
        let payVoucherPicture2 = "";
        let payVoucherPicture3 = "";
        let payVoucherPicture4 = "";
        let payVoucherPicture5 = "";
        for (let index = 0; index < this.data.uploadFileUrlList.length; index++) {
            let cur = index + 1;
            if (cur === 1) {
                payVoucherPicture1 = this.data.uploadFileUrlList[index]
            }
            if (cur === 2) {
                payVoucherPicture2 = this.data.uploadFileUrlList[index]
            }
            if (cur === 3) {
                payVoucherPicture3 = this.data.uploadFileUrlList[index]
            }
            if (cur === 4) {
                payVoucherPicture4 = this.data.uploadFileUrlList[index]
            }
            if (cur === 5) {
                payVoucherPicture5 = this.data.uploadFileUrlList[index]
            }
        }
        const data = {
            customerName: this.data.customerName,
            toHospitalPhone: this.data.toHospitalPhone,
            consumeDate: this.data.consumeDate,
            baseLiveAnchorId: this.data.baseLiveAnchorId,
            payVoucherPicture1: payVoucherPicture1,
            payVoucherPicture2: payVoucherPicture2,
            payVoucherPicture3: payVoucherPicture3,
            payVoucherPicture4: payVoucherPicture4,
            payVoucherPicture5: payVoucherPicture5
        }
        if (!data.customerName) {
            wx.showToast({
                title: '请输入姓名',
                icon: 'none'
            })
            return;
        }
        if (!data.toHospitalPhone) {
            wx.showToast({
                title: '请输入到院手机号',
                icon: 'none'
            })
            return;
        }
        if (!data.consumeDate) {
            wx.showToast({
                title: '请输入实际消费时间',
                icon: 'none'
            })
            return;
        }
        http("post", `/customerConsumptionCredentials`, data).then(res => {
            if (res.code === 0) {
                wx.showToast({
                    title: '凭证已经上传成功了,稍等一会,好礼很快就到!',
                    icon: 'none',
                    duration: 2000
                });
                setTimeout(function () {
                    var pages = getCurrentPages(); //当前页面
                    var prevPage = pages[pages.length - 2]; //上一页面
                    prevPage.setData({
                        isQRcodeRedirect:false
                    })
                    
                    wx.navigateBack({
                        delta: 1
                    });
                }, 2000);
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