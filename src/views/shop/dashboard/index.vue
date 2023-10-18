<template>
  <div class="row q-page ">
    <div class=" col-2 ">
      <q-toolbar-title class="q-ma-md my_left_title">
        <div class="row">
          <div @click="test">今日数据</div>
          <q-space/>
          <div>
            <q-btn size="xs" dense icon="menu" @click="fullscreenRequest"/>
          </div>
          <q-separator size="5px" color="black"/>
        </div>

      </q-toolbar-title>
      <q-scroll-area style="height: 800px;" class="no-wrap">
        <div class="q-ma-md">
          <q-list>
            <q-item active active-class="active_class" clickable>
              <q-card class="full-width" style="margin-top: 5px">
                <q-card-section class="flex justify-center">
                  商品数据
                </q-card-section>
                <div id="shopDataId" style="height: 50px;">折线图</div>
              </q-card>
            </q-item>
            <q-item active-class="active_class" clickable>
              <q-card class="full-width" style="margin-top: 5px">
                <q-card-section class="flex justify-center">
                  热卖数据
                </q-card-section>
                <div id="hotspotId" style="height: 50px;">折线图</div>
              </q-card>
            </q-item>
          </q-list>
        </div>
      </q-scroll-area>
    </div>
    <div class="col-8 column ">
      <div class="">
        <div class="q-pa-md">
          <div class="text-h2">统计信息</div>
          <q-separator size="5px" color="black"/>
          <div class="q-pa-md">
            <q-btn-toggle push glossy toggle-color="primary"
                          v-model="compareTime" :options="[
          {label: '今天', value: 1},
          {label: '这周', value: 2},
          {label: '这个月', value: 3 }
        ]"/>
          </div>

        </div>
        <div class="q-gutter-lg flex justify-center ">
          <q-card class="row" v-for="(item,index) in 4">
            <div class="col-8 q-pa-md my_left_text_number " :id="`pic${index}`" style="width: 20vmin;height: 150px">
              总上架量
              $25.03
            </div>
          </q-card>
        </div>
        <div class="q-gutter-md q-pa-md flex justify-between">
          <div style="width: 500px;height: 500px;" id="map"></div>
          <div style="width: 500px;height: 500px;" id="histogram"></div>
        </div>
      </div>
    </div>
    <div class="col-2">
      <q-list class="q-pa-md">
        <div class="row flex justify-center items-center">
          <q-btn flat color="green" icon="preview" size="md" label="最新消息"></q-btn>
        </div>
        <q-scroll-area style="height: 100vmin">
          <q-item v-for="(item,index) in 100">
            <q-item-label> {
              props: {
              urls: {required: true,},
              multiple: {type: Boolean, default: true},
              maxTotalSize: {type: String, default: '100000000'},
              maxFiles: {type: Number, default: 50},
              accept: {type: String, default: 'image/*'},
              uploadUrl: {type: String, default: uploadUrl},
              }
              }
            </q-item-label>
          </q-item>
        </q-scroll-area>
      </q-list>
    </div>
  </div>

</template>

<script>
import {defineComponent} from 'vue'
import {drawHotspot, drawPie, drawMap, drawHistogram} from "@/views/shop/dashboard/index"

export default defineComponent({
  name: "index",
  data() {
    return {
      compareTime: 1,
      fullscreen: false,

    }
  },
  methods: {
    test() {
      for (let i = 0; i < 4; i++) {
        drawPie("pic" + i)
      }
      drawMap("map")
      drawHistogram('histogram')
      drawHotspot('hotspotId')
    },
    // 请求全屏模式：
    fullscreenRequest() {
      this.fullscreen = !this.fullscreen
      if (this.fullscreen) {
        this.$q.fullscreen.request()
      } else {
        this.$q.fullscreen.exit()
      }
    },

  },

})
</script>

<style scoped>

.active_class {
  border-color: #1B98E0;
}

.my_left_bar_bg {
  background: rgb(231, 232, 252);
}

.my_left_text {
  color: rgb(33, 35, 74);
  font-family: HarmonyOS_Sans_SC_Medium, serif;
  font-size: 18px;
  font-weight: 700;
  line-height: 25px;

}

.my_left_title {
  color: rgb(0, 0, 0);
  font-family: HarmonyOS_Sans_SC_Medium;
  font-size: 15px;
  font-weight: 400;
  line-height: 27px;
}

.my_left_text_hit {
  color: rgb(33, 35, 74);
  font-family: HarmonyOS_Sans_SC_Medium;
  font-size: 12px;
  font-weight: 400;
  line-height: 16px;
}

.my_left_text_number {
  color: rgb(115, 65, 65);
  font-family: HarmonyOS_Sans_SC_Medium;
  font-size: 15px;
  font-weight: 400;
  line-height: 31px;
  letter-spacing: 0px;
}
</style>