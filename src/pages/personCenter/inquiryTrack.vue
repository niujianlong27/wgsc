<template>
  <div class="inquiryTrack">
    <page-nav :title="'询价单跟踪'"></page-nav>
    <main>
      <section>
        <div>
          <img  src="../../assets/changjing.png" alt="">
        </div>
        <div>
          <h5>施耐德 塑壳断路器固定式CVS160N 2123A 3P</h5>
          <p>产品编号：C3135791</p>
          <p>2020-06-08 04:00</p>
          <span>￥ 160</span>
        </div>
      </section>
      <div class="inquiry">
        <section>
          <h4><span></span> 询单摘要</h4>
          <p><span>询价单号：</span><span>1241241</span></p>
          <p><span>询单标题：</span><span>施耐德 塑壳断路器固定式CVS160N 150A 3P</span></p>
          <p><span>邀请范围：</span><span>定向寻源</span></p>
          <p><span>报名截止时间：</span><span>2020-02-09 00:00</span></p>
          <p><span>报价截止时间：</span><span>2020-02-09 00:00</span></p>
        </section>

        <section>
          <h4><span></span> 供应商报价监控</h4>
          <p><span>供应商名称：</span><span>上海鼎盛科技有限公司</span><span class="right">￥ 13</span></p>
          <p><span>供应商联系人：</span><span>张三</span></p>
          <p><span>供应商电话：</span><span>131121311312</span></p>
          <van-divider />

          <p><span>供应商名称：</span><span>上海鼎盛科技有限公司</span><span class="right">￥ 13</span></p>
          <p><span>供应商联系人：</span><span>张三</span></p>
          <p><span>供应商电话：</span><span>131121311312</span></p>
          <van-divider />

        </section>

      </div>
    </main>
  </div>
</template>

<script>
  import pageNav from '../../components/pageNav'
  import { Divider } from 'vant';

  export default {
        name: "inquiryTrack",
        components:{
          pageNav,
          [Divider.name]:Divider

        },
        data() {
            return {}
        },
    }
</script>

<style scoped lang="scss">
  @import 'src/style/mixin';
  @import 'src/style/common';
  main{
    background-color: #F5F5F5;
    padding: 0 20px 10px;
    text-align: left;
    >section{
      background-color: #ffffff;
      margin: 10px auto;
      padding: 15px 10px;
      border-radius: 7px;
      &:first-child{
        display: flex;
        div{
          position: relative;
          &:first-child{
            flex: 1;
            flex-shrink:0;
            position: relative;
          }
          img{
            @include wh(100%,90px);
            @include ct;
          }
          &:last-child{
            flex: 3;
            padding-left:8px;
          }
          h5,p{
            margin:9px 0;
            color: #24272C;
          }
          p{
            @include sc(12px,#5F5F5F)
          }
          span{
            display: inline-block;
            @include wh(50px,20px);
            background-color: #100F65;
            @include sc(12px,#FFFFFF);
            line-height: 20px;
            text-align: center;
            position: absolute;
            border-radius: 3px;
            bottom: 3px;
            right: 3px;}
        }
      }
    }
    .inquiry{
      section {
        box-sizing: border-box;
        padding: 1px 15px;
        margin: 10px auto 0;
        border-radius: 7px;
        background-color: #FFFFFF;
        h4 {
          font-size: 14px;
          margin: 12px 0;
          span {
            border-left: 2px solid #373737;
            height: 12px;
            display: inline-block;
            position: relative;
            top: 1px;
          }
        }
        p {
          padding-left: 6px;
          margin: 12px 0;
          span {
            &:first-child {
              color: #373737;
              font-weight: 500;
            }
          }
          @include sc(12px, #898989);
          .right{
            text-align: center;
             @include wh(50px,20px);
            border-radius: 10px;
            border: 1px solid #EB6464;
            color: #EB6464 ;
            line-height: 20px;

          }
        }
        .van-divider{
          &:last-of-type{
            border-color: #ffffff;
          }
        }
      }
    }

  }

</style>
