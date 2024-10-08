import Vue, { onMounted } from "vue";
import Vuex from "vuex";
import router from "@/router";
import auth from "@/components/firebase/firebase.js";
import firebase from "@/components/firebase/firebase.js";
// import {auth} from "@/components/firebase/firebase.js"
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { db } from "@/components/firebase/firebase.js";
import createPersistedState from "vuex-persistedstate";
import {
  collection,
  addDoc,
  doc,
  deleteDoc,
  onSnapshot,
  setDoc,
} from "firebase/firestore";

import Toast from "vue-toastification";
// Import the CSS or use your own!
import "vue-toastification/dist/index.css";

Vue.use(Toast);
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: null,
    todos: [],
    newTodo: "",
    loading: false,
    authError: null,
    // uid : "",
    activeUsers: null,
  },
  getters: {
    user(state) {
      return state.user;
    },
    loading(state) {
      return state.loading;
    },
  },
  plugins: [
    createPersistedState({
        key: "",
        // paths: [""],
        storage: window.localStorage,
    }),
],
  mutations: {
    setUser(state, user) {
      const activeUsers = {
        uid: user.uid,
        email: user.email,
      };
      state.user = user;
      console.log("useruid",user);
      console.log("useruid1",user.uid);
      console.log("useruid2",user.email);
      
      console.log("user", activeUsers);
      localStorage.setItem("user", JSON.stringify(activeUsers));
    },
    clearUser(state) {
      state.user = null;
    },
    setLoading(state, payLoad) {
      state.loading = payLoad;
    },
    setAuthError(state, payLoad) {
      state.authError = payLoad;
    },
    clearAuthError(state) {
      state.authError = null;
    },
  },
  actions: {
    async register({ commit }, details) {
      // commit("setLoading", true);
      // commit("clearAuthError");
      // try {
      const { email, password } = details;
      console.log(email, password, "details");
      await createUserWithEmailAndPassword(auth, email, password)
        .then((user) => {
       
          console.log("userreg",user);
          commit("setUser", auth.currentUser);
        })
        .catch((error) => {
          commit("setLoading", false);
          commit("setAuthError", error);
          console.log(error, "error");
          Vue.$toast.error(error.message, {
            timeout: 2000,
          });
        });

      Vue.$toast.success("user created successfully", {
        timeout: 2000,
      });

     
      router.push("/todos");
      // this.$router.push('/login')
    },
    //login
    async login({ commit }, details) {
      const { email, password } = details;
      commit("setLoading", true);
      commit("clearAuthError");

      // try {
      await signInWithEmailAndPassword(auth, email, password)
        .then((user) => {
          // // commit("setLoading", false);
          // const newUser = {
          //   id: user.uid,
          //   email: user.email,
          //   // uid : user.uid,
          //   password: user.password,
          // };
          commit("setUser", auth.currentUser);
          router.push("/todos");
          Vue.$toast.success("user signin successfully", {
            timeout: 2000,
          });
          
        })
        .catch((error) => {
          // commit("setLoading", false);
          // commit("setAuthError", error);
          console.log(error, "error");
          Vue.$toast.error(error.message, {
            timeout: 2000,
          });
        });
  
       
      // } catch (error) {
      //   Vue.$toast.error("An un expected error occurs", {
      //     timeout: 2000
      // });

      // localStorage.setItem ()
      // commit("setUser", auth.currentUser);
      // router.push("/todos");
    },
    async logout({ commit }) {
      await signOut(auth);
      commit("clearUser");
      router.push("/register");
    },
    async googleLogin({ commit }) {
      const provider = new GoogleAuthProvider();
      try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        commit("setUser", auth.currentUser);
        router.push("/todos");
      } catch (error) {
        console.log(error);
      }
    },
    // onMounted(){
    //   const todoCollection = collection(db, "user");
    //   onSnapshot(todoCollection, (querySnapshot) => {
    //     const fbTodos = [];
    //     querySnapshot.forEach((doc) => {
    //       const todos = []
    //       const todo = {
    //         id: doc.id,
    //         content: doc.data().content,
    //         done: doc.data().done,
    //         date: doc.data().date,
    //         image: doc.data().image,
    //       };
    //       fbTodos.push(todo);
    //     });
    //     console.log('TODOSSS', fbTodos)
    //     this.todos = fbTodos;
    //     // this.tasks = this.todos;
    //   });
    // }

    autoSignIn(state) {
      const userData = localStorage.getItem("user")
      JSON.parse(userData)
      console.log(userData,"data");
      state.user = userData
      console.log("usersign",state.user);
      
      
    },
  },
  modules: {},
});
