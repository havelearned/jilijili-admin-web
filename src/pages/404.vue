<template>
  <div class="page">
    <div class="error-code">404</div>
    <div class="tips">抱款你访问的页面不存在！</div>
    <div class="action-area">
      <q-btn color="primary" type="Primary"
             @click="()=>{$router.back()}"
      >返回
      </q-btn>
      <q-btn outline
             @click="()=>{$router.push('/')}"
      >首页
      </q-btn>
    </div>
  </div>
</template>

<script>

export default {
  name: "404",
  setup() {

    return {}
  }

}
</script>

<style scoped lang="less">
.page {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  .error-code {
    font-size: 250px;
  }

  .tips {
    font-size: 20px;
    color: gray;
    margin-bottom: 20px;
  }

  .action-area {
    width: 200px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;


  }
}

</style>
