<template>


    <q-layout view="lhh LpR lff" container style="height: 90vmin" class="q-ma-md shadow-2 rounded-borders">
      <q-drawer
          side="left"
          v-model="drawerRight"
          bordered
          :width="220"
          :breakpoint="500"
          class="bg-grey-3">
        <q-tabs class="" v-model="tab" >
          <q-list>
            <q-item>
              <q-item-section top avatar>
                <q-avatar color="primary" text-color="white" square icon="insert_chart" />
              </q-item-section>
              <q-item-section>
                <q-tab class="text-purple" :name="2"  label="商品分类"/>
              </q-item-section>
            </q-item>

            <q-item>
              <q-item-section top avatar>
                <q-avatar color="primary" text-color="white" square icon="insert_chart" />
              </q-item-section>
              <q-item-section>
                <q-tab class="text-purple" :name="1"  label="商品数据"/>
              </q-item-section>
            </q-item>

            <q-item>
              <q-item-section top avatar>
                <q-avatar color="primary" text-color="white" square icon="shopping_cart" />
              </q-item-section>
              <q-item-section>
                <q-tab class="text-orange" :name="2"  label="上架秒杀商品"/>
              </q-item-section>
            </q-item>

            <q-item>
              <q-item-section top avatar>
                <q-avatar color="primary" text-color="white" square icon="key" />
              </q-item-section>
              <q-item-section>
                <q-tab class="text-orange" :name="4" label="兑换码管理"/>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section top avatar>
                <q-avatar color="primary" text-color="white" square icon="currency_lira" />
              </q-item-section>
              <q-item-section>
                <q-tab class="text-red" :name="5"  @click="toTab" label="用户的优惠卷"/>
              </q-item-section>
            </q-item>
          </q-list>
        </q-tabs>
      </q-drawer>
      <q-page-container>

        <q-card class="q-ma-md">
          <goodslist v-if="tab===1 "/>
          <goodclass v-if="tab=== 2 "/>
          <div v-if="tab===3 "/>
          <redeemcode v-if="tab===4 "/>
          <coupon v-if="tab===5 "/>

        </q-card>
      </q-page-container>
    </q-layout>

</template>
<script>
import {defineComponent} from 'vue'
import goodslist from '@/views/shop/goodslist/list.vue'
import redeemcode from '@/views/shop/goodslist/redeemcode/index.vue'
import coupon from '@/views/shop/goodslist/coupon/index.vue'
import goodclass from "@/views/shop/goodslist/goodclass/index.vue"


export default defineComponent({
  name: "index",
  components: {goodslist, redeemcode, coupon,goodclass},
  data() {
    return {
      tab: 5,
      drawerRight:true,
    }
  },
  methods: {
    toTab() {
      console.log(this.$route.path);
    }
  },
  mounted() {
  }
})
</script>

<style scoped>

</style>