<template>
  <div class="q-pa-md">

    <div class="row">
      <div class="col-3 q-pa-md">
        <q-card >
          <q-card-section>

          </q-card-section>
        </q-card>
      </div>
<!--      <div class="col-3 q-pa-md">-->
<!--        <q-card >-->
<!--          <q-card-section>-->

<!--          </q-card-section>-->
<!--        </q-card>-->
<!--      </div>-->
<!--      <div class="col-3 q-pa-md">-->
<!--        <q-card >-->
<!--          <q-card-section>-->

<!--          </q-card-section>-->
<!--        </q-card>-->
<!--      </div>-->

<!--      <div class="col-3 q-pa-md">-->
<!--        <q-card >-->
<!--          <q-card-section>-->

<!--          </q-card-section>-->
<!--        </q-card>-->
<!--      </div>-->
<!--      <div class="col-3 q-pa-md">-->
<!--        <q-card >-->
<!--          <q-card-section>-->

<!--          </q-card-section>-->
<!--        </q-card>-->
<!--      </div>-->

    </div>
  </div>
</template>
<script>
import {defineComponent, nextTick} from 'vue'
import {useNotify} from "@/boot/useNotify";
import selected from "@/components/selected.vue";

export default defineComponent({
  name: "index",
  components: {
    selected
  },
  data() {
    return {
      testModel: [],
      url: {
        addUrl: '/singer',
        listUrl: '/singer/list',
      },

    }
  },
  mounted() {

  },
  methods: {
    submit() {
      console.log(this.testModel)
    }
  }
})
</script>

<style scoped>

</style>