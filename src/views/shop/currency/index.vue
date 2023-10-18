<template>
  <div>
    <q-card class="q-ma-md">
      <div class="q-ma-md flex justify-center items-center">
        <q-tabs v-model="tab" dense align="justify">
          <q-card class="row">
            <q-card-section>
              <q-tab class="text-orange" name="virtual" icon="shopping_cart" label="用户资产"/>
            </q-card-section>
            <q-card-section>
              <q-tab class="text-purple" name="type" icon="insert_chart" label="货币类型"/>
            </q-card-section>
          </q-card>
        </q-tabs>
      </div>
    </q-card>

    <type v-if="tab=== 'type' "/>
    <virtual v-if="tab=== 'virtual' "/>


  </div>
</template>
<script>
import {defineComponent} from 'vue'
import type from "@/views/shop/currency/type/index.vue"
import virtual from "@/views/shop/currency/virtual/index.vue"


export default defineComponent({
  name: "currency",
  components: {type, virtual},
  data() {
    return {
      tab: 'virtual',
    }
  },
  methods: {},
  mounted() {
  }
})
</script>

<style scoped>

</style>