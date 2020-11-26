<template>
  <section>
    <p>张三 189213712873 </p>
    <p>上海市 宝山区 漠河路东鼎国际A座2楼201</p>
    <div>
      <p>
        <van-icon name="passed"/>
        已设为默认
      </p>
      <p>
        <span @click.stop="Overlay">修改</span>
        <span>删除</span>
      </p>
    </div>
  </section>
</template>

<script>
  import {Icon} from 'vant';

  export default {
    name: "addressDetails",
    components: {
      [Icon.name]: Icon
    },
    data() {
      return {
        show:true
      }
    },
    methods: {
      Overlay() {
        console.log(121)
        this.$emit('setOverlay',this.show);

      }
    }
  }
</script>

<style scoped lang="scss">
  @import 'src/style/mixin';

  section {
    p {
      /*margin:12px 0;*/
    }
    padding: 1px 20px;
    box-sizing: border-box;
    background: rgba(255, 255, 255, 1);
    font-weight: 500;
    @include sc(14px, rgba(83, 83, 83, 1));
    text-align: left;
    div {
      display: flex;
      font-size: 12px;
      p {
        flex: 1;
        color: #E44A4A;
        &:last-child {
          text-align: right;
          span {
            margin-right: 10px;
            &:first-child {
              color: #878787;
            }
          }
        }
        .van-icon {
          top: 2px;
        }
      }
    }
  }
</style>
