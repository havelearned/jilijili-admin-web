<template>
  <div class="login-page">
    <q-card class="my-card   login-form-content">
      <div class="title">肌理音乐后台</div>
      <q-form class="q-gutter-md form" @submit="submit">
        <q-input
          filled
          v-model.t.trim="form.username"
          label="账号"
          hint="Account | Mobile number"
          square
          dense
          debounce="500"
          placeholder="用户名："
          hide-bottom-space
          lazy-rules
          :rules="[ val => val && val.length > 0 || '账号不正确']"
        />
        <q-input
          filled
          clear-icon="cancel"
          v-model.trim="form.password"
          :type="isPwd ? 'password' : 'text'"
          label="密码"
          placeholder="密码："
          debounce="500"
          hide-bottom-space
          lazy-rules
          square
          :rules="[ val => val && val.length > 0 || '请输入密码']"
        >
          <template v-slot:append>
            <q-icon
              :name="isPwd ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="isPwd = !isPwd"
            />
          </template>
        </q-input>

        <q-input
          outlined
          dense
          debounce="500"
          v-model="form.captcha"
          placeholder="验证码："
          bg-color="white"
          lazy-rules
          hide-bottom-space
          square
          :rules="[(val) => (val && val.length > 0) || '请输入验证码']"
        >
          <template v-slot:after>
            <img id="captcha" class="codeImage cursor-pointer" @click="captcha"/>
          </template>
        </q-input>
        <div class="row">
          <q-checkbox color="green-5" v-model="autoLogin" label="记住密码" />
          <q-space/>
        </div>


        <div>
          <q-btn
            dense
            unelevated
            label="登 录"
            size="17px"
            color="secondary"
            class="full-width no-border-radius q-pa-none"
            type="submit"
            :loading="loading"
          >
            <template v-slot:loading>
              <q-spinner-ios class="on-left"/>
              登录...
            </template>
          </q-btn>
        </div>
      </q-form>
    </q-card>
  </div>

</template>

<script>

import {uid} from 'quasar'
import {ref} from 'vue'
import store from "src/store";
import {useNotify} from "src/composables/useNotify";

export default {
  name: "Login",
  data() {
    return {
      form: {
        username: 'admin',
        password: '123456',
        captcha: '',
        checkKey: '',
      },
      isPwd: true,
      loading: false,
      autoLogin:true,
    }
  },
  methods: {
    captcha() {
      this.form.checkKey = uid();
      this.$api.get(`/tokens/randomImage/${this.form.checkKey}`).then((res) => {
        document.getElementById("captcha").src = res.data;
      });
    },
    submit() {
      console.log("备案登记了")
      this.loading = true;
      // 登录操作
      store.dispatch("login", this.form).then(() => {
        // 获取当前用户
        store.dispatch('fetchCurrentUser').then(currentUser => {
          // 是否有资格登录
          let superAdmin = currentUser.roles.find(role => role.name === "ROLE_SUPER_ADMIN")
          if (superAdmin) {
            //查询redirect 参数
            this.$router.push({path: this.$route.query.redirect || '/'})
          } else {
            store.dispatch("logout")
            useNotify('你的权限无法访问后台')
          }
        })
      })
      this.loading = false
    }
  },
  mounted() {
    this.captcha()
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
  background-image: url("../assets/images/JilijiliBG.png");
  position: fixed;
  background-size: 100% 100%;


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
