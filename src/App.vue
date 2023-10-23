<template>
  <div id="q-app">
    <q-ajax-bar/>
    <router-view/>
  </div>
</template>

<script>
import {getDictList} from "@/boot/api/sys/tool";
import {stompClient} from "@/boot/ws"
import {defineComponent} from "vue";
import {useNotify} from "@/boot/useNotify";
import Cookie from "@/boot/cookie";

const myIcons = {
  'SYS_ADMIN': 'face_retouching_natural',
  'SYS_USER': 'face',
  'SYS_VISITOR': 'face_5',
  'SYS_TEST': 'img:src/assets/icon/test.svg',
  'default-logo': 'img:src/assets/default-logo.png',
}

export default defineComponent({
  name: 'app',
  components: {},
  data() {
    return {}
  },
  methods: {

    // 设置icon
    createIcon() {
      this.$q.iconMapFn = (iconName) => {
        const icon = myIcons[iconName]
        if (icon !== void 0) {
          return {icon: icon}
        }
      }
    },
    // 获取全部字典
    getDict() {
      let param = {
        page: 0,
        size: 1000,
      }
      getDictList(param).then(res => {
        if (res.flag) {
          this.$store.commit("user/setDictType", res.data.records);
        }
      }).catch(error => {
        console.log(error)
      })

    },
    openWebSocket() {
      const  user = Cookie.getCookies(Cookie.USERINFO)
      console.log(user)
      stompClient.connect({}, (frame) => {
        useNotify().infoNotify('Connected to STOMP');
        stompClient.subscribe('/queue/notify', (message) => {
          // console.log('Received message:', message.body);
          this.$bus.emit("AllMessage", message.body)

        });
        stompClient.subscribe(`/user/${user.userId}/queue/notify`, (message) => {
          // console.log('Received message:', message.body);
          this.$bus.emit("myMessage", message.body)

        })
      });
      // 监听连接断开事件
      stompClient.onclose = (closeEvent) => {
        if (closeEvent.code === 1000) {
          useNotify().infoNotify('WebSocket 连接正常关闭');
        } else {
          useNotify().negativeNotify('WebSocket 连接异常关闭', closeEvent);
        }
      };

    }

  },
  created() {
    this.createIcon()
    this.getDict()
    this.openWebSocket()
  },
  beforeUnmount() {
    stompClient.disconnect();
  }


})

</script>

<style lang="stylus">
//多个字体可多个引入
@font-face {
  font-family: 'HarmonyOS_Sans_SC_Medium';
  src: url('@/assets/font/HarmonyOS_Sans_Bold.ttf');
  src: url('@/assets/font/HarmonyOS_Sans_Black.ttf');
  src: url('@/assets/font/HarmonyOS_Sans_Light.ttf');
  src: url('@/assets/font/HarmonyOS_Sans_Medium.ttf');
  src: url('@/assets/font/HarmonyOS_Sans_Regular.ttf');
  src: url('@/assets/font/HarmonyOS_Sans_Thin.ttf');
  font-weight: normal;
  font-style: normal;
}

@import '@/css/quasar.variables.styl'
@import '@/css/app.styl'

/** {*/
/*  scrollbar-width: thin; !* 垂直滚动条的宽度 *!*/
/*  scrollbar-color: transparent transparent; !* 滚动条颜色（拖动手柄和轨道） *!*/
/*  ::-webkit-scrollbar {*/
/*    width: 0.1em; !* 垂直滚动条的宽度 *!*/
/*    height: 0.1em; !* 水平滚动条的高度 *!*/
/*  }*/

/*  ::-webkit-scrollbar-thumb {*/
/*    background-color: transparent; !* 滚动条拖动手柄的背景色 *!*/
/*  }*/
//}

</style>
