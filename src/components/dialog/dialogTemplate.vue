<script>
import {defineComponent} from 'vue'
import BtnDel from "@/components/btndel.vue";

export default defineComponent({
  name: "dialogTemplate",
  components: {BtnDel}
})
</script>

<template>
  <template>
    <div>
      <q-dialog ref="useDialog" flat persistent>
        <div class="col bg-white shadow-2 q-pa-md q-ma-sm">
          <q-card class="q-pa-lg">
            <q-scroll-area class="column" style="height: 400px">
              <!-- 表格内容-->


            </q-scroll-area>
            <q-card-actions align="right">
              <q-btn v-close-popup label="取消"/>
              <q-btn color="blue" v-close-popup label="确定" @click="yes"/>
            </q-card-actions>
          </q-card>
        </div>
      </q-dialog>

    </div>
  </template>
</template>

<script>


import {IndexMixin} from "@/boot/mixins/indexV2";
import {ellipsis, formatDate} from "@/boot/datatype";
import {expire, getDictLabel, getLabelByValue} from "@/boot/dictionary";
import {requiredTest} from "@/boot/inputTest";
import Confirm from "@/components/confirm.vue";
import BtnDel from "@/components/btndel.vue";
import {defineComponent} from "vue";
import {getDictItem} from "@/boot/api/sys/tool";

export default defineComponent({
      name: "coupons",
      emits: ["selected"],
      mixins: [IndexMixin],
      components: {
        BtnDel, Confirm,
      },
      data() {
        return {
          columns: [
            {name: 'index', align: 'center', label: '序号', field: 'index',},
            {name: "couponId", align: 'center', label: '优惠卷编号', field: "couponId",}],
          imgUrl: `${process.env.BASE_URL}/sys/common/static`,
          url: {
            list: '/shop/coupons/coupons/list',
            add: '/shop/coupons/coupons',
            edit: '/shop/coupons/coupons',
            delete: '/shop/coupons/coupons',
            deleteBatch: '/shop/coupons/coupons',
          },
          couponTypes: [],
        }
      },
      methods: {
        formatDate,
        expire,
        getLabelByValue,
        ellipsis,
        getDictLabel,
        requiredTest,
        initDict() {
          this.group = ["couponId",
            "couponType",
            "couponAmount",
            "minPurchaseAmount",
            "expirationDate",
            "otherCouponInfo", "opt"]

          getDictItem("sys_shop_coupon_type").then(res => {
            this.couponTypes = res.data;
          })
        },
        yes() {
          if (this.selected.length <= 0) {
            return
          }
          this.$emit('selected', this.selected.map(item => {
            return {label: item.nickname, value: item.userId}
          }))
        },
        show() {
          this.$refs.useDialog.show();

        },
        hide() {
          this.$refs.useDialog.hide();
        }

      },
      mounted() {
        this.initDict();
      },


    }
)


</script>

<style scoped lang="css">

</style>