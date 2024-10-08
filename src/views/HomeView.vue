<template>
  <div class="home">
    <div class="main bg-success">
      <div class="container p-4 d-flex justify-content-between">
        <h2 class="text-start text-white">Todo App</h2>
        <ul class="text-end d-flex justify-content-end align-items-center mb-0">
          <li class="ms-3">
            <router-link to="/todos" class="text-white li"
              >DashBoard</router-link
            >
          </li>

          <li>
            <button
              class="btn btn-light ms-4 d-flex align-items-center"
              @click="logout"
            >
              <span v-if="loader"> Logout </span>
              <b-spinner label="Loading..." v-if="isloading"></b-spinner>
            </button>
          </li>
        </ul>
      </div>
    </div>
    <form @submit.prevent="addTodo">
      <div
        class="container d-flex justify-content-center align-content-center mt-3"
      >
        <input
          required
          type="text"
          placeholder="Add a Todo"
          class="field"
          v-model="newTodo"
        />
        <button
          class="btn btn-success add-btn d-flex align-items-center"
          type="submit"
          :disabled="!newTodo"
          v-if="addBtn"
        >
          <span v-if="addloader"> Add </span>

          <b-spinner label="Loading..." v-if="addLoading"></b-spinner>
        </button>

        <button
          class="btn btn-success add-btn"
          type="button"
          :disabled="!newTodo"
          v-if="editBtn"
          @click="editTodos"
        >
          <span v-if="loader"> Edit </span>
          <b-spinner label="Loading..." v-if="loading"></b-spinner>
        </button>
      </div>
    </form>
    <div class="search-field text-center my-3">
      <input
        type="text"
        placeholder="Search a Todo"
        class="search"
        @input="searchTodo"
        v-model="search"
      />
      <button class="btn btn-success add-btn" type="dropdown">
        <select class="drop bg-success" @change="sortData">
          <option disabled selected>Sort</option>
          <option value="Oldest">Oldest</option>
          <option value="Latest">Latest</option>
        </select>
      </button>
    </div>
    <div class="container mt-4">
      <div class="todo p-4 mb-3">
        <h4>Todo List</h4>
        <div class="todo-list">
          <div
            v-for="todo in todos.filter((todo) =>
              todo.content.toLowerCase().includes(search.toLowerCase())
            )"
            :key="todo.id"
            class="card mt-2"
            :class="{ 'color-change': todo.done }"
          >
            <div
              class="content d-flex justify-content-between align-items-center"
            >
              <div class="d-flex align-items-center">
                <div class="image">
                  <img :src="todo.image" class="img-fluid" />
                </div>
                {{ todo.content }}
              </div>
              <div
                class="btn-filed d-flex align-items-center justify-content-center"
              >
                <i
                  class="fa-solid fa-check bg-white btn text-dark"
                  @click="toggleTodo(todo.id)"
                ></i>
                <i
                  class="fa-solid fa-trash bg-danger text-white btn ms-2"
                  @click="delTodo(todo.id)"
                ></i>
                <i
                  class="fa-solid fa-pen bg-success text-white btn ms-2"
                  @click="initiateTodo(todo.id)"
                ></i>
                <input
                  id="fileUpload"
                  ref="fileInput"
                  type="file"
                  @change="handleFileChange"
                  class="d-none"
                  accept="image/*"
                />
                <label for="fileUpload">
                  <i class="fa-solid fa-upload bg-dark text-white btn ms-2"></i>
                </label>
                <i
                  class="fa-solid fa-file bg-dark text-white btn ms-2"
                  @click="uploadFile(todo.id)"
                  v-if="uploadLoader"
                >
                </i>
                <b-spinner
                  label="Loading..."
                  v-if="uploadLoading"
                  class="ms-2 bg-dark text-white btn"
                ></b-spinner>
              </div>
            </div>
          </div>
        </div>
      </div>
      <button
        class="btn btn-success d-flex mx-auto"
        @click="showAll(lastDoc)"
        v-if="showmorebtn"
      >
        Show More
      </button>
    </div>
  </div>
</template>

<script>
// import login from "../components/login.vue"

import {
  collection,
  addDoc,
  doc,
  deleteDoc,
  onSnapshot,
  updateDoc,
  query,
  orderBy,
  limit,
  where,
  getDocs,
  startAfter,
  getDoc,
} from "firebase/firestore";
import { db } from "@/components/firebase/firebase.js";
import Toast from "vue-toastification";
// Import the CSS or use your own!
import "vue-toastification/dist/index.css";
import { getStorage, uploadBytes, getDownloadURL, ref } from "firebase/storage";
export default {
  name: "HomeView",

  data() {
    return {
      todos: [],
      newTodo: "",

      editBtn: false,
      addBtn: true,
      activeTodo: "",
      file: "",
      url: "",
      search: "",
      // showAll: true,
      tasks: [],
      showImage: false,
      loading: false,
      // showMore: false,
      showMoreCount: 5,
      isloading: false,
      addLoading: false,
      addloader: true,
      lastDoc: null,
      loader: true,
      uploadLoader: true,
      uploadLoading: false,
      showmorebtn: false,
    };
  },
  methods: {
    async addTodo() {
      this.addloader = false;
      this.addLoading = true;
      setTimeout(async () => {
        const todo = {
          content: this.newTodo,
          done: false,
          date: Date.now(),
          image: "",
          creatorId: this.$store.state.user.uid,
        };
        const todoRef = await addDoc(collection(db, "todos"), todo);
        console.log("iderfgerter45", todoRef.id);

        this.todos.unshift({ id: todoRef.id, ...todo });
        console.log("addtodos", this.todos);
        this.newTodo = "";

        this.$toast.success("New todo added succesfully", {
          timeout: 2000,
        });
        this.addLoading = false;
        this.addloader = true;
      }, 1000);
    },
    delTodo(id) {
      this.todos = this.todos.filter((todo) => todo.id !== id);
      // this.tasks = this.tasks.filter((todo) => todo.id !== id);
      // deleteDoc(doc(db, "todos", id));
      console.log("todosdel", this.todos);
      console.log("id", id);

      // console.log("taskstodo",this.tasks);

      deleteDoc(doc(db, "todos", id));
      this.$toast.success("todo deleted successfully", {
        timeout: 2000,
      });
    },
    async toggleTodo(id) {
      let index = this.todos.findIndex((todo) => todo.id === id);
      this.todos[index].done = !this.todos[index].done;
      const todoCollection = doc(db, "todos", id);
      await updateDoc(todoCollection, {
        done: this.todos[index].done,
      });
      this.$toast.info("todo status changed successfully", {
        timeout: 2000,
      });

      // console.log("done", this.todos[index].done );
      console.log(id, "id");
      console.log("index", index);

      console.log("value", this.todos);
    },
    initiateTodo(id) {
      this.activeTodo = id;
      const index = this.todos.findIndex((todo) => todo.id === id);
      this.newTodo = this.todos[index].content;
      this.editBtn = true;
      this.addBtn = false;
    },
    editTodos() {
      // this.loader = false
      // this.loading = true;
      const index = this.todos.findIndex((todo) => todo.id === this.activeTodo);
      this.todos[index].content = this.newTodo;
      const todoCollection = collection(db, "todos");
      if (this.editBtn === true) {
        updateDoc(doc(todoCollection, this.activeTodo), {
          content: this.newTodo,
        });
        this.newTodo = "";
        this.editBtn = false;
        this.addBtn = true;
        this.$toast.success("todo edited successfully", {
          timeout: 2000,
        });
      }
    },
    // upload(){
    //   this.$refs.fileInput.click()
    // }
    handleFileChange(event) {
      const selectedFile = event.target.files[0];
      console.log("selectedFile: ", selectedFile);
      if (selectedFile) {
        this.file = selectedFile;
      }

      console.log("test45", selectedFile);
    },
    async uploadFile(file) {
      console.log("test123");
      const index = this.todos.findIndex((todo) => todo.id === this.activeTodo);

      const storage = getStorage();
      try {
        console.log("File before upload:", file);
        let index = this.todos.findIndex((todo) => todo.id === file);
        console.log(index, "index");

        const storageRef = ref(storage, `todos-images/${this.file.name}`);

        console.log("Storage Reference:", storageRef);
        const uploadTask = await uploadBytes(storageRef, this.file);
        const url = await getDownloadURL(uploadTask.ref);
        this.todos[index].image = url;
        console.log("File available at", url);
        console.log("after", this.file);
        // this.todos[index].image = url;
        const todoCollection = doc(db, "todos", file);

        // console.log(todoCollection, "todo");

        updateDoc(todoCollection, {
          image: url,
        });
        // this.showImage = true;
        this.url = url;
        return url;
      } catch (error) {
        console.log("Error uploading file:", error);
      }
    },
    logout() {
      this.loader = false;
      this.isloading = true;
      setTimeout(() => {
        this.loader = true;
        this.isloading = true;
        this.$store.dispatch("logout");
      }, 2000);
    },
    searchTodo(e) {
      this.search = e.target.value;
    },
    sortData(event) {
      if (event.target.value === "Oldest") {
        this.todos.sort((a, b) => a.date - b.date);
      } else if (event.target.value === "Latest") {
        this.todos.sort((a, b) => b.date - a.date);
      }
    },

    async showAll(lastVisible = null) {
    
      const todoCollection = collection(db, "todos");
      let todosQuery = "";
      if (lastVisible) {
        todosQuery = query(
          todoCollection,
          where("creatorId", "==", this.$store.state.user.uid),
          orderBy("date", "desc"),
          startAfter(lastVisible),
          limit(5)
        );
      } else {
        todosQuery = query(
          todoCollection,
          where("creatorId", "==", this.$store.state.user.uid),
          orderBy("date", "desc"),
          limit(5)
        );
      }
      
      const querySnapshot = await getDocs(todosQuery);
      const fbTodos = [];
      this.lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1];
      console.log("lastdoc", this.lastDoc);
      querySnapshot.forEach((doc) => {
        const todo = {
          id: doc.id,
          content: doc.data().content,
          done: doc.data().done,
          date: doc.data().date,
          image: doc.data().image,
          creatorId: this.$store.state.user.uid,
        };

        fbTodos.push(todo);
      }); 
      console.log(fbTodos, "fbtodos");
      if(fbTodos.length >= 3){
        // 
        this.showmorebtn = true;
      }
      const temp = [...this.todos, ...fbTodos];
      this.todos = temp;
      this.tasks = this.todos;
    },
  },
  mounted() {
    this.showAll();
    // if (this.todos.length < 3) {
    //     this.showmorebtn = false;
    //   }else {
    //     this.showmorebtn = true;
    //   }
    console.log("todos",this.todos.length);
    
  },
  computed: {
    user() {
      return this.$store.getters.user;
    },
  },
};
</script>

<style scoped>
.search-field {
  display: flex;
  justify-content: center;
  align-items: center;
}
.search {
  width: 56%;
  border: 1px solid #e4e4e4;
  padding: 8px;
  /* border: none; */
  outline: none;
  border-radius: 12px 0 0 12px;
}
.color-change {
  background-color: #4c8b45;
  color: white;
  text-decoration: line-through;
}
.drop {
  /* background: none; */
  border: none;
  outline: none;
  color: white;
}
.todo {
  box-shadow: 6px 6px 9px rgb(92, 92, 92);
  border-radius: 10px;
}
.add-btn {
  padding: 8px 2rem;
  border-radius: 0 10px 10px 0;
}
.field {
  width: 70%;
  border-radius: 12px 0 0 12px;
  padding: 8px;

  outline: none;
  border: 1px solid #e4e4e4;
}
.card {
  box-shadow: 6px 6px 9px rgb(92, 92, 92);
  border-radius: 10px;
  padding: 1rem;
}
.image {
  width: 10%;
  margin-right: 2.5rem;
}
.image img {
  /* width: 100
   */
  max-width: 3rem;
  border-radius: 50%;
}
.btn-filed {
  width: 25%;
}
.mar {
  margin-left: 37rem;
}
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
