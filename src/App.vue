<template>
  <div>
    <div class="container mt-10">
      <div class="card bg-white">
        <img :src="image" alt="" style="">
        <input type="file" @change="handleImage" class="custom-input" accept="image/*">
      </div>
    </div>
  </div>
</template>

<script>
  import axios from 'axios';
  export default {
    // 应用名称
    name: 'App',
    // 数据容器
    data() {
      return {
        image: '',
        remoteUrl: ''
      }
    },
    // 方法
    methods: {
      // 1. 获取上传的图片
      handleImage(e) {
        const selected_Image = e.target.files[0];
        // 2. 执行 base64 编码
        this.createBase64Image(selected_Image);
      },
      // 3. base64 编码函数
      createBase64Image(fileObject) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.image = e.target.result;
          // 4. 执行上传
          this.uploadImage();
        }
        reader.readAsDataURL(fileObject);
      },
      // 5. 上传图片
      uploadImage() {
        const {
          image
        } = this;
        // 6. 发起 http 请求，后端函数在 server.js 中
        axios.post('http://127.0.0.1:8081/upload', {
            image
          })
          // 7. 获取后端返回的图片地址
          .then((response) => {
            this.remoteUrl = response.data.url;
            // 8. 打开新窗口打开 http://127.0.0.1:8081/showpano ，也就是处理结果
            window.open('http://127.0.0.1:8081/showpano');
          })
          .catch((err) => {
            // 9. 错误处理
            return new Error(err.message);
          })
      }
    },

  }

</script>

<style>
  * {
    font-family: Arial, Helvetica, sans-serif;
  }

  body {
    background: #d8dddb;
  }

  .container {
    display: flex;
    justify-content: center;
  }

  .mt-10 {
    margin-top: 10rem;
  }

  .bg-white {
    background: #fff;
  }

  .card {
    height: 10rem;
    width: 20rem;
    border-radius: 10px;
    padding: 20px;
    text-align: center;
  }

  img {
    width: 17em;
  }

</style>
