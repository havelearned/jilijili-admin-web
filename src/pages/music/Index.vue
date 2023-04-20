<template>
  <div class="page">
    <div>
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

    <div class="content rounded-borders">
      <div class="central-content">
        <q-toolbar class="bg-blue-grey-14 text-white shadow-2 rounded-borders">


          <!--
            notice shrink property since we are placing it
            as child of QToolbar
          -->
          <q-tabs v-model="tab" shrink stretch>
            <q-tab name="tab1" label="歌手"/>
            <q-tab name="tab2" label="专辑"/>
            <q-tab name="tab3" label="歌曲"/>
          </q-tabs>
          <q-space/>
          <q-input rounded outlined dark dense standout v-model="keywords" input-class="text-right" class="q-ml-md">
            <template v-slot:append>
              <q-icon v-if="keywords === ''" name="search"/>
              <q-icon v-else name="clear" class="cursor-pointer" @click="keywords = ''"/>
            </template>
          </q-input>
          <q-btn flat label="搜索"/>
        </q-toolbar>


        <div>
          <singer :childHead="childHead" v-if="tab==='tab1'"/>
          <Album :childHead="childHead" v-if="tab==='tab2'"/>
          <Song :childHead="childHead" v-if="tab==='tab3'"/>
        </div>
      </div>
    </div>
  </div>

</template>

<script setup>
import Singer from "src/pages/music/singer/Index.vue";
import Album from "src/pages/music/album/Index.vue";
import Song from "src/pages/music/song/Index.vue";
import {ref} from "vue";


const childHead = ref(false);
const keywords = ref('');
const tab = ref('tab3');
</script>

<style scoped lang="less">
@import "src/css/music";

</style>
