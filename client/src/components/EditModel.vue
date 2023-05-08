<template>
  <button class="btn" @click="ModView = !ModView">Изменить модель</button>
  <div v-if="!ModView"  class="AddCompetitionForm">

    <div class="title">
      <div class="app-title">
        <h1>Форма изменения модели</h1>
      </div>
      <h1 class="close" @click="CloseFunction">&#10006;</h1>
    </div>

    <div class="control-group">
      <input type="text" maxlength="50" class="login-field" v-model="name" placeholder="Название">
    </div>
    <div class="control-group">
      <input type="text" maxlength="30" class="login-field" v-model="view" placeholder="Вид модели">
    </div>
    <div class="control-group">
      <input type="text" maxlength="20" class="login-field" v-model="scale" placeholder="Масштаб">
    </div>
    <div class="control-group">
      <textarea class="textareaModel" id="message" name="message" rows="4" cols="50" maxlength="200" v-model="text" placeholder="Описание"></textarea>
    </div>

    <div class="control-group imgPicker">
      <input type="file" id="fileUpload" @change="onFileChange" hidden/>
      <button class="input-file-btn" @click="chooseFiles()">Выберите картинку</button>
      <p v-if="file">Картинка загружена</p>
    </div>

    <button class="btn-second" @click.prevent="EditModel()">Изменить модель</button>
  </div>
  <AlertMessages ref="AddAlertMess"/>
</template>

<script>
import Concurs from "@/services/Concurs";
import AlertMessages from '@/components/AlertMessages.vue';

export default {
  name: "EditModel",
  components: {AlertMessages},
  data() {
    return{
      ModView: true,
      modelId: '',
      name: '',
      view:'',
      text: '',
      scale: '',
      image: '',
      imageUrl: '',
      file: null,
    }
  },
  props: {
    model: {
      type: Object,
      required: true
    },
  },
  created() {
    this.modelId = this.model.id;
    this.name = this.model.name;
    this.view = this.model.view;
    this.text = this.model.text;
    this.scale = this.model.scale;
    this.imageUrl = this.model.image;
  },
  methods: {
    AddAlert(mess){
      this.$refs.AddAlertMess.AddAlertMess(mess);
    },
    CloseFunction(){
      this.ModView = !this.ModView;
      this.modelId = '';
      this.name = '';
      this.view = '';
      this.text = '';
      this.scale = '';
      this.image = '';
      this.file = null;
    },
    chooseFiles: function() {
      document.getElementById("fileUpload").click()
    },
    onFileChange(e) {
      this.file = e.target.files[0];
    },
    EditModel(){
      if( this.name === ''  ||
          this.view === ''  ||
          this.text === ''  ||
          this.scale === '' ) {
        this.AddAlert({ status: false, message: "Заполните все поля" });
        return;
      }
      this.ModView = !this.ModView;
      let formData = new FormData();
      if(this.file !== null) formData.append("filedata", this.file);
      formData.append("imageUrl", this.imageUrl);
      formData.append("modelId", this.modelId);
      formData.append("name", this.name);
      formData.append("view", this.view);
      formData.append("text", this.text);
      formData.append("scale", this.scale);
      Concurs.updateModel(formData).then((response) => {
        console.log(response)
        this.reloadPage();
        if(response.statusText == "OK")
          this.AddAlert({ status: true, message: "Успешное изменение" });
        else
          this.AddAlert({ status: false, message: "Ошибка в изменение" });
      });
    },
    reloadPage() {
      location.reload();
    }
  }
}
</script>

<style scoped>

.input-file-btn {
  border: 2px solid transparent;
  border-radius: 20px;
  background: var(--color-main);
  color: #ffffff;
  font-size: calc(0.4em + 1vw);
  line-height: 25px;
  padding: 0.5vw 1vw;
  text-align: left;
  transition: 0.25s;
  width: 80%;
}

.imgPicker img{
  border-radius: 20px;
  width: 100px;
  height: 100px;
}

.AddCompetitionForm{
  position: fixed;
  top: 10vw;
  left: 20%;
  width: 70%;
  min-width: 300px;
  padding: 10px;
  background: #fff;
  border: 1px solid #000;
  border-radius: 20px;
}
.title{
  display: flex;
  padding-left: 10%;
}

.close:hover{
  opacity: 0.8;
}

* {
  box-sizing: border-box;
}

*:focus {
  outline: none;
}

.app-title {
  width: 90%;
  font-size: calc(0.2em + 1vw);
}
.control-group {
  margin-bottom: 10px;
}

.control-group2 {
  margin: 0;
}

input {
  background-color: #ECF0F1;
  border-radius: 20px;
  border: 2px solid transparent;
  font-size: 16px;
  font-weight: 200;
  padding: 10px;
  width: 100%;
  transition: border .5s;
}

input:focus {
  border: 2px solid var(--color-main);
  box-shadow: none;
}

textarea{
  background-color: #ECF0F1;
  border: 2px solid transparent;
  border-radius: 30px;
  font-size: 16px;
  font-weight: 200;
  padding: 10px;
  width: 100%;
  height: 80%;
  resize: none;
  transition: border .5s;
}

textarea:focus {
  border: 2px solid var(--color-main);
  box-shadow: none;
}

.btn {
  margin: 10px 10vw 20px 10vw;
  border-radius: 20px;
  border: 2px solid transparent;
  background: var(--color-main);
  color: #ffffff;
  font-size: min(calc(0.5em + 1vw), 15px);
  line-height: 25px;
  padding: 0.5vw 1vw;
  text-align: center;
  transition: 0.25s;
  display: block;
  width: 35%;
}

.btn-second{
  border: 2px solid transparent;
  border-radius: 20px;
  background: var(--color-main);
  color: #ffffff;
  font-size: calc(0.5em + 1vw);
  line-height: 25px;
  padding: 0.5vw 1vw;
  text-align: center;
  text-decoration: none;
  text-shadow: none;
  box-shadow: none;
  transition: 0.25s;
  display: block;
  width: 50%;
}

.btn:hover {
  opacity: 0.7;
}

.btn-second:hover {
  opacity: 0.7;
}

@media screen and (max-width: 1000px) {
  .btn{
    left: 0;
    width: 30%;
  }
}
</style>
