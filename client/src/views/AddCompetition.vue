<template>
  <div class="container">
    <div class='window'>
      <div class='overlay'></div>
      <div class='content'>
        <div class='welcome'>Создание конкурса</div>
        <div class='input-fields'>
          <input type="text" maxlength="100" class='input-line full-width' v-model="name" placeholder="Название (не более 100 символов)">
          <select class='select-line full-width' v-model="category">
            <option value="" disabled selected hidden>Выбирите категорию</option>
            <option value="Авиация">Авиация</option>
            <option value="Автомобили">Автомобили</option>
            <option value="Бронетехника">Бронетехника</option>
            <option value="Диорамы">Диорамы</option>
            <option value="Действующие">Действующие</option>
            <option value="Корабли">Корабли</option>
            <option value="Ретро">Ретро</option>
            <option value="Разное">Разное</option>
          </select>
          <input type="text" maxlength="400" class='input-line full-width' v-model="minitext" placeholder="Краткое описание (не более 400 символов)">
          <textarea class='textarea-line full-width' id="message" name="message" rows="10" cols="50" v-model="fulltext" placeholder="Полное описание"></textarea>
          <VueDatePicker class='input-line full-width' v-model="datestart" :format="customDateFormat" :language="language" placeholder="Дата начала"/>
          <VueDatePicker class='input-line full-width'  v-model="dateend" :format="customDateFormat" :language="language" placeholder="Дата конца"/>

          <div class="cardCriteria" v-for="(criteria,key) in criterias" :key="key">
            <input class='input-line full-width' type="text" maxlength="50" v-model="criteria.name" placeholder="Название критерия (не более 50 символов)">
            <input class='input-line full-width' type="number" v-model="criteria.maxscore" min="0" placeholder="Максимальная оценка">
            <div class="cardCriteriaP" @click="deleteCriteria(key)"><p> &#128465; </p></div>
          </div>
          <div class="control-group">
            <button class='ghost-round full-width' @click="addCriteria()">Добавить критерий</button>
          </div>

          <div class="control-group imgPicker">
            <input type="file" id="fileUpload" @change="onFileChange" hidden/>
            <button class='ghost-round full-width' @click="chooseFiles()">Выберите картинку</button>
            <p v-if="file">Картинка загружена</p>
          </div>

          <div class="control-group imgPicker">
            <input type="file" id="fileUploadDop" @change="onFileChangeDop" hidden/>
            <button class='ghost-round full-width' @click="chooseFilesDop()">Добавить положение конкурса (.pdf)</button>
            <p v-if="fileDop">Файл загружен</p>
          </div>

        </div>
        <div>
          <button class='ghost-round full-width' @click="AddCompetition">Создать</button>
        </div>
        <div class="spaceCounsel"></div>
        <div class='spacing'><span class='highlight' @click="goToPreviousPage">Отменить</span></div>
      </div>
    </div>
  </div>

  <AlertMessages ref="AddAlertMess"/>
</template>

<script>
import AlertMessages from '@/components/AlertMessages.vue';
import Concurs from "@/services/Concurs";

export default {
  name: "AddCompetitionPage",
  components: { AlertMessages },
  data() {
    return{
      selectedDate: null,
      customDateFormat: 'dd.MM.yyyy',
      language: 'ru',
      ModView: true,
      organizer_id: '',
      name: '',
      category: '',
      minitext:'',
      fulltext: '',
      datestart: '',
      dateend: '',
      image: '',
      file: null,
      fileDop: null,
      criterias: [{name: '', maxscore: ''}],
      previousPage: null
    }
  },
  created() {
    this.CheckSession();
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.previousPage = from.fullPath
    })
  },
  beforeRouteLeave(to, from, next) {
    this.previousPage = from.fullPath;
    next();
  },
  methods: {
    AddAlert(mess){
      this.$refs.AddAlertMess.AddAlertMess(mess);
    },
    goToPreviousPage(){
      this.$router.push(this.previousPage || "/");
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
      this.category = '';
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
          this.category === ''  ||
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
      formData.append("category", this.category);
      formData.append("datestart", this.datestart);
      formData.append("dateend", this.dateend);
      formData.append("fulltext", this.fulltext);
      formData.append("minitext", this.minitext);
      Concurs.createCompetition(formData).then((response) => {
        this.criterias.forEach((criteria) => {
          Concurs.createCriteria({
            competitionId: response.data.competitionId,
            name: criteria.name,
            maxscore: criteria.maxscore
          })
        })

        this.goToPreviousPage();
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
body,
html {
  margin: 0;
  height: 100%;
}

input {
  border: none;
}

button:focus {
  outline: none;
}

::-webkit-input-placeholder {
  color: rgba(255, 255, 255, 0.65);
}

.spaceCounsel{
  width: 100%;
  height: 30px;
}

.container{
  top: 10px;
  left: 50%;
  display: flex;
  justify-content: center;
  width: 100%;
}

.highlight {
  color: rgba(255, 255, 255, 0.8);
  font-weight: 400;
  cursor: pointer;
  transition: color .2s ease;
}

.highlight:hover {
  color: #fff;
  transition: color .2s ease;
}

.spacing {
  position: absolute;
  bottom: -90px;
  left: 50%;
  transform: translate(-50%, 0);
  -webkit-box-flex: 1;
  -webkit-flex-grow: 1;
  flex-grow: 1;
  height: 120px;
  font-weight: 300;
  text-align: center;
  margin-top: 10px;
  color: rgba(255, 255, 255, 0.65)
}

.input-line:focus {
  outline: none;
  border-color: #fff;
  -webkit-transition: all .2s ease;
  transition: all .2s ease;
}

.textarea-line {
  border: 2px solid transparent;
  background: none;
  margin-bottom: 10px;
  line-height: 2.4em;
  color: #fff;
  font-weight: 300;
  letter-spacing: 0.02rem;
  font-size: 1.2rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.65);
  -webkit-transition: all .2s ease;
  transition: all .2s ease;
  height: 80%;
  resize: none;
}

.textarea-line:focus {
  outline: none;
  border-color: #fff;
  -webkit-transition: all .2s ease;
  transition: all .2s ease;
}

.cardCriteria{
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
}

.cardCriteria input {
  padding: 10px;
  width: 40%;
  margin: 3px;
}

.cardCriteriaP{
  display:flex;
  justify-content: center;
  text-align: center;
  align-content: center;
  font-size: calc(1.5em + 1vw);
}

.cardCriteriaP p{
  margin: 0;
}

.ghost-round {
  cursor: pointer;
  background: none;
  border: 1px solid rgba(255, 255, 255, 0.65);
  border-radius: 25px;
  color: rgba(255, 255, 255, 0.65);
  -webkit-align-self: flex-end;
  align-self: flex-end;
  font-size: 1.2rem;
  font-weight: 300;
  line-height: 2.5em;
  margin-top: auto;
  margin-bottom: 25px;
  -webkit-transition: all .2s ease;
  transition: all .2s ease;
}

.ghost-round:hover {
  background: rgba(255, 255, 255, 0.15);
  color: #fff;
  -webkit-transition: all .2s ease;
  transition: all .2s ease;
}

.input-line {
  background: none;
  margin-bottom: 10px;
  line-height: 2.4em;
  color: #fff;
  font-weight: 300;
  letter-spacing: 0.02rem;
  font-size: 1.2rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.65);
  -webkit-transition: all .2s ease;
  transition: all .2s ease;
}

.select-line {
  background: none;
  margin-bottom: 10px;
  line-height: 2.4em;
  color: #fff;
  font-weight: 300;
  letter-spacing: 0.02rem;
  font-size: 1.2rem;
  border: none;
  border-bottom: 1px solid rgba(255, 255, 255, 0.65);
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  outline: none;
  cursor: pointer;
}

.select-line:focus {
  border-color: #fff;
}

.select-line option {
  background-color: var(--color-main);
}

.full-width {
  width: 100%;
}

.input-fields {
  margin-top: 25px;
}

.content {
  padding-left: 25px;
  padding-right: 25px;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-flex-flow: column;
  flex-flow: column;
  z-index: 5;
}

.welcome {
  font-weight: 200;
  text-align: center;
  font-size: 2.5rem;
  letter-spacing: 0.05rem;
}

.window {
  z-index: 100;
  color: #fff;
  position: relative;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-flex-flow: column;
  flex-flow: column;
  box-shadow: 0px 15px 50px 10px rgba(0, 0, 0, 0.2);
  box-sizing: border-box;
  height: 100%;
  width: 800px;
  background: #fff;
}

.overlay {
  background: -webkit-linear-gradient(var(--color-main), var(--color-main-second));
  background: linear-gradient(var(--color-main), var(--color-main-second));
  opacity: 0.85;
  filter: alpha(opacity=85);
  height: 100%;
  position: absolute;
  width: 800px;
  z-index: 1;
}

.bold-line {
  background: #e7e7e7;
  position: absolute;
  top: 0px;
  bottom: 0px;
  margin: auto;
  width: 100%;
  height: 360px;
  z-index: 1;
  opacity:0.1;
  background-size:cover;
}

@media (max-width: 500px) {
  .window {
    width: 100%;
    height: 100%;
  }
  .overlay {
    width: 100%;
    height: 100%;
  }
}
</style>
