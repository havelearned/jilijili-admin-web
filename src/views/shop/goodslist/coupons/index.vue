<template>
  <div class="q-pa-md">
    <q-tabs
        v-model="tab"
        dense
        class="text-teal"
        active-color="primary"
        indicator-color="primary"
        align="center"
        narrow-indicator
    >
      <q-tab icon="money" name="1" label="优惠卷管控">

      </q-tab>
      <q-tab icon="savings" name="2" label="用户优惠卷">

      </q-tab>
    </q-tabs>
    <div class="q-gutter-y-md">


      <q-separator/>

      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="1">
         <div>
           <couponsinfo></couponsinfo>
         </div>
        </q-tab-panel>

        <q-tab-panel name="2">
          <div>

          </div>
        </q-tab-panel>


      </q-tab-panels>


    </div>
  </div>
</template>

<script>
import {ref} from 'vue'
import couponsinfo from '@/views/shop/goodslist/coupons/couponsinfo/index.vue'

export default {
  name: "coupons",
  components: {
    couponsinfo
  },
  data() {
    return {
      tab: ref('1')
    }
  }
}
</script>
