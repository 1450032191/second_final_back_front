<template>
  <div id="orderDetails">
    <div style="height: 20px"></div>
    <div class="green-line"></div>
     <div class="top order-part">
        <div class="orderNo">
          订单号：{{ orderInfo.orderNo }}
        </div>
       <div class="orderStatus">
         {{ orderInfo.orderStatusText }}
       </div>
     </div>
    <div class="order-info order-part">
      <div class="payment-info">
        <ul class="info-items">
          <li>
            <div class="infor-inner">
              <div class="pay-info-title">
                收货人信息
              </div>
              <div class="pay-info-content">
                <ul class="pay-items">
                  <li>
                    <span class="pay-item-title">收货人：</span>
                    <span class="pay-item-detail">{{ orderInfo.ua.uaName }}</span>
                  </li>
                  <li>
                    <span class="pay-item-title">地址：</span>
                    <span class="pay-item-detail">{{ orderInfo.ua.areaAdress +  orderInfo.ua.adress}}</span>
                  </li>
                  <li>
                    <span class="pay-item-title">手机号码：</span>
                    <span class="pay-item-detail">{{ orderInfo.ua.uaPhone }}</span>
                  </li>
                  <li>
                    <span class="pay-item-title">邮箱：</span>
                    <span class="pay-item-detail"></span>
                  </li>
                </ul>
              </div>
            </div>
          </li>
          <li>
            <div class="infor-inner">
              <div class="pay-info-title">
                配送信息
              </div>
              <div class="pay-info-content">
                <ul class="pay-items">
                  <li>
                    <span class="pay-item-title">配送方式：</span>
                    <span class="pay-item-detail">送货上门</span>
                  </li>
                  <li>
                    <span class="pay-item-title">运费：</span>
                    <span class="pay-item-detail">￥0.0</span>
                  </li>
                </ul>
              </div>
            </div>
          </li>
          <li>
            <div class="infor-inner">
              <div class="pay-info-title">
                付款信息
              </div>
              <div class="pay-info-content">
                <ul class="pay-items">
                  <li>
                    <span class="pay-item-title">付款方式：</span>
                    <span class="pay-item-detail">支付宝</span>
                  </li>
                  <li>
                    <span class="pay-item-title">付款时间：</span>
                    <span class="pay-item-detail">{{ orderInfo.order.payTime }}</span>
                  </li>
                  <li>
                    <span class="pay-item-title">商品总额：</span>
                    <span class="pay-item-detail">{{ orderInfo.order.skuAllPrice }}</span>
                  </li>
                  <li>
                    <span class="pay-item-title">应支付金额：</span>
                    <span class="pay-item-detail">{{ orderInfo.order.price }}</span>
                  </li>
                  <li>
                    <span class="pay-item-title">优惠券：</span>
                    <span class="pay-item-detail">￥0.00</span>
                  </li>
                  <li>
                    <span class="pay-item-title">订单优惠：</span>
                    <span class="pay-item-detail">￥0.00</span>
                  </li>
                </ul>
              </div>
            </div>
          </li>
          <li>
            <div class="infor-inner">
              <div class="pay-info-title">
                发票信息
              </div>
              <div class="pay-info-content">
                <ul class="pay-items">
                  <li>
                    <span class="pay-item-title">发票类型：</span>
                    <span class="pay-item-detail">不开发票</span>
                  </li>
                </ul>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div class="shop-name">一点商城</div>
    <div class="order-sku order-part">
      <div class="good-list">
        <table>
          <tr>
            <th class="grap"></th>
            <th>商品</th>
            <th>商品编号</th>
            <th>一点价</th>
            <th>商品数量</th>
            <th>总价</th>
            <th class="grap"></th>
          </tr>

          <tr v-for="(item,index) in orderInfo.orderSkuList" :key="index">
            <td class="grap"></td>
            <td>
              <div class="goods-list-item">
                <div class="goods-img">
                  <img
                      :src="initImgUrl(item.commodityMainImg)" alt="">
                </div>
                <div class="goods-info">
                  <span class="goods-info-detail">
                    {{item.commodityName}}
                  </span>
                  <div class="goods-info-more">

                  </div>
                </div>
              </div>
            </td>
            <td class="goods-num">{{ item.sku }}</td>
            <td class="goods-price">￥{{ item.price }}</td>
            <td class="goods-quantity">{{ item.skuCount }}</td>
            <td class="goods-quantity">￥{{ item.skuPrice }}</td>
          </tr>

          <!-- 运费险 -->
          <tr>
            <td class="grap"></td>
            <td>
              <div class="goods-list-item">
                <div class="goods-img">
                  <img src="http://img.zznzzn.xin/upload/images/insurance.jpg" alt="">
                </div>
                <div class="goods-info">
                  <span class="goods-info-detail">运费险</span>
                  <div class="goods-info-more">
                    最高赔付520元呀
                  </div>
                </div>
              </div>
            </td>
            <td class="goods-num">
            </td>
            <td class="goods-price">
              <span>卖家赠送</span>
            </td>
            <td class="goods-quantity">
              1
            </td>
            <td class="goods-operate">

            </td>
            <td class="grap"></td>
          </tr>

        </table>
        <div class="payment-total">
          <div class="payment-total-inner">
            <div class="pay-details">
              <ul>
                <li>
                  <span class="pay-label">商品总额：</span>
                  <span class="pay-txt">¥{{orderInfo.order.skuAllPrice}}</span>
                </li>
                <li>
                  <span class="pay-label">商品优惠：</span>
                  <span class="pay-txt">¥0.00</span>
                </li>
                <li>
                  <span class="pay-label">运　　费：</span>
                  <span class="pay-txt">¥{{ orderInfo.order.freight }}</span>
                </li>
                <li class="color-red">
                  <span class="pay-label">应付总额：</span>
                  <span class="pay-txt total-fare">¥{{ orderInfo.order.price }}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div style="text-align: right">
      <el-button size="mini" @click="toList()">返回列表</el-button>
    </div>
  </div>
</template>

<script>
import axios from '@/api';
export default {
  name: "orderDetail",
  data() {
    return {
      orderInfo: {
        orderNo: '123123',
        orderStatusText: '测试中',
        ua: {
          uaName: '',
          areaAdress: '',
          adress: '',
          uaPhone: '',
        },
        order:{
          payTime: '',
          skuAllPrice: 0.00,
          price: 120.00,
          freight: 0.00
        },
        orderSkuList: [
          {

          }
        ]
      }
    }
  },
  methods: {
    initOrderInfo(){
      var orderId = this.$route.query.orderId
      if(!orderId){
        this.toList()
      }
      axios.get('order/getOrderTailJson.do?orderId='+orderId).then(res => {
        console.log(res)
        if(res.code == 1){
          this.orderInfo = res.data
        }else {
          this.toList()
        }
      })
    },

    toList(){
      this.$router.push('/order')
    },
    initImgUrl(url){
      if(url.startsWith("http://")){
        return url;
      }
      return "http://img14.360buyimg.com/babel/"+url;
    },
  },
  created() {
    this.initOrderInfo()
  }
}
</script>

<style lang="scss">
#orderDetails{
  font-size: 12px;
  .green-line {
    height: 3px;
    background-color: #71b247;
  }
  .top{
    text-align: center;
  }
  .orderNo{
    font-size: 12px;
    margin-bottom: 30px;
    color: #999;
  }
  .orderStatus{
    font: 700 24px/34px "Microsoft YaHei";
    color: #71b247;
  }

  .order-part{
    margin-bottom: 20px;
  }

  .payment-info {
    height: 288px;
    overflow: hidden;
    padding: 15px 0;
    background-color: #fff;
    color: #333;
  }
  .payment-info .info-items {
    height: 100%;
  }

  ul, ol {
    margin-top: 0;
    margin-bottom: 10px;
  }
  ul{
    list-style-type: disc;
  }

  .payment-info .info-items>li {
    float: left;
    width: calc(25% - 1px);
    height: 100%;
    border-right: 1px solid #f1f1f1;
  }

  li{
    list-style: none;
  }

  .payment-info .info-items>li .infor-inner {
    padding: 0 10px 0 10px;
    height: 100%;
  }

  .pay-items{
    padding-left: 0;
  }

  .payment-info .pay-info-title {
    line-height: 24px;
    font-size: 14px;
    margin-bottom: 5px;
  }
  ul ul, ol ul, ul ol, ol ol{
    margin-bottom: 0;
  }

  .pay-items .pay-item-title {
    float: left;
    width: 84px;
  }

  .pay-items .pay-item-detail {
    float: right;
    width: calc(100% - 85px);
  }

  .pay-info-content .pay-items>li {
    line-height: 24px;
    width: 100%;
    overflow: hidden;
  }
  .shop-name {
    margin-bottom: 20px;
  }
  .goods-list table {
    width: 100%;
    text-align: center;
    border-collapse: collapse;
  }
  table {
    background-color: transparent;
    border-spacing: 0;
    width: 100%;
  }
  .goods-list table tr .grap {
    width: 20px;
  }
  .goods-list table tr th {
    background-color: #f9f9f9;
    text-align: center;
    line-height: 34px;
    font-weight: 500;
  }
  .goods-list table tr th:nth-child(2) {
    width: 42%;
  }
  .goods-inner tr:not(:first-child) {
    font-size: 12px;
  }
  .goods-list table tr:nth-child(2) td, .goods-list table tr td.grap {
    border: none;
  }
  table tr td {
    padding: 17px 0 20px;
    vertical-align: top;
    border-top: 1px solid #eee;
  }
  .goods-list-item {
    overflow: hidden;
  }
  .goods-list-item .goods-img {
    float: left;
    width: 58px;
    height: 58px;
  }
  .goods-list-item .goods-img img {
    max-width: 100%;
    max-height: 100%;
    border: 1px solid #e4e4e4;
    vertical-align: middle;
  }
  .goods-list-item .goods-info {
    float: right;
    width: calc(100% - 65px);
    text-align: left;
  }
  .goods-list-item .goods-info .goods-info-detail {
    display: inline-block;
    min-height: 40px;
  }
  .goods-list-item .goods-info {
    float: right;
    width: calc(100% - 65px);
    text-align: left;
  }
  .goods-list table .goods-operate {
    vertical-align: middle;
  }
  .goods-operate .op-btn {
    margin-bottom: 10px;
  }

  .payment-total {
    border-top: 1px solid #eee;
  }

  .payment-total-inner {
    padding: 20px;
  }

  .payment-total-inner .pay-details {
    text-align: right;
    overflow: hidden;
  }

  .payment-total-inner .pay-details ul {
    width: 60%;
    float: right;
  }

  .payment-total-inner .pay-details ul li {
    line-height: 28px;
  }

  .pay-details .pay-label {
    display: inline-block;
    width: 60%;
    background-color: #fff;
  }

  .pay-details .pay-txt {
    display: inline-block;
    width: 130px;
  }
  .color-red {
    color: #e4393c;
  }
  .goods-num,.goods-price,.goods-quantity{
    text-align: center;
  }
}
</style>
