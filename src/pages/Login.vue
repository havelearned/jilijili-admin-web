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

import {QSpinnerFacebook, useQuasar} from 'quasar'
import {onBeforeUnmount, ref} from 'vue'
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

    let timer




    const onsubmit = (username, password) => {
      $q.loading.show({
        spinner: QSpinnerFacebook,
        spinnerColor: 'blue',
        spinnerSize: 140,
        backgroundColor: "gray",
        message: '正在登录',
        messageColor: 'black'
      })

      // 登录操作
      store.dispatch("login", {username: username, password: password}).then(() => {
        // 获取当前用户
        store.dispatch('fetchCurrentUser').then(currentUser => {
          // 是否有资格登录
          let superAdmin = currentUser.roles.find(role => role.name === "ROLE_SUPER_ADMIN")
          $q.loading.hide()
          if (superAdmin) {
            //查询redirect 参数
            router.push({path: route.query.redirect || '/'})
          } else {
            store.dispatch("logout")
            $q.notify({
              position: "top",
              message: "你的权限无法访问后台",
              icon: 'announcement',
              color: "negative"
            })
          }
        })
      })
    }
    return {
      username,
      password,
      accept,
      onsubmit,


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
