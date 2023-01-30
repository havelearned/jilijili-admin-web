<template>
  <div>
    {{ `引用光临:` + nickname }}

    <q-btn @click="logout">退出</q-btn>
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
      nickname: computed(() => store.state.user.nickname),

      logout: () => store.dispatch("logout").then(()=>window.location.reload()),
    }
  }
}
</script>

<style scoped>

</style>
