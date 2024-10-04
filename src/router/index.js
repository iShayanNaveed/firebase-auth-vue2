import Vue from "vue";
import VueRouter from "vue-router";
import HomeView from "../views/HomeView.vue";
import loginView from "@/views/loginView.vue";
// import { component } from 'vue/types/umd'
import RegisterView from "../views/RegisterView.vue";
import auth from "@/components/firebase/firebase.js";
Vue.use(VueRouter);

const routes = [
  {
    path: "/todos",
    name: "home",
    component: HomeView,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/login",
    name: "login",
    component: loginView,
    meta: {
      requiresGuest: true,
    },
  },
  {
    path: "/register",
    name: "register",
    component: RegisterView,
    meta: {
      requiresGuest: true,
    },
  },
];

let router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});
//nav guards
router.beforeEach((to,from,next)=>{
  if(to.matched.some(record => record.meta.requiresAuth)){
    if(!auth.currentUser){
      next({
        path: "/login",
        query: {redirect: to.fullPath}
      })
    }else{
      next();
    }
  } else if(to.matched.some(record => record.meta.requiresGuest)){
    if(auth.currentUser){
      next({
        path: "/todos",
        query: {redirect: to.fullPath}
      })
    }else{
      next();
    }
  }else{
    next();
  }
});

export default router;
// router.beforeEach((to,from,next)=>{
//   if(to.matched.some(record=>record.meta.requiresAuth)){
//     if(!auth.currentUser){
//       next("/login")
//     }else{
//       next()
//     }
//   }else{
//     if(auth.currentUser){
//       next("/todos")
//     }else{
//       next()
//     }
//   }
// })
// router.beforeEach((to, from, next) => {
//   if(to.path === '/login' && auth.currentUser){
//     next('/todos')
//     return
//   }
//   if(to.matched.some(record => record.meta.requiresAuth) && !auth.currentUser){
//     next('/login')
//     return
//   }
//   next()
//   })
