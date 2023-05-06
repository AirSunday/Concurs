<template>
  <button class="btn" @click="ModView = !ModView">Изменить конкурс</button>
  <div v-if="!ModView"  class="AddCompetitionForm">

    <div class="title">
      <div class="app-title">
        <h1>Форма изменения конкурса</h1>
      </div>
      <h1 class="close" @click="CloseFunction">&#10006;</h1>
    </div>

    <div class="control-group">
      <input type="text" class="login-field" v-model="name" placeholder="Название">
      <label class="login-field-icon fui-user"></label>
    </div>
    <div class="control-group">
      <input type="text" maxlength="400" class="login-field" v-model="minitext" placeholder="Краткое описание">
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

    <div class="control-group imgPicker">
      <input type="file" id="fileUpload" @change="onFileChange" hidden/>
      <button class="input-file-btn" @click="chooseFiles()">Выберите картинку</button>
      <p v-if="file">Картинка загружена</p>
    </div>

    <button class="btn-second" @click.prevent="EditCompetition()">Изменить конкурс</button>
  </div>
  <AlertMessages ref="AddAlertMess"/>
</template>

<script>
import Concurs from "@/services/Concurs";
import AlertMessages from '@/components/AlertMessages.vue';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'

export default {
  name: "EditCompetition",
  components: {AlertMessages, VueDatePicker},
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
      imageUrl: '',
      file: null,
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
            this.GetOneCompetition();
          });
    },
    EditCompetition(){
      if( this.organizer_id === 0) {
        this.AddAlert({ status: false, message: "Авторизуйтесь" });
        return;
      }
      if(this.datestart > this.dateend) {
        this.AddAlert({ status: false, message: "Дата начала позже даты конца" });
        return;
      }
      if( this.name === ''      ||
          this.minitext === ''  ||
          this.fulltext === ''  ||
          this.datestart === '' ||
          this.dateend === ''     ) {
        this.AddAlert({ status: false, message: "Заполните все поля" });
        return;
      }
      this.ModView = !this.ModView;
      let formData = new FormData();
      if(this.file !== null) formData.append("filedata", this.file);
      else formData.append("imageUrl", this.imageUrl);
      formData.append("userId", this.organizer_id);
      formData.append("name", this.name);
      formData.append("datestart", this.datestart);
      formData.append("dateend", this.dateend);
      formData.append("fulltext", this.fulltext);
      formData.append("minitext", this.minitext);
      formData.append("competitionId", this.$route.params.id);
      formData.append("organizerId", this.organizer_id);
      Concurs.updateCompetition(formData).then((response) => {
        console.log(response)
        this.reloadPage();
        if(response.statusText == "OK")
          this.AddAlert({ status: true, message: "Успешное изменение" });
        else
          this.AddAlert({ status: false, message: "Ошибка в изменение" });
      });
    },
    GetOneCompetition() {
      Concurs.getOneCompetition({id: this.$route.params.id})
          .then((res) =>{
            this.name = res.data.name;
            this.minitext = res.data.minitext;
            this.fulltext = res.data.fulltext;
            this.criterias = res.data.criterias;
            this.imageUrl =  res.data.image_path;
            this.datestart = new Date(res.data.datestart);
            this.dateend = new Date(res.data.dateend);
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
  background: #e0b5b5;
  color: #ffffff;
  font-size: calc(0.4em + 1vw);
  line-height: 25px;
  padding: 0.5vw 1vw;
  text-align: left;
  transition: 0.25s;
  width: 80%;
}

.cardCriteria{
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
}

.cardCriteria input {
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
  border-radius: 3px;
  font-size: 16px;
  font-weight: 200;
  padding: 10px 0;
  width: 100%;
  transition: border .5s;
  margin: 0;
}

.AddCompetitionForm{
  position: fixed;
  top: 2vw;
  left: 20%;
  transform: translate(-50%, 0);
  width: 70%;
  min-width: 300px;
  padding: 10px;
  background: #fff;
  border: 1px solid #000;
  border-radius: 30px;
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
  border: 2px solid transparent;
  border-radius: 3px;
  font-size: 16px;
  font-weight: 200;
  padding: 10px 0;
  width: 100%;
  transition: border .5s;
}

input:focus {
  border: 2px solid #debcbc;
  box-shadow: none;
}

textarea{
  background-color: #ECF0F1;
  border: 2px solid transparent;
  border-radius: 3px;
  font-size: 16px;
  font-weight: 200;
  padding: 10px 0;
  width: 100%;
  height: 80%;
  resize: none;
  transition: border .5s;
}

textarea:focus {
  border: 2px solid #debcbc;
  box-shadow: none;
}

.btn {
  margin-bottom: 10px;
  border: 2px solid transparent;
  background: #e0b5b5;
  color: #ffffff;
  font-size: calc(0.5em + 1vw);
  line-height: 25px;
  padding: 0.5vw 1vw;
  text-align: center;
  transition: 0.25s;
  display: block;
  width: 35%;
}

.btn-second{
  border: 2px solid transparent;
  background: #e0b5b5;
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
  background-color: #e7cbcb;
}

.btn-second:hover {
  background-color: #e7cbcb;
}

@media screen and (max-width: 1000px) {
  .btn{
    left: 0;
    width: 40%;
  }
}
</style>
