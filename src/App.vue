<template>
  <div id="q-app"  >
    <q-ajax-bar />
    <router-view/>
  </div>
</template>

<script>
const myIcons = {
  'SYS_ADMIN': 'face_retouching_natural',
  'SYS_USER': 'face',
  'SYS_VISITOR': 'face_5',
  'default-logo': 'img:src/assets/default-logo.png',
}

export default {
  name: 'app',
  components: {

  },
  methods:{

  },
  created() {
    this.$q.iconMapFn = (iconName) => {
      const icon = myIcons[iconName]
      if (icon !== void 0) {
        return { icon: icon }
      }
    }
  },
  setup () {
    return {
    }
  }
}
</script>

<style lang="stylus">
@import '@/css/quasar.variables.styl'
@import '@/css/app.styl'
</style>
