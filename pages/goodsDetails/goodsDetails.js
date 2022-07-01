import http from '../../utils/http.js';

Page({
  data: {
    control: false,

    goodsId: "",

    goodsInfo: null,
  },

  onLoad(e) {
    const { goodsId } = e;
    this.getGoodsDetails(goodsId);
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
          goodsInfo
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