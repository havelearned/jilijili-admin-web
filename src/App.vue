<template>
  <router-view />
</template>

<script>
import { defineComponent } from 'vue'

import layout from './pages/Layout.vue'
import "./permission.js"
export default defineComponent({
  name: 'App',
  components:{
    layout
  }
})
</script>
