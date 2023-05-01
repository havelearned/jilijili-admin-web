<template>
  <div style="padding: 20px">
    <q-markup-table flat bordered>
      <thead class="header-bg">
      <tr>
        <th colspan="5">
          <div class="row no-wrap items-center">
            <q-img
              style="width: 70px"
              :ratio="1"
              class="rounded-borders"
              src="https://cdn.quasar.dev/img/donuts.png"
            />

            <div class="music-header">
              <div>
                <div>音乐管理</div>
                <div>使用这个Piees产品管理是最简单快速有效的工作方式。</div>
              </div>

              <div>
                <q-btn color="primary" label="上架音乐"/>
              </div>

            </div>
          </div>
        </th>
      </tr>
      </thead>
    </q-markup-table>
  </div>
</template>

<script>
export default {
  name: "page-header"
}
</script>

<style scoped lang="less">
</style>
