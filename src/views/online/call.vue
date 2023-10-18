<template>
  <q-dialog v-model="callPopup" persistent transition-show="scale" transition-hide="scale">

    <div>
      <q-card class="my-card">
        <q-img width="400px" height="400px" fit="fill" :src="splitUrl(callUser.avatar)"/>
        <q-card-section>
          <q-btn @click="startAudio" fab :color="callColor" icon="call" class="absolute"
                 style="top: 0; right: 12px; transform: translateY(-50%);">
            <q-tooltip>开始通讯</q-tooltip>
          </q-btn>

          <div class="row no-wrap items-center">
            <div class="col text-h6 ellipsis">
              {{ callUser.username }}
            </div>
          </div>

          <!--          <q-rating :max="5" size="32px"/>-->
        </q-card-section>

        <q-card-section class="q-pt-none">
          <div class="text-subtitle1">
            {{ notifyStr }}
          </div>
          <div class="text-caption text-grey">
            正常通话中
          </div>
        </q-card-section>
        <q-separator/>
        <q-card-actions align="center">
          <q-btn flat color="primary" @click="close" v-close-popup>
            取消
          </q-btn>
        </q-card-actions>
      </q-card>
    </div>
  </q-dialog>
</template>

<script>
import {defineComponent} from 'vue'

export default defineComponent({
  name: "chatPanel",
  props: {},
  data() {
    return {}
  },
  methods: {

  }
})
</script>

<style scoped>

</style>