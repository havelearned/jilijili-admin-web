<template>
  <div class="point">
    <q-ajax-bar/>
    <router-view/>
  </div>

</template>

<script>

import {defineComponent} from 'vue'
import layout from './pages/Layout.vue'
import "./permission.js"
import {useQuasar} from 'quasar'
import {setRouter} from "src/utils/auth";

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

export default defineComponent({
  name: 'App',
  components: {
    layout
  },
  setup() {
    const $q = useQuasar()
    $q.iconMapFn = (iconName) => {
      const icon = myIcons[iconName]
      if (icon !== void 0) {
        return {icon: icon}
      }
    }
  },
  methods: {
    getRule() {
      const currentUser = this.$store.getters['getCurrentUser']
      if (!currentUser) return
      this.$store.dispatch("fetchMenuList").then(response => {
        let menu = response.data
        menu = this.imTr(menu)
        this.$store.commit('SET_MENULIST', menu)
        setRouter(menu)
      })
    },
    imTr(menuinfo) {
      const result = [];
      menuinfo.forEach(v => {
        result.push({
          path: v.path,
          name: v.menuName,
          component: () => import(v.component),
          meta: {
            title: v.menuName,
            icno: v.icon,
            path: '/' + v.component,
            perms: v.perms,
            remark: v.remark,
            isCache: v.isCache,
            menuType: v.menuType,
            isFrame: v.isFrame,
            visible: v.visible,
            status: v.status,
          },
          children: v.children ? this.imTr(v.children) : null
        })
      })
      return result;
    }
  },
  mounted() {
    // this.getRule();
  }
})
</script>

<style lang="less">
.point {
  cursor: url('assets/images/point.png'), default;
}
</style>


