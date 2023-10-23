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
                <q-tab class="text-orange" :name="3"  label="促销商品"/>
              </q-item-section>
            </q-item>

            <q-item>
              <q-item-section top avatar>
                <q-avatar color="primary" text-color="white" square icon="key" />
              </q-item-section>
              <q-item-section>
                <q-tab class="text-orange" :name="4" label="兑换码控制"/>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section top avatar>
                <q-avatar color="primary" text-color="white" square icon="currency_lira" />
              </q-item-section>
              <q-item-section>
                <q-tab class="text-red" :name="5"  @click="toTab" label="折扣券管控"/>
              </q-item-section>
            </q-item>
          </q-list>
        </q-tabs>
      </q-drawer>
      <q-page-container>

        <q-card class="q-ma-md">
          <goodslist v-if="tab===1 "/>
          <categories v-if="tab=== 2 "/>
          <div v-if="tab===3 "/>
          <redeemcode v-if="tab===4 "/>
          <coupons v-if="tab===5 "/>

        </q-card>
      </q-page-container>
    </q-layout>

</template>
<script>
import {defineComponent} from 'vue'
import goodslist from '@/views/shop/goodslist/goods/list.vue'
import redeemcode from '@/views/shop/goodslist/redeemcode/index.vue'
import coupons from '@/views/shop/goodslist/coupons/index.vue'
import categories from '@/views/shop/goodslist/categories/index.vue'

export default defineComponent({
  name: "index",
  components: {goodslist, redeemcode, coupons,categories},
  data() {
    return {
      tab: 2,
      drawerRight:true,
    }
  },
  methods: {
    toTab() {
    }
  },
  mounted() {
  }
})
</script>

<style scoped>

</style>