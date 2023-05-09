<template>
  <button class="btn" @click="ModView = !ModView">Отправить модель</button>
  <div v-if="!ModView"  class="AddCompetitionForm">

    <div class="title">
      <div class="app-title">
        <h1>Форма добавления модели</h1>
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
    <button class="btn-second" @click.prevent="AddCompetition(); reloadPage();">Отправить модель</button>
  </div>
  <AlertMessages ref="AddAlertMess"/>
</template>

<script>
import Concurs from "@/services/Concurs";
import AlertMessages from '@/components/AlertMessages.vue';

export default {
  name: "AddModel",
  components: {AlertMessages},
  data() {
    return{
      ModView: true,
      name: '',
      view: '',
      scale: '',
      text: '',
      image: '',
      file: null,
    }
  },
  created() {
    this.CheckSession();
  },
  methods: {
    AddAlert(mess){
      this.$refs.AddAlertMess.AddAlertMess(mess);
    },
    CloseFunction(){
      this.ModView = !this.ModView;
      this.name = '';
      this.minitext = '';
      this.fulltext = '';
      this.datestart = '';
      this.dateend = '';
      this.file = null;
      this.criterias =  [{name: '', maxscore: ''}];
    },
    chooseFiles: function() {
      document.getElementById("fileUpload").click()
    },
    onFileChange(e) {
      this.file = e.target.files[0];
    },
    CheckSession() {
      Concurs.Authentication()
          .then(response => {
            if (response && response.data.userId != 0) {
              this.organizer_id = response.data.userId;
            }
            else {
              this.organizer_id = 0;
            }
          });
    },
    reloadPage() {
      location.reload();
    },
    AddCompetition(){
      if( this.organizer_id === 0) {
        this.AddAlert({ status: false, message: "Авторизуйтесь" });
        return;
      }
      if( this.name === ''    ||
          this.view === ''    ||
          this.scale === ''   ||
          this.text === ''    ||
          this.file === null  ) {
        this.AddAlert({ status: false, message: "Заполните все поля" });
        return;
      }
      this.ModView = !this.ModView;
      let formData = new FormData();
      formData.append("filedata", this.file);
      formData.append("name", this.name);
      formData.append("view", this.view);
      formData.append("scale", this.scale);
      formData.append("text", this.text);
      formData.append("competitionId", this.$route.params.id);
      Concurs.createModel(formData).then((response) => {
        console.log(response)
        if(response.statusText == "OK")
          this.AddAlert({ status: true, message: "Успешное добавление" });
        else
          this.AddAlert({ status: false, message: "Ошибка в добавлении" });
      });
    }
  }
}
</script>

<style scoped>

.input-file-btn {
  border-radius: 20px;
  border: 2px solid transparent;
  background: var(--color-main);
  color: #ffffff;
  font-size: calc(0.4em + 1vw);
  line-height: 25px;
  padding: 0.5vw 1vw;
  text-align: left;
  transition: 0.25s;
  width: 80%;
}

.cardCriteria input {
  padding: 10px;
  border-radius: 20px;
  width: 45%;
}

.imgPicker img{
  border-radius: 20px 0 0 20px;
  width: 100px;
  height: 100px;
}

.AddCompetitionForm{
  position: fixed;
  top: 8vw;
  left: 50%;
  transform: translate(-50%, 0);
  width: 50%;
  min-width: 300px;
  z-index: 3;
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

input {
  border-radius: 20px;
  background-color: #ECF0F1;
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

.textareaModel{
  background-color: #ECF0F1;
  border: 2px solid transparent;
  border-radius: 20px;
  font-size: 16px;
  font-weight: 200;
  padding: 10px;
  width: 100%;
  height: 20%;
  resize: none;
  transition: border .5s;
}

textarea:focus {
  border: 2px solid var(--color-main);
  box-shadow: none;
}

.btn {
  margin-bottom: 10px;
  margin-left: 3vw;
  border-radius: 20px;
  border: 2px solid transparent;
  background: var(--color-main);
  color: #ffffff;
  font-size: calc(0.5em + 1vw);
  line-height: 25px;
  padding: 0.5vw 1vw;
  text-align: right;
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

@media screen and (max-width: 1000px) {
  .btn {
    width: 50%;
  }
}

.btn-second{
  border-radius: 20px;
  border: 2px solid transparent;
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

.btn-second:hover {
  opacity: 0.7;
}

</style>
