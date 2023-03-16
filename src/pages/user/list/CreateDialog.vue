<template>
  <div class="page">
    <q-dialog v-model="fixed" @hide="$emit('hide')">
      <q-card>
        <q-card-section>
          <div class="text-h5"> <strong>添加用户</strong>
            <q-icon name="question_mark"/>
            <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]">
              <strong>id,昵称,性别不需要设置,</strong>创建的用户默认是开启的, <em></em>
              (<q-icon name="keyboard_arrow_up"/>)
            </q-tooltip>
          </div>

        </q-card-section>
        <q-separator/>

        <q-card-section class="scroll">
          <q-form
            @submit="onSubmit"
            @reset="onReset" class="flex justify-between">

            <q-item-section>
              <div class="q-pa-md">
                <q-input label="用户名"
                         hint="必填"
                         v-model="userInfo.username"
                         ref="userInfo.username"
                         lazy-rules
                         :rules="[value => value.length >=6 || '用户名不能少于6个字符']"
                         filled/>


                <q-input label="密码" :rules="[value => value.length>=6 || '密码名不能少于6个字符']"
                         hint="必填"
                         lazy-rules
                         v-model="userInfo.password" filled
                         type="password"/>
              </div>

              <q-separator/>
              <q-card-actions>
                <div class="q-pa-md justify-center">
                  <q-btn label="添加" type="onSubmit" color="primary"  class="q-ml-sm" />
                  <q-btn label="取消" type="onReset" color="primary" v-close-popup class="q-ml-sm"/>
                </div>
              </q-card-actions>

            </q-item-section>


          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-ajax-bar
      ref="bar"
      position="bottom"
      color="accent"
      size="10px"
      skip-hijack
    />
  </div>
</template>

<script setup>
import {ref} from "vue";
import {add} from 'src/api/user.js'
import {useQuasar} from "quasar";
import {useNotify} from "src/composables/useNotify";

const $q = useQuasar()

const fixed = ref(true)
const bar = ref(null)
// 用户数据
const userInfo = ref({
  username: "",
  password: "",
})
const {negativeNotify,positiveNotify} = useNotify()

const onSubmit = () => {
  bar.value.start()

  // 添加用户
  add(JSON.stringify(userInfo.value)).then(response => {

    if(response.code === 200){
      positiveNotify(response.message)
      fixed.value=false
    }else{
      negativeNotify(response.message)
    }

  }).finally(()=>{
    bar.value.stop()
  })
}

const onReset = () => {


}


</script>

<style scoped lang="less">

.page {

}

</style>
