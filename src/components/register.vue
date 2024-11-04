<template>
  <div>
    <div class="container mt-5">
      <h1 class="text-center">Register</h1>
      <form
        class="d-flex flex-column align-items-center"
        @submit.prevent="register"
      >
        <i class="fa-solid fa-envelope envelope"></i>
        <input
          required
          type="email"
          placeholder="please enter your email"
          class="w-25 mt-3 field position-relative"
          v-model="register_form.email"
        />
        <i class="fa-solid fa-key key"></i>
        
        <input
          required
          :type="showPassword ? 'text' : 'password'"
          placeholder="please enter Password"
          class="w-25 mt-3 field position-relative"
          v-model="register_form.password"
        />
        <i class="fa-regular fa-eye position-absolute eye" @click="togglePasswordVisibility"
        :class="{ 'line': showPassword }"></i>
  
        <router-link to="/login" class="router mt-3"
          >Already have a account</router-link
        >
        <button type="submit" class="btn btn-success mt-4 sub d-flex align-items-center" >
          <span v-if="loader">Register</span>
          <b-spinner
            label="Loading..."
            v-if="isloading"
            
          ></b-spinner>
        </button>
        <button class="btn btn-success mt-4 d-flex align-items-center justify-content-center
        " v-on:click="signupgoogle">
          <img src="@/assets/google1.png" style="width: 15%" v-if="googleLoader"/>
          <span v-if="googleLoader">Register with Google  </span>
          <b-spinner
            label="Loading..."
           v-if="isgoogleLoading"
           
          ></b-spinner>
        </button>
      </form>
    </div>
    <router-view />
  </div>
</template>
<script>
// import firebase from "./firebase/firebase.js";
// import {auth} from "./firebase/firebase.js";
// import {
//   createUserWithEmailAndPassword,
//   signInWithEmailAndPassword,
//   signOut,
// } from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth";
export default {
  data() {
    return {
      register_form: {
        email: "",
        password: "",
      },
      isloading:false,
      loader: true,
      googleLoader : true,
      isgoogleLoading : false,
      showPassword : false
    };
  },
  methods: {
    register() {
     this.isloading = true;
     this.loader = false;
    setTimeout(()=>{

      const payload = {
        email: this.register_form.email,
        password: this.register_form.password,
      };
      this.$store.dispatch("register", payload);
      this.isloading = false;
      this.loader = true;
     
    },2000)
  
    },
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
    },
    async signupgoogle() {
      this.googleLoader = false;
      this.isgoogleLoading = true;
        setTimeout(()=>{

          const provider = new GoogleAuthProvider();
          const result =  this.$store.dispatch("googleLogin", provider);
          console.log(result);
          this.googleLoader = true;
          this.isgoogleLoading = false;
        },2000)
      // }
      
   
    },
  },
  computed:{
    loading(){
      return this.$store.getters.loading
    }
  }
};
</script>

<style scoped>
.field {
  
  border-radius: 12px ;
  padding: 16px;
 
  outline: none;
  border: 1px solid #e4e4e4;
}

.router {
  margin-right: 12rem;
}
.envelope {
  position: absolute;
  top: 15.9rem;
  left: 31rem;
}
.key {
  position: absolute;
  top: 20.5rem;
  left: 31rem;
}
.container {
  border-radius: 10px;
  box-shadow: 9px 52px 41px 10px rgb(167 167 167);
  padding: 1rem;
}
.eye{
  top: 20.25rem;
    left: 49rem;
    border: 1px solid black;
    border-radius: 10px;
    padding: 2px;
}
.line{
  text-decoration: line-through
}
</style>
