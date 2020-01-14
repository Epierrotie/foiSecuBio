<template>
  <div id="index">
    <form @submit.prevent="signInWithEmailAndPass">
      <input type="text" v-model="email" placeholder="elon.musk@tesla.io" />
      <input type="password" v-model="password" placeholder="**********" autocomplete />
      <div>
        <button>Sign-in</button>
      </div>
    </form>
    <form @submit.prevent="signUpWithEmailAndPass">
      <input type="text" v-model="email" placeholder="elon.musk@tesla.io" />
      <input type="password" v-model="password" placeholder="********" autocomplete />
      <div>
        <button type="submit">Sign-up</button>
      </div>
    </form>
    <button @click="signInWithGoogle">Login with Google</button>
  </div>
</template>

<script>
import firebase from "firebase";

export default {
  name: "Index",
  data() {
    return {
      email: "",
      password: ""
    };
  },
  methods: {
    async signInWithEmailAndPass() {
      try {
        await firebase
          .auth()
          .signInWithEmailAndPassword(this.email, this.password);
        this.$router.push({ name: "Home" });
      } catch (e) {
        alert("🤕" + e.message);
      }
    },
    async signUpWithEmailAndPass() {
      try {
        await firebase
          .auth()
          .createUserWithEmailAndPassword(this.email, this.password);
        this.$router.push({ name: "Home" });
      } catch (e) {
        alert("🤕" + e.message);
      }
    },
    async signInWithGoogle() {
      try {
        const provider = new firebase.auth.GoogleAuthProvider();
        await firebase.auth().signInWithPopup(provider);
        this.$router.push({ name: "Home" });
      } catch (e) {
        alert("🤕" + e.message);
      }
    }
  }
};
</script>

<style scoped>
</style>
