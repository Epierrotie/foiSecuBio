<template>
  <div id="home" class="container">
    <div>
      <video ref="video" id="video" width="640" height="480" autoplay></video>
    </div>
    <div>
      <b-button id="snap" v-on:click="capture()">Snap Photo</b-button>
    </div>
    <canvas ref="canvas" id="canvas" width="640" height="480"></canvas>
    <img v-bind:src="image" height="50" />
    <section>
      <b-field class="file">
        <b-upload v-model="file">
          <a class="button is-primary">
            <b-icon icon="upload"></b-icon>
            <span>Click to upload</span>
          </a>
        </b-upload>
        <span class="file-name" v-if="file">{{ file.name }}</span>
      </b-field>
    </section>
    <div>
      <b-button id="send" v-on:click="encrypt()">Encrypt</b-button>
      <b-button id="send" v-on:click="decrypt()">Decrypt</b-button>
    </div>
  </div>
</template>

<script>
import FaceRecognition from '@/services/FaceRecognition'
import axios from 'axios'
import firebase from 'firebase/app'
import 'firebase/auth'

export default {
  name: 'Home',
  data () {
    return {
      video: {},
      canvas: {},
      image: null,
      file: null
    }
  },
  mounted () {
    this.video = this.$refs.video
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
        this.video.srcObject = stream
      })
    }
  },
  methods: {
    capture () {
      this.canvas = this.$refs.canvas
      this.canvas.getContext('2d').drawImage(this.video, 0, 0, 640, 480)
      this.image = this.canvas.toDataURL('image/png')
    },
    async encrypt () {
      try {
        if (this.image && this.file) {
          const res = await FaceRecognition.enroll(this.image, firebase.auth().currentUser.email)
          console.log(res)
          if (res.data.Errors) {
            alert('🤕 ' + res.data.Errors[0].Message)
          } else {
            let form = new FormData()
            form.append('file', this.file)
            const file = await axios({
              method: 'post',
              url: 'https://us-central1-secudubio-46ed5.cloudfunctions.net/encrypt',
              data: form,
              headers: {'Content-Type': 'multipart/form-data'}
            })
            this.saveFile(file.data)
            console.log(file)
          }
        } else {
          alert('🤕 Take a photo and select a file before encrypting')
        }
      } catch (e) {
        alert('🤕 ' + e)
      }
    },
    async decrypt () {
      try {
        if (this.image && this.file) {
          const res = await FaceRecognition.verify(this.image, firebase.auth().currentUser.email)
          console.log(res)
          if (res.data.Errors) {
            alert('🤕 ' + res.data.Errors[0].Message)
          } else {
            if (res.data.images[0].transaction.confidence > 0.5) {
              let form = new FormData()
              form.append('file', this.file)
              const file = await axios({
                method: 'post',
                url: 'https://us-central1-secudubio-46ed5.cloudfunctions.net/decrypt',
                data: form,
                headers: {'Content-Type': 'multipart/form-data'}
              })
              this.saveFile(file.data)
              console.log(file)
            } else {
              alert('🤕 This file doesn\'t belong to you ! Thief !')
            }
          }
        } else {
          alert('🤕 Take a photo and select a file before decrypting')
        }
      } catch (e) {
        alert('🤕 ' + e)
      }
    },
    saveFile (file) {
      const blob = new Blob([file], {type: 'text/plain'})
      const e = document.createEvent('MouseEvents')
      const a = document.createElement('a')
      a.download = 'File'
      a.href = window.URL.createObjectURL(blob)
      a.dataset.downloadurl = ['text/json', a.download, a.href].join(':')
      e.initEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
      a.dispatchEvent(e)
    }
  }
}
</script>

<style scoped>
body {
  background-color: #f0f0f0;
}

#video {
  background-color: #000000;
}

#canvas {
  display: none;
}

li {
  display: inline;
  padding: 5px;
}
</style>
