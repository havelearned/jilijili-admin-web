<template>
  <div>
    <q-card class="q-ma-md">
      <div class="q-ma-md flex justify-center items-center">
        <q-tabs v-model="tab" dense align="justify">
          <q-card class="row">
            <q-card-section>
              <q-tab class="text-purple" name="orderList" icon="insert_chart" label="订单列表"/>
            </q-card-section>
            <q-card-section>
              <q-tab class="text-orange" name="cartsData" icon="shopping_cart" label="购物车数据"/>
            </q-card-section>
            <q-card-section>
              <q-tab class="text-teal" name="orderView" icon="bar_chart" label="订单数据可视化"/>
            </q-card-section>
          </q-card>
        </q-tabs>
      </div>
    </q-card>

    <orderList v-if="tab=== 'orderList' "/>
    <cartsList v-if="tab=== 'cartsData' "/>
    <div v-if="tab=== 'orderView' "/>


  </div>
</template>
<script>
import {defineComponent} from 'vue'
import orderList from '@/views/shop/orderlist/list.vue'
import cartsList from '@/views/shop/orderlist/carts.vue'


export default defineComponent({
  name: "index",
  components: {orderList, cartsList},
  data() {
    return {
      tab: 'orderList',
    }
  },
  methods: {},
  mounted() {
  }
})
</script>

<style scoped>

</style>