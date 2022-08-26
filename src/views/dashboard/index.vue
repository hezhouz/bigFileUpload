<template>
  <div class="dashboard-container">
    <div class="dashboard-text">name: {{ name }}</div>
    <hr />

    <input type="file" @change="handleFileChange" />
    <el-button @click="handleUpload">upload</el-button>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { upLoadFile } from "@/api/upload"
// 切片大小
const SIZE = 10 * 1024 * 1024;

export default {
  name: "Dashboard",
  computed: {
    ...mapGetters(["name"]),
  },
  data() {
    return {
      container: {
        file: null,
      },
      data: [], // 存切片数组
    };
  },
  methods: {
    handleFileChange(e) {
      const [file] = e.target.files;
      if (!file) return;
      Object.assign(this.$data, this.$options.data());
      this.container.file = file;
    },
    async handleUpload() {},

    //生成切片文件
    createFileChunk(file, size = SIZE) {
      const fileChunkList = [];
      let cur = 0;
      while (cur < file.size) {
        fileChunkList.push({ file: file.slice(cur, cur + size) });
        cur += size;
      }
      return fileChunkList;
    },
    // 上传切片
    async uploadChunks() {
      const requestList = this.data.map(({ chunk, hash }) => {
        const formData = new FormData();
        formData.append("chunk", chunk);
        formData.append("hash", hash);
        formData.append("filename", this.container.file.name);
        return { formData };
      }).map(({ formData }) => {
        upLoadFile(formData)
      });
      await Promise.all(requestList);
      // 合并切片
      await this.mergeRequest();
    },
    //  并发请求
    async handleUpload() {
      if( !this.container.file ) return;
      const fileChunkList = this.createFileChunk(this.container.file);
      this.data = fileChunkList.map(({ file }, index) => ({
        chunk: file,
        hash: this.container.file.name + "-" + index
      }))
      await this.uploadChunks()
    },
    async mergeRequest() {
      await merge(this.container.file.name)
    }
  },
};
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
