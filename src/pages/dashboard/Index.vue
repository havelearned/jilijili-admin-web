<template>
  <div class="page">



    <q-card>
      <div class="welcome-piece">
        <div class="welcome-float q-pa-md q-gutter-sm">
          <q-avatar size="80px" font-size="52px" color="teal" text-color="white" icon="directions">
            {{ nickname }}
          </q-avatar>

          <div>
            <div class="welcome-title-font">
              {{ `欢迎光临:` + nickname }}<br>
            </div>

            <div class="welcome-font">
              这是jilijili后台管理系统
            </div>
          </div>
        </div>
      </div>

    </q-card>


    <div style="margin-top: 20px;">
      <q-carousel
        swipeable
        arrows
        animated
        v-model="slide"
        v-model:fullscreen="fullscreen"
        :autoplay="autoplay"
        ref="carousel"
        height="400px"
        infinite
      >

        <q-carousel-slide :name="1" img-src="https://cdn.quasar.dev/img/mountains.jpg">
          <div class="absolute-bottom custom-caption">
            <div class="text-h2">First stop</div>
            <div class="text-subtitle1">new song</div>
          </div>
        </q-carousel-slide>
        <q-carousel-slide :name="2" img-src="https://cdn.quasar.dev/img/parallax1.jpg">
          <div class="absolute-bottom custom-caption">
            <div class="text-h2">Second stop</div>
            <div class="text-subtitle1">new album</div>
          </div>
        </q-carousel-slide>
        <q-carousel-slide :name="3" img-src="https://cdn.quasar.dev/img/parallax2.jpg">
          <div class="absolute-bottom custom-caption">
            <div class="text-h2">Third stop</div>
            <div class="text-subtitle1">new singer</div>
          </div>
        </q-carousel-slide>

        <template v-slot:control>
          <q-carousel-control
            position="bottom-right"
            :offset="[18, 18]"
          >
            <q-carousel-control
              position="top-right"
              :offset="[18, -340]"
              class="text-white rounded-borders"
              style="background: rgba(0, 0, 0, .3); padding: 4px 8px;"
            >
              <q-toggle dense dark color="orange" v-model="autoplay" label="Auto Play" />
            </q-carousel-control>

            <q-carousel-control
              position="bottom-right"
              :offset="[40, 0]"
              class="q-gutter-sm"
              style="width: 100px"
            >
              <q-btn
                push round dense color="orange" text-color="black" icon="arrow_left"
                @click="$refs.carousel.previous()"
              />
              <q-btn
                push round dense color="orange" text-color="black" icon="arrow_right"
                @click="$refs.carousel.next()"
              />
            </q-carousel-control>
            <q-btn
              push round dense color="white" text-color="primary"
              :icon="fullscreen ? 'fullscreen_exit' : 'fullscreen'"
              @click="fullscreen = !fullscreen"
            />
          </q-carousel-control>
        </template>
      </q-carousel>
    </div>

    <!-- 总流量-->
    <q-card class="summary-box row">
      <div class="summary-card">
        <div class=" summary-font">总流量</div>
        <div class=" summary-font">601,986,875</div>
      </div>
      <div class="summary-line"></div>

      <div class="summary-card" v-for="(item,index) in flowData" :key="index">
        <div class="summary-row">
          <div class="row-lg" :id="item.id" style="width: 150px;height: 150px"></div>
          <div class="summary-text-box">
            <div class=" summary-font">{{ item.title }}</div>
            <div class=" summary-font-point">{{ item.flowFigures }}</div>
            <div class=" summary-font-min">同步上升:<em>{{ item.proportion }}</em></div>
          </div>

        </div>
      </div>
    </q-card>


    <!--  月数据趋势  -->
    <div class="trend-box row">
      <q-card class="trend-item1">
        <q-banner inline-actions class="text-white bg-grey-14">
          <template v-slot:action>
            <q-btn flat color="white" label="月数据趋势"/>
          </template>
        </q-banner>

        <div class="trend-contain">
          <div class="">支付成功率</div>
          <div class="">45.82</div>
          <div class="">周上升:<em>100%</em>月同比下降<em>10%</em></div>

          <!--          <div ref="test" style="width: 100%;height: 200px">-->
          <!--            统计图-->
          <!--          </div>-->
        </div>


        <q-inner-loading
          :showing="visible"
          label="加载中..."
          label-class="text-teal"
          label-style="font-size: 1.1em"
        />
      </q-card>

      <q-card class="trend-item2">
        <q-banner inline-actions class="text-white bg-grey-14">

          <template v-slot:action>
            <q-btn flat color="white" label="排查代办提示"/>
          </template>
        </q-banner>

        <q-inner-loading
          :showing="visible"
          label="加载中..."
          label-class="text-teal"
          label-style="font-size: 1.1em"
        />
      </q-card>

      <q-card class="trend-item3">
        <q-banner inline-actions class="text-white bg-grey-14">
          <template v-slot:action>
            <q-btn flat color="white" label="产品销售好评度"/>
          </template>
        </q-banner>


        <q-inner-loading
          :showing="visible"
          label="加载中..."
          label-class="text-teal"
          label-style="font-size: 1.1em"
        />
      </q-card>
    </div>

    <!--   今日数据   -->
    <div class="row page-margin">
      <q-card v-for="() in 3"
              class="my-card text-white row q-gutter-xl q-pt-lg q-banner q-col-gutter-xl  "
              style="background: radial-gradient(circle, #35a2ff 0%, #014a88 100%)"
      >
        <q-card-section>
          <div class="text-h6">Our Changing Planet</div>
          <div class="text-subtitle2">by John Doe</div>
        </q-card-section>

        <q-card-section id="realtimeSort" class="q-pt-none">
          at createCompilerError
          (G:\JavaProject\jilijili-music-admin\node_modules\@vue\compiler-core\dist\compiler-core.cjs.js:19:19)
          at emitError
          (G:\JavaProject\jilijili-music-admin\node_modules\@vue\compiler-core\dist\compiler-core.cjs.js:1613:29)
          at parseElement
          (G:\JavaProject\jilijili-music-admin\node_modules\@vue\compiler-core\dist\compiler-core.cjs.js:1165:9)
          at parseChildren
          (G:\JavaProject\jilijili-music-admin\node_modules\@vue\compiler-core\dist\compiler-core.cjs.js:943:28)
          at parseElement
          (G:\JavaProject\jilijili-music-admin\node_modules\@vue\compiler-core\dist\compiler-core.cjs.js:1144:22)
          at parseChildren
          (G:\JavaProject\jilijili-music-admin\node_modules\@vue\compiler-core\dist\compiler-core.cjs.js:943:28)
          at parseElement
          (G:\JavaProject\jilijili-music-admin\node_modules\@vue\compiler-core\dist\compiler-core.cjs.js:1144:22)
          at parseChildren
          (G:\JavaProject\jilijili-music-admin\node_modules\@vue\compiler-core\dist\compiler-core.cjs.js:943:28)
          at Object.baseParse
          (G:\JavaProject\jilijili-music-admin\node_modules\@vue\compiler-core\dist\compiler-core.cjs.js:858:23)
          at Object.parse
          (G:\JavaProject\jilijili-music-admin\node_modules\@vue\compiler-dom\dist\compiler-dom.cjs.js:3119:25)

        </q-card-section>

        <q-inner-loading
          :showing="visible"
          label="加载中..."
          label-class="text-teal"
          label-style="font-size: 1.1em"
        />
      </q-card>

    </div>


  </div>
</template>

<script setup>
import {useStore} from "vuex";
import {computed, onMounted, onUnmounted, ref} from "vue";
import * as echarts from "echarts";
import {useDashBoardData} from 'src/composables/dashboard/useDashBoardData'

let echart = echarts
const visible = ref(false);
const store = useStore();
const slide = ref(1)
const fullscreen = ref(false)
const autoplay = ref(false)
const nickname = computed(() => store.state.user.currentUser ? store.state.user.currentUser.nickname.slice(1) : '登录');
const {
  flowData,
  realtimeSort
} = useDashBoardData()


onMounted(() => {
  flowData.value.forEach(item => {
    echart.init(document.getElementById(item.id)).setOption(item.pieChart)
  })


})
onUnmounted(() => {
  // echarts.dispose()
})

</script>

<style scoped lang="less">
@import "src/css/dashboard.less";

.custom-caption{
  text-align: center;
  padding: 12px;
  color: white;
  background-color: rgba(0, 0, 0, .3);
}


</style>

