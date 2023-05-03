<template>
  <button v-if="ModView" class="btn btn-primary btn-large btn-block" @click="ModView = !ModView">Добавить Конкурс</button>
  <div v-else class="AddCompetitionForm">

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

    <button class="btn btn-primary btn-large btn-block" @click="AddCompetition">Добавить Конкурс</button>
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

.AddCompetitionForm{
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 50%;
  min-width: 300px;
  z-index: 4;
  padding: 10px;
  background: #bdd6e7;
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
  border: 2px solid #3498DB;
  box-shadow: none;
}

.btn {
  border: 2px solid transparent;
  background: #3498DB;
  color: #ffffff;
  font-size: 16px;
  line-height: 25px;
  padding: 10px 0;
  text-decoration: none;
  text-shadow: none;
  border-radius: 3px;
  box-shadow: none;
  transition: 0.25s;
  display: block;
  width: 50%;
  margin: 0 auto;
}

.btn:hover {
  background-color: #2980B9;
}
</style>
