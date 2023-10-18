<template>
  <div class="q-page">
    <q-card class="full-width">

      <q-img src="https://img-prod-cms-rt-microsoft-com.akamaized.net/cms/api/am/imageFileData/RE4wpp7?ver=64b1"
             fit="fill" height="350px">
        <template v-slot:default>
          <q-toolbar class="text-white">
            <q-toolbar-title>我的信息</q-toolbar-title>
            <q-btn flat round dense icon="qr_code_scanner">
              <q-tooltip>生成二维码</q-tooltip>
            </q-btn>
          </q-toolbar>

          <div class="absolute-center" style="background: none">
            <q-btn round flat>
              <template v-slot:default>
                <q-avatar size="100px">
                  <img v-if="form.avatar" :src="form.avatar">
                  <img v-else src="@/assets/images/default-logo.png">
                </q-avatar>
                <q-popup-proxy transition-show="flip-up" transition-hide="flip-down">
                  <q-file v-model="fileMode" label="选择文件">
                    <template v-slot:after>
                      <q-btn>更改</q-btn>
                    </template>
                  </q-file>
                </q-popup-proxy>
                <q-tooltip>更换头像</q-tooltip>
              </template>
            </q-btn>

          </div>
          <div class="row column absolute-bottom-right full-width">
            <div class="col-12 ">
              <h5>{{ form.username }}
                <q-popup-proxy transition-show="flip-up" transition-hide="flip-down">
                  <q-input v-model="form.username" type="text" label="更改名称" maxlength="32"/>
                </q-popup-proxy>
              </h5>
              <div class="text-amber-1">
                <q-popup-proxy transition-show="flip-up" transition-hide="flip-down">
                  <q-input v-model="form.phonenumber" type="number" label="联系方式" filled/>
                  <q-input v-model="form.email" type="email" label="邮箱" filled/>
                </q-popup-proxy>
                {{ form.phonenumber }} {{ form.email }}
              </div>
            </div>
            <div>
              {{ ellipsis(form.lastLoginTime + form.lastLoginIp) }}
              <q-popup-proxy transition-show="flip-up" transition-hide="flip-down">
                <q-input v-model="form.lastLoginTime" type="text" label="更改介绍" maxlength="32"/>
              </q-popup-proxy>
            </div>
          </div>
        </template>
      </q-img>
    </q-card>

    <div class="row  q-pa-md full-width " style="height: 100%;">
      <div class="col-12 row q-ma-xs q-gutter-md">
        <div class="col-3" v-for="() in 12">
          <q-card class="my-card" v-ripple>
            <q-card-section>
              {{ ellipsis('icon name') }}
            </q-card-section>
          </q-card>
        </div>
      </div>
      <div class="col-12  ">

        <q-space/>
        <q-btn-group spread flat>
          <div class="row q-ma-xs q-gutter-md">
            <q-btn class="col-12" color="purple" label="注销" icon="timeline"/>
            <q-btn class="col-12" color="purple" label="退出" icon="timeline" @click="logoutClick"/>
          </div>
        </q-btn-group>
      </div>
    </div>

  </div>
</template>

<script>
import {defineComponent} from 'vue'
import {ellipsis} from '@/boot/datatype'
import cookie from "@/boot/cookie";

export default defineComponent({
  name: "index",
  data() {
    return {
      form: {},
      src: null,
      fileMode: null,
    }
  },
  created() {
    this.form = cookie.getCookies(cookie.USERINFO)


  },
  methods: {
    ellipsis,
    logoutClick() {
      this.$store.commit('user/loginExit')
      // cookie.removeCookies(cookie.USERINFO)
      // cookie.removeLocalKey(cookie.MENULIST)
      // cookie.removeCookies(cookie.TOKENNAME)
      window.location.reload()
    }

  }
})
</script>


<style scoped>

</style>