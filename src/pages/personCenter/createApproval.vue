<template>
    <div class="createApproval">
      <page-nav :title="'创建审批'"></page-nav>
      <main>
        <section>
          <h4><span></span> 供应商信息</h4>
          <p><span>邀请范围：</span><span>1241241</span></p>
          <p><span>注册资本：</span><span>0.0000元</span></p>
          <p><span>资质要求：</span><span>无</span></p>
          <p><span>报名要求：</span><span>无</span></p>
          <p><span>邀请供应商：</span><span>上海鼎盛科技信息有限公司</span></p>
        </section>
        <section>
          <h4><span></span> 物料信息</h4>
          <p><span>物料名称：</span><span>1241241</span></p>
          <p><span>型号规格：</span><span>大钩</span></p>
          <p><span>采购数量：</span><span>100</span></p>
          <p><span>交货日期：</span><span>2020-02-09 00:00</span></p>
          <p><span>备注：</span><span>无</span></p>
          <p><span>计量单位：</span><span>个</span></p>

        </section>
        <div>
          <span>
             <van-button color="#171060" block type="info" @click="adopt" native-type="submit">
             通过
            </van-button>
          </span>
          <span>
              <van-button color="#EB6464" block type="info" @click="reject" native-type="submit">
              驳回
            </van-button>
          </span>
        </div>
      </main>

    </div>
</template>

<script>
  import pageNav from '../../components/pageNav'
  import {Button} from 'vant';

  export default {
        name: "createApproval",
      components:{
        pageNav,
        [Button.name]: Button

      },
        data() {
            return {}
        },
      methods:{
        adopt(){

        },
        reject(){

        }
     }
    }
</script>

<style scoped lang="scss">
  @import 'src/style/mixin';
  @import 'src/style/common';
  main {
    background-color: #F5F5F5;
    padding: 0 20px 50px;
    section {
      box-sizing: border-box;
      padding: 1px 5px 1px 18px;
      margin-top: 10px ;
      border-radius: 7px;
      background-color: #FFFFFF;
      text-align: left;
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
        @include sc(12px, #898989)
      }
    }
    div{
      display: flex;
      span{
        flex:1
      }
      /deep/ .van-button--block {
        width: 146px;
        margin:50px auto 0;
        border-radius: 4px;
      }
    }

  }
</style>
