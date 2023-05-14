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
  </div>
</template>

<script>
import {computed} from "vue";

export default {
  name: "dashboard",
  data() {
    return {
      visible: false,
      nickname: computed(() => this.$store.state.user.currentUser ? this.$store.state.user.currentUser.nickname.slice(1) : '登录'),
    }
  },
  methods: {},
  mounted() {
  }

}


</script>

<style scoped lang="less">
@import "src/css/dashboard.less";

.custom-caption {
  text-align: center;
  padding: 12px;
  color: white;
  background-color: rgba(0, 0, 0, .3);
}


</style>

