<template>
  <div class="login-page">

    <q-card class="my-card   login-form-content">
      <div class="title">jilijiliMusic</div>
      <q-form
        class="q-gutter-md form"
        @submit="onsubmit(username,password)"

      >
        <q-input
          filled
          v-model="username"
          label="账号"
          hint="input access"
          lazy-rules
          :rules="[ val => val && val.length > 0 || '账号不正确']"
        />
        <q-input
          filled
          v-model="password"
          label="密码"
          hint="input password"
          lazy-rules
          type="password"
          :rules="[ val => val && val.length > 0 || '密码不正确']"
        />

        <q-toggle v-model="accept" label="记住我"/>

        <div>
          <q-btn class="full-width" label="登录" type="submit" color="primary"/>
        </div>
      </q-form>
    </q-card>
  </div>

</template>

<script>

import {useQuasar} from 'quasar'
import {ref} from 'vue'
import {useStore} from "vuex";
import {useRoute, useRouter} from "vue-router";

export default {
  name: "Login",
  setup() {
    const $q = useQuasar()
    const store = useStore()

    const username = ref('')
    const password = ref('')
    const accept = ref(false)
    const router = useRouter()
    const route = useRoute()

    const onsubmit = (username, password) => {
      store.dispatch("login", {username: username, password: password}).then(() => {

        //查询redirect 参数
        router.push({path: route.query.redirect || '/'})
      })
    }
    return {
      username,
      password,
      accept,
      onsubmit
    }
  }
}
</script>

<style scoped lang="less">
.login-page {
  display: flex;
  width: 100vw;
  height: 100vh;
  align-items: center;
  flex-direction: column;
  justify-content: center;


  .login-form-content {
    width: 400px;
    padding: 10px;

    .title {
      font-size: 25px;
      text-align: center;
      margin-bottom: 20px;
    }


    .form {

    }
  }


}

</style>
