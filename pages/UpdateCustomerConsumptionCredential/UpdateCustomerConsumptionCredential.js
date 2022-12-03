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
        radio:0,
        display:false
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
    afterRead1(event) {
        console.log(event.detail);
        const {
            file
        } = event.detail;
        // 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
        wx.uploadFile({
            url: 'https://app.ameiyes.com/fxopenoss/aliyunoss/uploadone', // 仅为示例，非真实的接口地址
            filePath: file.path,
            name: 'file',
            formData: {
                'file': file.path
            },
            success(res) {
                console.log("成功");
                var fileList = [];
                fileList.push(res.data.url);
                this.setData({
                    payVoucherPicture1: fileList
                });
            },
            fail(res) {
                console.log("shibai");
                console.log(res);
            }
        });
    },
    afterRead2(event) {
        const {
            file
        } = event.detail;
        // 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
        wx.uploadFile({
            url: 'https://app.ameiyes.com/fxopenoss/aliyunoss/uploadone', // 仅为示例，非真实的接口地址
            filePath: file.url,
            name: 'file',
            formData: {
                user: 'test'
            },
            success(res) {
                this.setData({
                    payVoucherPicture2: res.data.url
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
        }
        http("put", `/customerConsumptionCredentials`,data).then(res => {
            if (res.code === 0) {
                this.CustomerConsumptionCredentials(id);
            }
        })
    },
    CustomerConsumptionCredentials(id) {
        http("get", `/customerConsumptionCredentials/byId/`+id).then(res => {
            if (res.code === 0) {
                const result= res.data.cCustomerConsumptionCredentialsInfo;
                this.setData({
                    id:result.id,
                    customerName:result.customerName,
                    toHospitalPhone:result.toHospitalPhone,
                    liveAnchorBaseId:result.liveAnchorBaseId,
                    consumeDate:result.consumeDate,
                    payVoucherPicture1:result.payVoucherPicture1,
                    payVoucherPicture2:result.payVoucherPicture2
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