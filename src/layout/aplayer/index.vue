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
        url: 'http://8.130.75.158:9000/jilijili-project/audio/2a1093303c7a45c056feb8e6454d0e0c.mp3',
        cover: 'http://8.130.75.158:9000/jilijili-project/images/01a2e05612193dc182a1a54ff2b23951.jpg',
        lrc: 'http://8.130.75.158:9000/jilijili-project/other/0d529b9af5ebac5657af772b4412d4c4.lrc',
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