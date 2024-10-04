<template>
    <div class="register">
        <div class="main bg-success">
    <div class="container p-4 d-flex justify-content-between">
      <h2 class="text-start text-white">Todo App</h2>
      <ul class="text-end d-flex justify-content-end align-items-center mb-0">
        
        <li class="ms-3" >
          <router-link to="/register" class="text-white li"
            >Register</router-link
          >
        </li>
        <li class="ms-3" >
          <router-link to="/login" class="text-white li">Login</router-link>
        </li >
       
      </ul>
    </div>
  </div>
    <register></register>
</div>
</template>

<script>
import register from "../components/register.vue"
export default{
    components:{
        register
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