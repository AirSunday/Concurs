<template>
  <button class="btn" @click="ModView = !ModView">Создать конкурс</button>
  <div v-if="!ModView"  class="AddCompetitionForm">

    <div class="title">
      <div class="app-title">
        <h1>Форма добавления конкурса</h1>
      </div>
      <h1 class="close" @click="CloseFunction">&#10006;</h1>
    </div>

    <div class="control-group">
      <input type="text" maxlength="100" class="login-field" v-model="name" placeholder="Название (не более 100 символов)">
      <label class="login-field-icon fui-user"></label>
    </div>
    <div class="control-group">
      <input type="text" maxlength="400" class="login-field" v-model="minitext" placeholder="Краткое описание (не более 400 символов)">
      <label class="login-field-icon fui-user"></label>
    </div>
    <div class="control-group">
      <textarea id="message" name="message" rows="10" cols="50" v-model="fulltext" placeholder="Полное описание"></textarea>
      <label class="login-field-icon fui-user"></label>
    </div>
    <div class="control-group2">
      <VueDatePicker class="DatePicker" v-model="datestart" :format="customDateFormat" :language="language" placeholder="Дата начала"/>
      <label class="login-field-icon fui-user"></label>
    </div>
    <div class="control-group2">
      <VueDatePicker class="DatePicker"  v-model="dateend" :format="customDateFormat" :language="language" placeholder="Дата конца"/>
      <label class="login-field-icon fui-user"></label>
    </div>

    <div class="cardCriteria" v-for="(criteria,key) in criterias" :key="key">
      <input type="text" maxlength="50" v-model="criteria.name" placeholder="Название критерия (не более 50 символов)">
      <input type="number" v-model="criteria.maxscore" min="0" placeholder="Максимальная оценка">
      <p class="cardCriteriaP" @click="deleteCriteria(key)">&#128465;</p>
    </div>

    <div class="control-group">
      <button class="input-file-btn" @click="addCriteria()">Добавить критерий</button>
    </div>

    <div class="control-group imgPicker">
      <input type="file" id="fileUpload" @change="onFileChange" hidden/>
      <button class="input-file-btn" @click="chooseFiles()">Выберите картинку</button>
      <p v-if="file">Картинка загружена</p>
    </div>

    <div class="control-group imgPicker">
      <input type="file" id="fileUploadDop" @change="onFileChangeDop" hidden/>
      <button class="input-file-btn" @click="chooseFilesDop()">Добавить положение конкурса (.pdf)</button>
      <p v-if="fileDop">Файл загружен</p>
    </div>

    <button class="btn-second" @click.prevent="AddCompetition();">Создать конкурс</button>
  </div>
  <AlertMessages ref="AddAlertMess"/>
</template>

<script>
import Concurs from "@/services/Concurs";
import AlertMessages from '@/components/AlertMessages.vue';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'

export default {
  name: "AddCompetition",
  components: {AlertMessages, VueDatePicker },
  data() {
    return{
      selectedDate: null,
      customDateFormat: 'dd.MM.yyyy',
      language: 'ru',
      ModView: true,
      organizer_id: '',
      name: '',
      minitext:'',
      fulltext: '',
      datestart: '',
      dateend: '',
      image: '',
      file: null,
      fileDop: null,
      criterias: [{name: '', maxscore: ''}],
    }
  },
  created() {
    this.CheckSession();
  },
  methods: {
    AddAlert(mess){
      this.$refs.AddAlertMess.AddAlertMess(mess);
    },
    deleteCriteria(key){
      if(this.criterias.length > 1)
        this.criterias.splice(key, 1);
    },
    addCriteria(){
      if(this.criterias.length > 4)
        this.AddAlert({ status: false, message: "Нельзя добавлять более 5 критериев" });
      else
        this.criterias.push({name: '', maxscore: ''});
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
    chooseFilesDop: function() {
      document.getElementById("fileUploadDop").click()
    },
    onFileChangeDop(e) {
      this.fileDop = e.target.files[0];
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
      if(this.datestart > this.dateend) {
        this.AddAlert({ status: false, message: "Дата начала позже даты конца" });
        return;
      }
      let checkCriterias = this.criterias.every(criteria => {
        return criteria.name !== "" && criteria.maxscore >= 1;
      });
      if( this.name === ''      ||
          this.minitext === ''  ||
          this.fulltext === ''  ||
          this.datestart === '' ||
          this.dateend === ''   ||
          this.file === null    ||
          checkCriterias === false) {
        this.AddAlert({ status: false, message: "Заполните все поля" });
        return;
      }
      this.ModView = !this.ModView;
      let formData = new FormData();
      formData.append("files", this.file);
      if(this.fileDop !== null) formData.append("files", this.fileDop);
      formData.append("userId", this.organizer_id);
      formData.append("name", this.name);
      formData.append("datestart", this.datestart);
      formData.append("dateend", this.dateend);
      formData.append("fulltext", this.fulltext);
      formData.append("minitext", this.minitext);

      console.log(this.criterias)
      Concurs.createCompetition(formData).then((response) => {
        this.reloadPage();
        this.criterias.forEach((criteria) => {
          Concurs.createCriteria({
            competitionId: response.data.competitionId,
            name: criteria.name,
            maxscore: criteria.maxscore
          })
        })
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
  border: 2px solid transparent;
  border-radius: 20px;
  background: var(--color-main);
  color: #ffffff;
  font-size: calc(0.4em + 1vw);
  line-height: 25px;
  padding: 0.5vw 1vw;
  text-align: left;
  transition: 0.25s;
  width: 60%;
}

.cardCriteria{
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
}

.cardCriteria input {
  border-radius: 20px;
  padding: 10px;
  width: 45%;
}

.cardCriteriaP{
  font-size: calc(1em + 1vw);
  margin: 0;
}

.cardCriteriaP:hover {
  opacity: 0.5;
  cursor: pointer;
}

.imgPicker img{
  width: 100px;
  height: 100px;
}

.DatePicker {
  border: 2px solid transparent;
  border-radius: 20px;
  font-size: 16px;
  font-weight: 200;
  padding: 10px 0;
  width: 100%;
  transition: border .5s;
  margin: 0;
}

.AddCompetitionForm{
  position: absolute;
  top: 2vw;
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

.control-group2 {
  margin: 0;
}

input {
  background-color: #ECF0F1;
  border-radius: 20px;
  padding: 10px;
  border: 2px solid transparent;
  font-size: 16px;
  font-weight: 200;
  padding: 10px 0;
  width: 100%;
  transition: border .5s;
}

input:focus {
  border: 2px solid var(--color-main);
  box-shadow: none;
}

textarea{
  background-color: #ECF0F1;
  border-radius: 20px;
  padding: 10px;
  border: 2px solid transparent;
  font-size: 16px;
  font-weight: 200;
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
  position: absolute;
  z-index: 3;
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
  width: 20%;
  left: calc((100vw - 1000px) / 2);
  top: 20px;
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
  width: 50%;
  margin: 0 50%;
  transform: translate(-50%, 0);
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
    width: 40%;
  }
}
</style>
