<template>
  <div>
    <div class="container mt-5">
      <h1 class="text-center">Login</h1>
      <form class="d-flex flex-column align-items-center" @submit.prevent="login">
        <i class="fa-solid fa-envelope envelope"></i>
        <input
        required
          type="email"
          placeholder="please enter your email"
          class="w-50 mt-3 field position-relative"
          v-model="login_form.email"
        />
        <i class="fa-solid fa-key key"></i>
        <input
        required
          type="password"
          placeholder="please enter Password"
          class="w-50 mt-3 field position-relative"
          v-model="login_form.password"
        />
        <router-link to="/register" class="router mt-3"
          >Create a new account</router-link
        >
        <button type="submit" class="btn btn-success mt-4 sub">
          <span v-if="loader
          ">Login</span>
          <b-spinner
            label="Loading..."
            v-if="isloading"
         
          ></b-spinner>
        </button>
        <button class="btn btn-success mt-4 d-flex align-items-center  justify-content-center" v-on:click="signingoogle">
          <img src="@/assets/google1.png" style="width:15%" v-if="googleLoader">
          <span v-if="googleLoader">SignIn with Google  </span>
          <b-spinner
            label="Loading..."
            v-if="isgoogleloading"
         
          ></b-spinner>
        </button>
      </form>
    </div>
    <router-view />
  </div>
</template>

<script>
import { GoogleAuthProvider } from "firebase/auth";
export default {
  name: "Login",
  data() {
    return {
      login_form : {
       email: "",
       password: "",
     },
     isloading:false,
     loader:true,
     googleLoader:true,
     isgoogleloading:false,
    };
  },
  methods:{
    login() {
      this.isloading = true;
      this.loader = false;
      setTimeout(()=>{

        const payload = {
          email: this.login_form.email,
          password: this.login_form.password,
        }
        this.$store.dispatch("login",payload);
        this.isloading = false;
        this.loader = true;
      },2000)
    },
    async signingoogle() {
      this.googleLoader = false;
      this.isgoogleloading = true
      setTimeout(() =>{
      const provider = new GoogleAuthProvider();
        const result =  this.$store.dispatch("googleLogin", provider);
        console.log(result);
        this.isgoogleloading = false;
        this.googleLoader = true;
      },2000)
     
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
  margin-right: 24rem;
}
.envelope {
  position: absolute;
  top: 15.9rem;
  left: 23rem;
}
.key {
  position: absolute;
  top: 20.5rem;
  left: 23rem;
}
.container{
  border-radius: 10px;
  box-shadow: 9px 52px 41px 10px rgb(167 167 167);
  padding: 1rem;
 }
</style>
