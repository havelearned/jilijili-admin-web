<template>
  <div>
    {{ `引用光临:` + nickname }}<br>
    这里是仪表板,一般会呈现可视化的数据信息

  </div>
</template>

<script>
import {useStore} from "vuex";
import {computed} from "vue";

export default {
  name: "Index",
  setup() {
    const store = useStore();



    return {
      nickname: computed(() => store.state.user.currentUser ? store.state.user.currentUser.nickname.slice(1) : '登录'),
    }
  }
}
</script>

<style scoped>

</style>
