<template>
  <div class="home">
    <div class="main bg-success">
      <div class="container p-4 d-flex justify-content-between">
        <h2 class="text-start text-white">Todo App</h2>
        <ul class="text-end d-flex justify-content-end align-items-center mb-0">
          <li class="ms-3">
            <router-link to="/todos" class="text-white li"
              >{{ $store.state.user.email }}</router-link
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
    <div class="d-flex justify-content-center align-items-center">
    <form @submit.prevent="addTodo" class="w-75" >
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
        <input
          id="UploadFile"
          ref="fileInput"
          type="file"
          @change="handleFile"
          class="d-none"
          accept="image/*"
         
        />
        <label
          for="UploadFile"
          v-if="addimage"
          class="add-btn btn btn-success d-flex align-items-center"
          >
          <!-- <button   -->
          

            <span >Add Image</span>
          <!-- </button> -->
        </label>
        <!-- <button class="add-btn btn btn-success" v-if="uploadimg"
        @click="uploadFileChange">Upload Image</button> -->
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
        class="btn btn-success edit-btn"
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
  <div class="d-flex flex-column align-content-center justify-content-center align-items-center mt-1">
  <i class="fa-regular fa-circle-xmark text-danger cross" v-if="showaddimg" @click="cancelimg"></i>
  <img :src="addpreview" class="preview-img position-relative" />
  <div v-if="uploading" class="text-center">
    <!-- <span v-if="textuploading">File Uploaded You May proceed</span> -->
    <progress :value="progress" max="100">{{ progress }}%</progress>
    
</div>
</div>
</div>
  <div class="search-field text-center my-3">
    <input
    type="text"
    placeholder="Search a Todo"
    class="search"
    @input="showAll(lastDoc, filter.showSearch)"
    v-model="filter.showSearch"
    />
    <button class="btn btn-success add-btn" type="dropdown">
      <select
      class="drop bg-success"
      @change="
            (e) => {
              filter.showSort = e.target.value;
              showAll();
            }
          "
        >
        <option disabled selected>Sort</option>
        <option value="asc">Oldest</option>
        <option value="desc">Latest</option>
      </select>
    </button>
  </div>
  <div class="container mt-4">
    <div class="todo p-4 mb-3">
      <h4>Todo List</h4>
        <b-spinner
          label="Loading..."
          v-if="contentLoading"
          class="d-flex mx-auto"
        ></b-spinner>
        <div class="todo-list" v-if="content">
          <div
            v-for="(todo,index) in todos.filter((todo) =>
              todo.content.includes(filter.showSearch)
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
                  <!-- <img :src="addFile" class="img-fluid"> -->
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
                  v-if="uploadLoading && index === currentIndex" 
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
import { getStorage, uploadBytes, getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
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
      filter: {
        showSearch: "",
        showSort: "desc",
      },
      content: true,
      contentLoading: false,
      addFile:"",
      addimage : true,
      uploadimg:false,
      addpreview:"",
      showaddimg:false,
      image: false,
      progress: 0,   
      uploading: false,
      // textuploading:false,
      currentIndex: null
    };
  },
  methods: {
    async addTodo() {
      this.addloader = false;
      this.addLoading = true;
      // this.addpreview = ""
     try{
    

        let storage = getStorage();
         let storageRef = ref(storage, `todos-images/${this.addFile.name}`);
         let uploadTask = await uploadBytes(storageRef, this.addFile);
         let url = await getDownloadURL(uploadTask.ref);
         this.todos.image = url;
    
        //endtest
        const todo = {
         content: this.newTodo,
         done: false,
         date: Date.now(),
         image: url,
         creatorId: this.$store.state.user.uid,
       };
   
       
       
       const todoRef = await addDoc(collection(db, "todos"), todo);
       //  this.todos.image = ""
       this.todos.unshift({ id: todoRef.id, ...todo });
       if(this.todos.length >=3){
        this.showmorebtn = true;
       }else{
        this.showmorebtn = false;
       }
      //  this.url = "";
      //  this.todos.image = "";
      //  url = ""
      // this.addFile = ""
      // console.log("addfilesd",url === "","thisurl",this.url ==="");
      
       this.newTodo = "";
        this.addLoading = false;
        this.addloader = true;
        this.$toast.success("New todo added succesfully", {
          timeout: 2000,
        });
        this.addpreview = "";
        this.showaddimg = false;
        this.addFile = ""
     }catch(error){
      console.log(error.meassage);
      
    }
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
    handleFile(event){
  
      // this.image = true
      try{
        // this.uploadimg = true;
          const selectedFile = event.target.files[0];
          console.log("selectedFile: ", selectedFile);
          if (selectedFile) {
            this.uploading= true;
            this.addFile = selectedFile;
            this.addpreview = URL.createObjectURL(selectedFile)
            this.showaddimg = true
            const storage = getStorage();
        const storageRef = ref(storage, `uploads/${this.addFile.name}`);
        console.log("addfileerre",this.addFile);
        
        const uploadTask = uploadBytesResumable(storageRef, selectedFile);
        console.log("taskupload",uploadTask);
        
        uploadTask.on(
          'state_changed',
          (snapshot) => {
           const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
             this.progress = Math.round(progress);
             console.log("progreess",this.progress);
             console.log("progerss",progress);
            
            
          },
          (error) => {
            console.error('Upload failed:', error);
            this.uploading = false;
          },
          () => {
          //  if(this.progress == 100){

             this.uploading = false;
             console.log('Upload complete');
             
             //  }
            //  this.textuploading = true;
            //  console.log("textulop",this.textuploading);
             
            }
          
        );
          }
          // this.addFile = "";
        console.log("add",this.addFile);
        // this.image =false
        
        }catch(error){
        console.log(error.meassage)
      }
        // this.addFile = "";
        // console.log("addfile",this.addFile);
        
    },
   
    cancelimg(){
      this.addpreview ="",
      this.showaddimg = false;
      this.uploading = false;
    },
    handleFileChange(event) {
      const selectedFile = event.target.files[0];
      console.log("selectedFile: ", selectedFile);
      if (selectedFile) {
        this.file = selectedFile;
      }

      console.log("test45", selectedFile);
      console.log("test32", this.file);
    },
    async uploadFile(file) {
      this.uploadLoader = false;
      this.uploadLoading = true
      console.log("test123");
      const index = this.todos.findIndex((todo) => todo.id === this.activeTodo);
      // console.log("testactive",this.activeTodo);
      // console.log("indexsdsd",index);
      
      
      const storage = getStorage();
      try {
        console.log("File before upload:", file);
        // let index = this.todos.findIndex((todo) => todo.id === file);
        this.currentIndex = this.todos.findIndex((todo) => todo.id === file)
        console.log( this.currentIndex , "index");

        const storageRef = ref(storage, `todos-images/${this.file.name}`);

        console.log("Storage Reference:", storageRef);
        const uploadTask = await uploadBytes(storageRef, this.file);
        console.log("filefile",this.file);
        
        const url = await getDownloadURL(uploadTask.ref);
        this.todos[this.currentIndex].image = url;
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
        this.uploadLoader = true;
      this.uploadLoading = false;
        // return url;
      } catch (error) {
        console.log("Error uploading file:", error);
        this.uploadLoader = true;
        this.uploadLoading = false;
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

    async showAll(lastVisible = null, search = null) {
      this.contentLoading = true;
      this.content = false;
    try{

      // this.contentLoading = false;
      // this.content = true;
      let todosQuery = "";

      let filters = [
        orderBy("date", this.filter.showSort),
        where("creatorId", "==", this.$store.state.user.uid),
        limit(5),
      ];

      if (lastVisible) {
        filters = [...filters, startAfter(lastVisible)];
      }

      if (search) {
        filters = [...filters, where("content", "==", search)];
      }
      // if(sort){
      //   filters = [...filters,  orderBy("date", this.filter.showSort),];
      // }
      console.log("fil", filters);

      const q = query(collection(db, "todos"), ...filters);
      const querySnapshot = await getDocs(q);

      const fbTodos = [];
      this.lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1];

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
        console.log("fb-toods", fbTodos);
      });
      console.log(fbTodos, "fbtodos");
      if (fbTodos.length >= 3) {
        this.showmorebtn = true;
      } else {
        this.showmorebtn = false;
      }

      if (search || !lastVisible) {
        const temp = fbTodos;
        this.todos = temp;
        this.tasks = this.todos;
      } else {
        const temp = [...this.todos, ...fbTodos];
        this.todos = temp;
        this.tasks = this.todos;
      }
      this.contentLoading = false;
      this.content = true;
    }catch(error){
      console.log(error.meassage);
      this.contentLoading = false;
      this.content = true;
    }
 
    },
  },
  mounted() {
    this.showAll();

    console.log("todos", this.todos.length);
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
  width: 30%;
  border: 1px solid #e4e4e4;
  padding: 8px;
  /* border: none; */
  outline: none;
  border-radius: 12px 0 0 12px;
}
/* .imagediv{
  margin-right:5rem
} */
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
  border-radius: 0 0px 0px 0;
  border:1px solid green
}
.add-btn:disabled{
  border: 1px solid #6f6e6e;
}
.edit-btn{
  padding: 8px 2rem;
  border-radius: 0 0px 0px 0;

  border:1px solid green
}
.field {
  width: 50%;
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
.preview-img {
  border-radius: 50%;
  width: 60px;

}
.cross{
  /* position: absolute;
  right: 14.75rem;*/
  cursor:pointer ;
  margin-left: 3rem;
}
</style>
<!-- todos.filter((todo) =>
              todo.content.toLowerCase().includes(search.toLowerCase())
            )" -->
