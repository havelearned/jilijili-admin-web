<template>
  <div style="margin: 0 auto;height: 100vmin;width: 100vmin;">

  </div>

</template>

<script>
import {defineComponent} from 'vue'
import {useQuasar} from 'quasar'

export default defineComponent({
  name: "loading",
  data() {
    return {}
  },
  methods: {
    showLoading() {
      const $q = useQuasar()
      let timer
      $q.loading.show({
        message: '一些重要的<b>过程</b>正在进行中<br/><span class="text-amber text-italic">请稍作等待...</span>',
        html: true
      })

      // hiding in 5s
      timer = setTimeout(() => {
        $q.loading.hide()
        timer = void 0
        this.$router.replace('/home');
      }, 5000)
    }
  },
  created() {
    this.showLoading()
  }
})
</script>

<style scoped>

</style>