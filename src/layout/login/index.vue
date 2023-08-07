<template>
  <q-layout class="cc-admin">
    <q-page-container>
      <q-page class="login-register-page">
        <div class="login-register-card" style="width: 500px;height: 400px;margin: 100px auto 0;">
          <q-card>

            <div class="text-h6 text-center  q-pa-md">
              <q-avatar><img src="@/assets/logo.svg" alt=""></q-avatar>Jill-Admin Login
            </div>
            <q-card-section>
              <q-tabs v-model="activeTab" dense align="justify">
                <q-tab name="login">登录</q-tab>
                <q-tab name="register" disable>注册</q-tab>
              </q-tabs>
            </q-card-section>
            <q-card-section>
              <q-tab-panels v-model="activeTab">
                <q-tab-panel name="login">
                  <q-form @submit="login" class="q-gutter-md">
                    <div class="row q-col-gutter-x-md dialog_form q-pa-md">
                      <div class="col-12">
                        <q-input
                            outlined dense debounce="500" lazy-rules placeholder="用户名：" hide-bottom-space
                            bg-color="white" square
                            v-model.trim="loginData.username"
                        >
                          <template v-slot:before>
                            <div class="text-h6">
                              账号:
                            </div>
                          </template>
                        </q-input>
                      </div>
                      <div class="text-h6 col-12">
                        <q-input
                            outlined :type="isPwd ? 'password' : 'text'" dense bg-color="white" placeholder="密码：" debounce="500" hide-bottom-spacelazy-rules square
                            v-model.trim="loginData.password">
                          <template v-slot:before>
                            <div class="text-h6">
                              密码:
                            </div>
                          </template>
                          <template v-slot:append>
                            <q-icon
                                :name="isPwd ? 'visibility_off' : 'visibility'"
                                class="cursor-pointer"
                                @click="isPwd = !isPwd"
                            />
                          </template>
                        </q-input>
                      </div>
<!--                      <div class="row q-pa-md ">
                        <div class="cc-login-form-item col-12">
                          <q-input
                              outlined
                              v-model.trim="loginData.captcha"
                              dense
                              debounce="500"
                              placeholder="验证码："
                              bg-color="white"
                              lazy-rules
                              hide-bottom-space
                              square>
                            <template v-slot:after>
                              <img :src="verificationImg" @click="captcha">
                            </template>
                          </q-input>
                        </div>
                      </div>-->
                      <div class="col-12">
                        <q-btn
                            dense
                            unelevated
                            label="登 录"
                            size="17px"
                            color="black"
                            class=" full-width no-border-radius q-pa-none"
                            type="submit"
                            :loading="loading">
                          <template v-slot:loading>
                            <q-spinner-ios class="on-left"/>
                            登录...
                          </template>
                        </q-btn>
                      </div>
                    </div>
                  </q-form>
                </q-tab-panel>
                <q-tab-panel name="register">
                  <div class="text-h6">Register</div>
                  <q-form @submit="register">
                    <q-input
                        outlined
                        v-model="registerData.username"
                        label="Username"
                        dense
                    ></q-input>
                    <q-input
                        outlined
                        v-model="registerData.password"
                        label="Password"
                        type="password"
                        dense
                    ></q-input>
                    <q-input
                        outlined
                        v-model="registerData.email"
                        label="Email"
                        dense
                    ></q-input>
                    <q-btn
                        type="submit"
                        label="Register"
                        color="primary"
                        class="q-mt-md"
                        dense
                    ></q-btn>
                  </q-form>
                </q-tab-panel>
              </q-tab-panels>
            </q-card-section>
          </q-card>
        </div>


      </q-page>
    </q-page-container>
  </q-layout>


</template>

<script>

import {axiosInstance} from "@/boot/api/request";
import Cookie from "@/boot/cookie";
import {useNotify} from "@/boot/useNotify";

export default {
  components: {},
  data() {
    return {
      activeTab: 'login',
      loginData: {
        username: 'admin',
        password: '123456',
        timestamp: null,
        loginType: 'DEFAULT'
      },
      registerData: {
        username: '',
        password: '',
        email: '',
      },
      autoLogin: true,
      isPwd: true,
      loading: false,
      verificationImg: 'null',
      dragging: false,
      startX: 0,
      thumbPosition: '0px',
      message: 'Slide to verify',
    };
  },
  mounted() {

    this.captcha();
  },
  methods: {
    login() {
      // Cookie.setCookies(Cookie.TOKENNAME, "dasffsd");
      // this.$store.commit('setToken', "fasdfasdf")
      // this.$router.push('/home');
      //
      // return


      this.$store.dispatch('user/loginActions', this.loginData).then(res => {
        if (res.flag) {
          this.$axios.get('/sysUser/me', {params: {token: res.data}}).then(res => {
            console.log("me=>", res)
            Cookie.setCookies(Cookie.USERINFO, res.data)

            this.$axios.get("/sysUser/menulist", {params: {userId: res.data.userId}}).then(res_3 => {
              if (res_3.flag) {
                Cookie.setLocalKeyValue(Cookie.MENULIST, res_3.data)
                useNotify().infoNotify(res.message)
                this.$router.push('/home');
              }

            }).catch(error => {
              console.log("menulist-error=>", error)
            })
          }).catch(err => {
            console.log("me-err=>", err)
          })
        }
      }).catch(err => {
        console.log('login-err', err)
      })


    },
    register() {
      // 在此处编写注册逻辑
      console.log('Register Data:', this.registerData);
      // 根据实际需求进行注册操作，例如发送注册请求等
    },
    captcha() {
      this.loginData.timestamp = new Date().getTime();
      this.$axios.get("/sysUser/captcha", {
        params: {
          timestamp: this.loginData.timestamp
        }
      }).then(res => {
        if (res.flag) {
          this.verificationImg = 'data:image/png;base64,' + res.data
        } else {
          this.$q.notify({
            color: 'white',
            textColor: 'red',
            message: '请求错误',
            position: 'center',
            timeout: 2000,
          })
        }
      }).catch(err => {
        console.log(err)
      })
    },


  },
};
</script>

<style scoped>


</style>
