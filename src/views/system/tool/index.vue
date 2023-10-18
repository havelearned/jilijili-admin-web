<template>
  <q-page class="q-pa-lg">


    <div class="row q-col-gutter-x-xs q-col-gutter-y-lg">
      
      <div class="col-4" v-for="(tool,index) in toolTeam" :key="tool.toolItemId">
        <q-card class="my-card" @click="to(tool.toolItemId)">
          <q-parallax
              src="https://cdn.quasar.dev/img/parallax1.jpg"
              :height="150"
          />
          <q-card-section>
            <div class="text-h6">{{ tool.title }}</div>
            <div class="text-subtitle2">{{ tool.desc }}</div>
          </q-card-section>
        </q-card>
      </div>

    </div>


  </q-page>

</template>
<script>
import {defineComponent, nextTick} from 'vue'


export default defineComponent({
  name: "index",
  components: {},
  data() {
    return {
      toolTeam: [
        {title: '图像处理', desc: '转png,jpg,webp,gif,在线ps', toolItemId: 1},
        {title: 'office处理', desc: '预览office,转word,pdf,excel', toolItemId: 2},
        {title: '其他', desc: '...', toolItemId: 1},
      ]


    }
  },
  mounted() {

  },
  methods: {
    to(id) {
      switch (id) {
        case id:
          // this.$router.replace({path: 'toolItem', query: {id: id}})
          break;
      }

    }
  }
})
</script>

<style lang="sass" scoped>
.my-card
  width: 100%
  max-width: 500px
</style>