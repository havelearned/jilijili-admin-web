<template>
  <q-page class="cc-admin" >
    <div>
      <q-card class="my-card q-ma-sm">
        <q-card-section>
          <q-tabs v-model="tab" narrow-indicator dense align="justify">
            <q-tab class="text-purple" name="1" icon="library_music" label="歌曲管理"/>
            <q-tab class="text-orange" name="2" icon="lyrics" label="歌手管理"/>
            <q-tab class="text-teal" name="3" icon="album" label="专辑管理"/>
          </q-tabs>
        </q-card-section>
      </q-card>
    </div>

    <q-scroll-area style="height: 70vh" >
      <song v-if="tab==='1'"/>
      <singer v-if="tab==='2'"/>
      <album v-if="tab==='3'"/>
    </q-scroll-area>

  </q-page>
</template>
<script>
import {defineComponent} from 'vue'
import Song from "@/views/music/song/index.vue";
import singer from "@/views/music/singer/index.vue";
import album from "@/views/music/album/index.vue";
import Menus from "@/layout/menu/index.vue";

export default defineComponent({
  name: "index",
  components: {Menus, Song, singer, album},
  data() {
    return {
      tab: '1',
    }
  },
  methods: {

  },
  mounted() {
  }
})
</script>

<style scoped>

</style>