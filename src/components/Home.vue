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
    <div>
      <b-button id="send" v-on:click="encrypt()">Encrypt</b-button>
      <b-button id="send" v-on:click="decrypt()">Decrypt</b-button>
    </div>
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
  </div>
</template>

<script>
import FaceRecognition from '@/services/FaceRecognition'
import axios from 'axios'

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
      if (this.image && this.file) {
        const res = await FaceRecognition.enroll(this.image, 'Joffrey')
        console.log(res.data)
        console.log(this.file)
        let form = new FormData()
        form.append('file', this.file)
        axios({
          method: 'post',
          url: 'https://us-central1-secudubio-46ed5.cloudfunctions.net/encrypt',
          data: form,
          headers: {'Content-Type': 'multipart/form-data'}
        })
          .then(r => {
            console.log(r)
          })
          .catch(e => {
            console.log(e)
          })
      } else {
        alert('🤕 Take a photo and select a file before encrypting')
      }
    },
    async decrypt () {
      try {
        if (this.image && this.file) {
          const res = await FaceRecognition.verify(this.image, 'Joffrey')
          console.log(res.data)
          if (res.data.Errors) {
            alert('🤕 ' + res.data.Errors[0].Message)
          } else {
            let form = new FormData()
            form.append('file', this.file)
            axios({
              method: 'post',
              url: 'https://us-central1-secudubio-46ed5.cloudfunctions.net/decrypt',
              data: form,
              headers: {'Content-Type': 'multipart/form-data'}
            })
              .then(r => {
                console.log(r)
              })
              .catch(e => {
                console.log(e)
              })
            //  console.log(file)
          }
        } else {
          alert('🤕 Take a photo and select a file before decrypting')
        }
      } catch (e) {
        alert('🤕 ' + e)
      }
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
