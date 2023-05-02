<template>
  <div class="point">
    <q-ajax-bar />
    <router-view />
  </div>

</template>

<script>

const myIcons = {
  'jilijili:music': 'img:/src/assets/images/music.svg',
  'jilijili:dashboard': 'img:/src/assets/images/dashboard.svg',
  'jilijili:user': 'img:/src/assets/images/user.svg',
  'jilijili:fileLibrary': 'img:/src/assets/images/fileLibrary.svg',
  'jilijili:system': 'img:/src/assets/images/system.svg',
  'jilijili:userList': 'img:/src/assets/images/userList.svg',
  'jilijili:userPower': 'img:/src/assets/images/userPower.svg',
  'jilijili:exclamation': 'img:/src/assets/images/exclamation.svg', // 感叹号

}
import { defineComponent } from 'vue'
import layout from './pages/Layout.vue'
import "./permission.js"
import { useQuasar } from 'quasar'
export default defineComponent({
  name: 'App',
  components:{
    layout
  },
  setup(){
    const $q = useQuasar()

    $q.iconMapFn = (iconName) => {
      const icon = myIcons[iconName]
      if (icon !== void 0) {
        return { icon: icon }
      }
    }
  }
})
</script>

<style lang="less">
.point{
  cursor: url('assets/images/point.png'),default;
}
</style>


