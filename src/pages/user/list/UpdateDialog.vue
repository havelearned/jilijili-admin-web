<template>
  <div class="page">
    <q-dialog v-model="fixed" @hide="$emit('hide')" allow-focus-outside>
      <q-card>
        <q-card-section>
          <div class="text-h5"><strong>修改</strong>
            <q-icon name="question_mark"/>
            <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]">
              <strong>id,昵称,性别不需要设置,</strong>创建的用户默认是开启的, <em></em>
              (
              <q-icon name="keyboard_arrow_up"/>
              )
            </q-tooltip>
          </div>

        </q-card-section>
        <q-separator/>

        <q-card-section class="scroll q-pt-lg-none">
          <q-form
            @submit="onSubmit"
            @reset="onReset" class="flex justify-between">

            <q-item-section>
              <div class="q-pa-md">
                <q-input label="用户名"
                         hint=""
                         v-model="userInfo.username"
                         ref="userInfo.username"
                         lazy-rules
                         :rules="[value => value.length >=6 || '用户名不能少于6个字符']"
                         filled/>
                <q-input label="昵称"
                         hint=""
                         v-model="userInfo.nickname"
                         ref="userInfo.username"
                         lazy-rules
                         filled/>
                <q-select standout v-model="userInfo.gender"
                          ref="userInfo.gender"
                          :options="selectGender"
                          :dense="false"
                          :options-dense="true">
                  <template v-slot:append>
                    <q-avatar>
                      <img src="https://cdn.quasar.dev/logo-v2/svg/logo.svg" alt="">
                    </q-avatar>
                  </template>
                </q-select>


                <!--                <q-input label="密码" :rules="[value => value.length>=6 || '密码名不能少于6个字符']"-->
                <!--                         hint="必填"-->
                <!--                         lazy-rules-->
                <!--                         v-model="userInfo.password" filled-->
                <!--                         type="password"/>-->
              </div>

              <q-separator/>
              <q-card-actions>
                <div class="q-pa-md justify-center">
                  <q-btn label="修改" type="onSubmit" color="primary" class="q-ml-sm"/>
                  <q-btn label="取消" color="primary" v-close-popup class="q-ml-sm"/>
                </div>
                <q-btn label="删除" color="negative" @click="confirmDeleted(userInfo.id)" class="q-ml-sm"/>
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
import {useQuasar} from "quasar";
import {update,deleted} from "src/api/user";
import {useNotify} from "src/composables/useNotify";
import {useDialog} from "src/composables/useDialog";
const $q = useQuasar()
const fixed = ref(true)
const bar = ref(null)
const props = defineProps({
  currentRow: {
    type: Object,
    default: {}
  }
})
const selectGender=["FEMALE","MALE","UNKNOWN","ALL"]
const {negativeNotify,positiveNotify} = useNotify()
const {confirmDialog} =useDialog()

// 用户数据
const userInfo = ref({
  id: props.currentRow.id,
  username: props.currentRow.username,
  nickname: props.currentRow.nickname,
  gender: props.currentRow.gender
})


const onSubmit = () => {
  bar.value.start()
  update(userInfo.value).then(response=>{
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
const confirmDeleted = (id) =>{
  confirmDialog("删除","确定要删除吗").then(res=>{
    if(res===1){
      // 确定删除
      bar.value.start()
      deleted(id).then(response=>{
        if(response.code === 200){
          positiveNotify(response.message)
          fixed.value=false
        }else{
          negativeNotify(response.message)
        }

      }).finally(()=>{
        bar.value.stop()
      })

    }else if(res===0){
      //取消
    }

  })
  console.log("id=>",id)
}

const onReset = () => {
  console.log("onRest")
}

</script>

<style scoped lang="less">

.page {
  width: 200px;
  height: 400px;
}

</style>
