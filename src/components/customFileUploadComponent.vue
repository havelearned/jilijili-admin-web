<!-- TODO 文件上传组件回显-->

<template>
  <div class="q-pa-md  column">
    <div class="col-6">
      <q-file filled counter hide-hint hide-bottom-space
              :multiple="multiple"
              label="上传文件"
              :max-files="maxFiles"
              :max-total-size="maxTotalSize"
              :accept="accept"
              :counter-label="counterLabelFn"
              v-model="files"
              @update:modelValue="updateModelValue"
      >
        <template v-slot:after v-if="files.length>=1">
          <q-btn color="primary" dense icon="cloud_upload" round @click="uploadFiles"/>
        </template>
        <template v-slot:file="{ index, file }">

        </template>
        <template v-slot:append>

          <q-btn flat label="记得点击上传文件"/>
        </template>
      </q-file>
    </div>
    <!--  图片列表  -->
    <div class="row" v-if="accept==='image/*'">
      <q-img v-for="(item, index) in files"
             fit="cover" width="200px" height="200px" spinner-color="white"
             :key="index"
             :src="convertObjectUrl(item)"
             @dblclick="imgDblclick(item,index)"
             class="col-2 q-ma-lg ">
        <template v-slot:default>
          <q-toolbar>
            <q-tooltip anchor="bottom middle">双击看大图</q-tooltip>
            <strong>{{ ellipsis(item.name, 25) }}</strong>
            <q-space/>
            <q-btn icon="clear" color="red" size="xs" round @click="removeItem(index)" v-ripple/>
          </q-toolbar>

          <q-icon class="qimg_content" v-if="status === 0" name="hourglass_bottom" size="50px"></q-icon>
          <q-icon class="qimg_content" color="green" v-if="status === 1" name="add_task" size="50px"></q-icon>
          <q-icon class="qimg_content" color="red" v-if="status === 3" name="file_upload_off" size="50px"></q-icon>

        </template>
      </q-img>
      <!-- 使用 q-dialog 组件来实现全屏浏览 -->
      <q-dialog ref="dialogFullscreen" square position="standard">
        <q-item-section>
          <q-carousel vertical padding arrows swipeable animated thumbnails infinite
                      v-model="fullscreen.image.value"
                      control-color="primary">
            <q-carousel-slide v-for="(item,index) in files" :name="index" :img-src="convertObjectUrl(item)"/>
          </q-carousel>
        </q-item-section>
      </q-dialog>
    </div>

    <!-- 音频文件  -->
    <div class="row" v-else-if="accept==='audio/*'">
      <q-card v-for="(file,index) in files" class=" q-ma-md">
        <q-toolbar>
          <q-tooltip anchor="top middle">{{ file.name }}</q-tooltip>
          <strong>{{ ellipsis(file.name, 25) }}</strong>
          <q-space/>
          <q-btn v-if="status===0" icon="clear" color="red" size="xs" round @click="removeItem(index)" v-ripple/>
          <q-btn v-if="status===1" disable icon="add_task" color="green" size="xs" round @click="removeItem(index)"
                 v-ripple/>
          <q-btn v-if="status===2" icon="file_upload_off" color="red" size="xs" round @click="removeItem(index)"
                 v-ripple/>

        </q-toolbar>
        <audio :src="convertObjectUrl(file)" controls></audio>
      </q-card>
    </div>

    <!--  视频文件  -->
    <div class="row" v-else-if="accept==='video/*'">
      <q-card class="q-ma-md" v-for="(file,index) in files" style="width: 200px;height: 200px">
        <q-toolbar>
          <q-tooltip anchor="top middle">{{ file.name }}</q-tooltip>
          <strong>{{ ellipsis(file.name, 25) }}</strong>
          <q-space/>
          <q-btn v-if="status===0" icon="clear" color="red" size="md" round @click="removeItem(index)" v-ripple/>
          <q-btn v-if="status===1" disable icon="add_task" color="green" size="md" round @click="removeItem(index)"
                 v-ripple/>
          <q-btn v-if="status===2" icon="file_upload_off" color="red" size="md" round @click="removeItem(index)"
                 v-ripple/>
        </q-toolbar>
        <video :src="convertObjectUrl(file)" controls width="200" height="200"></video>
      </q-card>
    </div>
    <div class="row" v-else-if="accept==='application/*'">
      <q-card class="q-ma-md" v-for="(file,index) in files">
        <q-toolbar>
          <q-tooltip anchor="top middle">{{ file.name }}</q-tooltip>
          <strong>{{ ellipsis(file.name, 25) }}</strong>
          <q-space/>
          <q-btn v-if="status===0" icon="clear" color="red" size="xs" round @click="removeItem(index)" v-ripple/>
          <q-btn v-if="status===1" disable icon="add_task" color="green" size="xs" round @click="removeItem(index)"
                 v-ripple/>
          <q-btn v-if="status===2" icon="file_upload_off" color="red" size="xs" round @click="removeItem(index)"
                 v-ripple/>
        </q-toolbar>
        <q-card-section>
          <q-img src="@/assets/icon/excel.svg" fit="cover"/>
        </q-card-section>
      </q-card>
    </div>

    <div class="row" v-else>
      <q-card class="q-ma-md" v-for="(file,index) in files">
        <q-toolbar>
          <q-tooltip anchor="top middle">{{ file.name }}</q-tooltip>
          <strong>{{ ellipsis(file.name, 25) }}</strong>
          <q-space/>
          <q-btn v-if="status===0" icon="clear" color="red" size="xs" round @click="removeItem(index)" v-ripple/>
          <q-btn v-if="status===1" disable icon="add_task" color="green" size="xs" round @click="removeItem(index)"
                 v-ripple/>
          <q-btn v-if="status===2" icon="file_upload_off" color="red" size="xs" round @click="removeItem(index)"
                 v-ripple/>
        </q-toolbar>
        <q-card-section>
          <q-img src="@/assets/icon/otherfile.svg" fit="cover"/>
        </q-card-section>
      </q-card>
    </div>


    <q-inner-loading label="文件上传中，请勿关闭或者离开此界面" label-class="text-teal" label-style="font-size: 1.1em"
                     :showing="visible">

    </q-inner-loading>
  </div>

</template>

<script>


import {uploadUrl} from "@/boot/api/urlConstant";
import {useNotify} from "@/boot/useNotify";
import {ellipsis} from "@/boot/datatype";

export default {
  props: {
    urls: {required: true,},
    multiple: {type: Boolean, default: true},
    maxTotalSize: {type: String, default: '100000000'},
    maxFiles: {type: Number, default: 50},
    accept: {type: String, default: 'image/*'},
    uploadUrl: {type: String, default: uploadUrl},
  },
  data() {
    return {
      files: [],
      _urls: this.urls,
      visible: false,
      speedOfProgress: 0, //进度值
      fullscreen: {
        image: {
          url: '',
          value: 1,
        }
      },
      status: 0,  // 0 ,1,2
    };
  },
  emits: ['update:urls'],
  watch: {
    _urls(newValue) {
      this._urls = newValue
      this.$emit('update:urls', newValue)
    },
  },
  created() {
    console.log("this.urls", this.urls)
    if (!this.multiple) {
      if (this.urls) {
        this.handleAsync();
      }
      return;
    }
    this.urls.forEach(async (url, index) => {
      try {
        let file = undefined
        switch (this.accept) {
          case 'image/*':
            file = await this.urlToFile(url, `file${index}.jpg`);
            break;
          case 'audio/*':
            file = await this.urlToFile(url, `audioItem:${index}`);
            break;
          case 'video/*':
            file = await this.urlToFile(url, `videItem:${index}`);
            break;
          case 'application/*':
            file = await this.urlToFile(url, `application:${index}`);
            break;
          default:
            file = await this.urlToFile(url, `其他文件Item:${index}`);
            break;
        }
        this.files.push(file);
      } catch (error) {
        console.error(`Error fetching ${url}:`, error);
      }
    });

  },
  methods: {
    ellipsis,
    uploadFiles() {
      if (this.files.length <= 0) {
        useNotify().warningNotify('请先选择文件')
        return
      }
      this.visible = true

      // 创建 FormData 对象
      const formData = new FormData();
      this.files.forEach(item => {
        formData.append('files', item);
      })
      this.$axios.post(this.uploadUrl, formData, {
        headers: { //头部参数
          'Content-Type': `multipart/form-data; boundary=--------------------------${new Date().getTime()}`
        }
      }).then(res => {
        if (res.flag) {
          if (this.multiple) {
            this._urls = res.data
          } else {
            this._urls = res.data[0]
          }
          useNotify().positiveNotify(res.message)
        } else { // 失败
          useNotify().positiveNotify(res.message)
          useNotify().positiveNotify(res.data)
          this.status = 2
        }
      }).catch(error => {
        this.status = 2
        console.log(error)
      }).finally(() => {
        this.visible = false
        this.status = 1

      })
    },
    // URL并返回对应的File对象
    async urlToFile(url, fileName) {
      const response = await fetch(url);
      const data = await response.blob();
      return new File([data], fileName, {type: response.headers.get('content-type')});
    },
    convertObjectUrl(file) {
      if (file instanceof File) {
        return URL.createObjectURL(file)
      }
      return ""
    },
    updateModelValue(value) {
      this.status = 0
      if (!this.multiple) {
        if (value instanceof File) {
          this.files = []
          this.files.push(value)
        }
        return
      }
      // 在此处理更新 files 的逻辑，确保每个元素是正确的 File 对象
      this.files = value.map((file) => {
        if (file instanceof File) {
          return file;
        } else {
          // 如果不是 File 对象，则根据实际情况进行转换，比如根据文件名创建一个新的 File 对象
          // 例如：return new File([file], 'custom_file_name.txt', { type: 'text/plain' });
        }
      });

    },
    counterLabelFn({totalSize, filesNumber, maxFiles}) {
      return `当前${filesNumber}个文件\n 最多:${maxFiles}个文件\n 总大小: ${totalSize}`
    },
    removeItem(index) {
      this.files.splice(index, 1);
    },
    imgDblclick(file, index) {
      this.$refs.dialogFullscreen.show()
      this.fullscreen.image.value = index
    },
    async handleAsync() {
      let file = await this.urlToFile(this.urls, "file");
      this.files.push(file);

    },


  }
  ,
}
;
</script>

<style scoped lang="css">
.qimg_content {
  margin-left: 80px;
  margin-top: 100px;
}
</style>
