<template>
  <div style="height: 20px">
    <div id="aplayer"></div>
  </div>
</template>

<script>
import {ref, defineComponent} from 'vue';
import APlayer from 'aplayer';

export default defineComponent({
  name: "index",
  props: {
    audio: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      ap: null
    }
  },
  mounted() {
    this.ap = new APlayer({
      container: document.getElementById('aplayer'),
      listFolded: false,
      listMaxHeight: 90,
      lrcType: 3,
      fixed: false,
      audio: {
        name: ' ',
        artist: ' ',
        // url: undefined,
        // cover: undefined,
        // lrc: undefined,
      },
    })
    this.$bus.on("send-audioData", (audioData) => {
      console.log("播放的音乐信息=>", audioData)
      this.ap.list.clear()
      this.ap = new APlayer({
        container: document.getElementById('aplayer'),
        listFolded: false,
        lrcType: 3,
        fixed: false,
        theme: '#636667',
        audio: audioData
      })
      this.ap.toggle()
    })

    this.$bus.on('send-playOr-pause', (param) => {
      this.ap.toggle()
    })

  },
})
</script>

<style scoped>
@import "@/assets/css/aplayer.min.css";

</style>