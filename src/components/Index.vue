<template>
  <div id="index" class="container">
    <form @submit.prevent="signInWithEmailAndPass">
      <b-input type="text" v-model="email" placeholder="elon.musk@tesla.io" />
      <b-input type="password" v-model="password" placeholder="**********" autocomplete />
      <div>
        <b-button>Sign-in</b-button>
      </div>
    </form>
    <form @submit.prevent="signUpWithEmailAndPass">
      <b-input type="text" v-model="email" placeholder="elon.musk@tesla.io" />
      <b-input type="password" v-model="password" placeholder="********" autocomplete />
      <div>
        <b-button type="submit">Sign-up</b-button>
      </div>
    </form>
    <b-button @click="signInWithGoogle">Login with Google</b-button>
  </div>
</template>

<script>
import firebase from 'firebase'

export default {
  name: 'Index',
  data () {
    return {
      email: '',
      password: ''
    }
  },
  methods: {
    async signInWithEmailAndPass () {
      try {
        await firebase
          .auth()
          .signInWithEmailAndPassword(this.email, this.password)
        this.$router.push({ name: 'Home' })
      } catch (e) {
        alert('🤕 ' + e.message)
      }
    },
    async signUpWithEmailAndPass () {
      try {
        await firebase
          .auth()
          .createUserWithEmailAndPassword(this.email, this.password)
        this.$router.push({ name: 'Home' })
      } catch (e) {
        alert('🤕 ' + e.message)
      }
    },
    async signInWithGoogle () {
      try {
        const provider = new firebase.auth.GoogleAuthProvider()
        await firebase.auth().signInWithPopup(provider)
        this.$router.push({ name: 'Home' })
      } catch (e) {
        alert('🤕 ' + e.message)
      }
    }
  }
}
</script>

<style scoped>
</style>
