<template>
  <div class="main bg-success">
    <div class="container p-4 d-flex justify-content-between">
      <h2 class="text-start text-white">Todo App</h2>
      <ul class="text-end d-flex justify-content-end align-items-center mb-0">
        <li class="ms-3" v-if="isLogged">
          <router-link to="/todos" class="text-white li">DashBoard</router-link>
        </li>
        <li class="ms-3" v-if="!isLogged">
          <router-link to="/register" class="text-white li"
            >Register</router-link
          >
        </li>
        <li class="ms-3" v-if="!isLogged">
          <router-link to="/login" class="text-white li">Login</router-link>
        </li >
        <li v-if="isLogged">
        <button class="btn btn-light ms-4" @click="logout">Logout</button>
      </li>
      </ul>
    </div>
  </div>
</template>

<script>
import auth from './firebase/firebase';
export default{
  data(){
    return{
      isLogged : false,
      currentUser : false
    }
  },
  created(){
    if(auth.currentUser){
      this.isLogged = true;
      this.currentUser = auth.currentUser.email;  
    }
  },
  methods:{
    logout(){
      this.$store.dispatch("logout")
    }
  }
}
</script>


<style scoped>
li {
  list-style: none;
}
/* router-link{
    text-decoration: none;
    color: white;
} */
.li {
  cursor: pointer;
  text-decoration: none;
}
</style>
