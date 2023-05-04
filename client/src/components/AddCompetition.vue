<template>
  <div class="spaceEmpty"></div>
  <button class="btn" @click="ModView = !ModView">Создать конкурс</button>
  <div v-if="!ModView"  class="AddCompetitionForm">

    <div class="title">
      <div class="app-title">
        <h1>Форма добавления конкурса</h1>
      </div>
      <h1 class="close" @click="ModView = !ModView;">&#10006;</h1>
    </div>

    <div class="control-group">
      <input type="text" class="login-field" v-model="name" placeholder="Название">
      <label class="login-field-icon fui-user"></label>
    </div>
    <div class="control-group">
      <input type="text" class="login-field" v-model="minitext" placeholder="Краткое описание">
      <label class="login-field-icon fui-user"></label>
    </div>
    <div class="control-group">
      <input type="text" class="login-field" v-model="fulltext" placeholder="Полное описание">
      <label class="login-field-icon fui-user"></label>
    </div>
    <div class="control-group">
      <input type="text" class="login-field" v-model="datestart" placeholder="Дата начала">
      <label class="login-field-icon fui-user"></label>
    </div>
    <div class="control-group">
      <input type="text" class="login-field" v-model="dateend" placeholder="Дата конца">
      <label class="login-field-icon fui-user"></label>
    </div>
    <div class="control-group">
      <input type="text" class="login-field" v-model="image" placeholder="Картинка">
      <label class="login-field-icon fui-user"></label>
    </div>

    <button class="btn-second" @click="AddCompetition">Создать конкурс</button>
  </div>
  <AlertMessages ref="AddAlertMess"/>
</template>

<script>
import Concurs from "@/services/Concurs";
import AlertMessages from '@/components/AlertMessages.vue';

export default {
  name: "AddCompetition",
  components: {AlertMessages},
  data() {
    return{
      ModView: true,
      organizer_id: '',
      name: '',
      minitext:'',
      fulltext: '',
      datestart: '',
      dateend: '',
      image: '',
    }
  },
  created() {
    this.CheckSession();
  },
  methods: {
    AddAlert(mess){
      this.$refs.AddAlertMess.AddAlertMess(mess);
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
    AddCompetition(){
      if( this.organizer_id === 0) {
        this.AddAlert({ status: false, message: "Авторизуйтесь" });
        return;
      }
      if( this.name === '' ||
          this.minitext === '' ||
          this.fulltext === '' ||
          this.datestart === '' ||
          this.dateend === '' ||
          this.image === '') {
        this.AddAlert({ status: false, message: "Заполните все поля" });
        return;
      }
      this.ModView = !this.ModView;
      const competition = {
        organizer_id: this.organizer_id,
        name: this.name,
        minitext: this.minitext,
        fulltext: this.fulltext,
        datestart: this.datestart,
        dateend: this.dateend,
        image: this.image,
      }
      Concurs.createCompetition(competition).then((response) => {
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
.spaceEmpty {
  height: 4vh;
  width: 100px;
}

.AddCompetitionForm{
  position: fixed;
  top: 25vw;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 50%;
  min-width: 300px;
  z-index: 2;
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
  font-size: 0.8em;
}
.control-group {
  margin-bottom: 10px;
}

input {
  background-color: #ECF0F1;
  border: 2px solid transparent;
  border-radius: 3px;
  font-size: 16px;
  font-weight: 200;
  padding: 10px 0;
  width: 80%;
  transition: border .5s;
}

input:focus {
  border: 2px solid #debcbc;
  box-shadow: none;
}

.btn {
  position: absolute;
  border: 2px solid transparent;
  background: #e0b5b5;
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
  width: 30%;
  left: 0;
}

.btn-second{
  border: 2px solid transparent;
  background: #e0b5b5;
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
  background-color: #e7cbcb;
}

.btn-second:hover {
  background-color: #e7cbcb;
}
</style>
