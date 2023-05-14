<template>
  <GoPrev v-if="month <= 0 && day <= 0" :path="'/competition/end'"/>
  <GoPrev v-else :path="'/competition'"/>
  <AuthForm/>
  <div class="competitions">
    <div class="spaceEmpty"></div>
    <div class="btnCopmetition" v-if="role === 'user' && !(month <= 0 && day <= 0)">
      <button @click="SendRequestJudge">Стать судьей</button>
      <button @click="$router.push('/add/model/' + $route.params.id)">Отправить модель</button>
    </div>
    <div class="btnCopmetition" v-if="role === 'not approval judge' || role === 'approval judge'">
      <button @click="DeleteRequestJudge">Отказаться от судьейства</button>
    </div>
    <div class="CardTitle">
      <a v-if="fileUrl !== ''" class="DownloadFile" :href="fileUrl" download>
        <div>
          <p>Положение &#129095;</p>
        </div>
      </a>
      <div class="right">
        <img :src="imageUrl" alt="">
      </div>
      <div class="rightContent">
        <p class="TitleCompetition">{{name}}</p>
        <div class="rightContentDown">

          <p>Организатор:</p>
          <div class="photoProfile">
            <p>{{organizer_name}}</p>
            <div v-show="imageUrlPerson !== ''" class="photo">
              <img :src="imageUrlPerson" alt="">
            </div>
          </div>
          <p>Категория: {{category}}</p>
          <p v-if="month > 0">Осталось: {{month}} мес. {{day}} дн.</p>
          <p v-if="month <= 0 && day <= 0">Конкурс закончился</p>
          <p v-if="month <= 0 && day > 0">Осталось: {{day}} дн.</p>
        </div>
      </div>
    </div>
    <div class="fullText">
      <p>{{fulltext}}</p>
      <div class="Criterias">
        <p>Критерии оценивания:</p>
        <ul v-for="(criteria,key) in criterias" :key="key">
          <li>
            <span>{{criteria.name}}: </span>
            <span>до {{criteria.maxscore}} баллов</span>
          </li>
        </ul>
        <p style="margin-top: 10px">Спиок судей:</p>
        <ul v-if="countApprovalJudge > 0 || (role === 'organizer' || role === 'admin')">
          <li v-for="(jud,key) in judge" :key="key">
            <div>
              <span>{{ jud.name }}</span>
              <span class="JudgeApproval JudgeHover"
                    v-if="(role === 'organizer' || role === 'admin') && jud.approval"
                    @click="JudgeApproval(false, key)">
                Одобрено
              </span>
              <span class="JudgeNotApproval JudgeHover"
                    v-if="(role === 'organizer' || role === 'admin') && !jud.approval"
                    @click="JudgeApproval(true, key)">
                Не одобрено
              </span>
            </div>
          </li>
        </ul>
        <ul v-else><li><span>Судей нет</span></li></ul>
      </div>
    </div>
    <div class="menegerCompetitionBtn" v-if="role === 'organizer' || role === 'admin'">
      <button @click="DeleteCompetition">Удалить Конкурс</button>
      <button @click="$router.push('/edit/competition/' + $route.params.id)">Изменить Конкурс</button>
    </div>
    <div class="modelList">
      <div class="model" v-for="(mod, key) in model" :key="key">
        <ModelCard v-if="month <= 0 && day <= 0" :model="mod" :rang="key+1" :role="role"/>
        <ModelCard v-else :model="mod" :rang="4" :role="role"/>
      </div>
    </div>
  </div>

  <div class="spaceEmpty"></div>
  <AlertMessages ref="AddAlertMess"/>
</template>

<script>
import AuthForm from "@/components/AuthForm";
import Concurs from "@/services/Concurs";
import AlertMessages from "@/components/AlertMessages";
import ModelCard from "@/components/ModelCard";
import path from "@/services/path";
import GoPrev from "@/components/GoPrev";

export default {
  name: "CompetitionPage",
  components: {AuthForm, AlertMessages, ModelCard, GoPrev},
  data() {
    return {
      name: '',
      category: '',
      user_id: '',
      minitext: '',
      fileUrl: '',
      fulltext: '',
      datestart: '',
      dateend: '',
      criterias: [],
      imageUrl: '',
      imageUrlPerson: '',
      organizer_name: '',
      organizer_id: 0,
      judge: [],
      model: [],
      day: 0,
      month: 0,
      role: 'user',
      ShowJudgeList: false,
      countApprovalJudge: 0,
      previousPage: null
    }
  },
  beforeRouteUpdate(to, from, next) {
    this.GetOneCompetition(to.params.id);
    next();
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
  created() {
    this.GetOneCompetition(this.$route.params.id);
  },
  methods: {
    AddAlert(mess){
      this.$refs.AddAlertMess.AddAlertMess(mess);
    },
    GetOneCompetition(pageId) {
      Concurs.getOneCompetition({id: pageId})
        .then((res) =>{
          this.name = res.data.name;
          this.category = res.data.category;
          this.minitext = res.data.minitext;
          this.fulltext = res.data.fulltext;
          this.criterias = res.data.criterias;
          this.imageUrl = path.path + '/image/' + res.data.image_path;
          this.organizer_id = res.data.organizer_id;
          this.organizer_name = res.data.organizer_name;
          if(res.data.imageUrlPerson !== '') this.imageUrlPerson = path.path + '/image/' + res.data.imageUrlPerson;
          else this.imageUrlPerson = '';
          this.judge = res.data.judges;
          this.countApprovalJudge = this.judge.filter(judge => judge.approval).length;
          this.model = res.data.models;

          this.datestart = new Date();
          this.dateend = new Date(res.data.dateend);
          const diffInMs = this.dateend - this.datestart;
          this.month = Math.floor(diffInMs / (1000 * 60 * 60 * 24 * 30));
          this.day = Math.floor(diffInMs / (1000 * 60 * 60 * 24)) % 30 + 1;

          if(res.data.fileDop !== '')
            this.fileUrl = path.path + "/file/" + res.data.fileDop;
          else this.fileUrl = '';

          let isAdmin = false;
          let isJudge = 'not judge';
          let isOrganizer = false;
          let isParticipant = false;

          Concurs.isAdmin({competitionId: this.$route.params.id})
            .then(res => {
              isAdmin = res.data.admin;
              Concurs.isJudge({competitionId: this.$route.params.id})
                .then(res => {
                  isJudge = res.data.judge;
                  Concurs.isOrganizer({competitionId: this.$route.params.id})
                    .then(res => {
                      isOrganizer = res.data.organizer;
                      Concurs.isParticipant({competitionId: this.$route.params.id})
                        .then(res => {
                          isParticipant = res.data.participant
                          if(isAdmin)                         this.role = 'admin';
                          else if(isOrganizer)                this.role = 'organizer';
                          else if(isParticipant)              this.role = 'participant';
                          else if(isJudge === 'approval')     this.role = 'approval judge';
                          else if(isJudge === 'not approval') this.role = 'not approval judge';
                          else                                this.role = 'user';
                        })
                    })
                })
            })
        })
    },
    DeleteCompetition(){
      Concurs.deleteCompetition({
        competitionId: this.$route.params.id,
        organizerId: this.organizer_id,
      }).then(() => {
        this.$router.push('/competition');
      })
    },
    SendRequestJudge(){
      Concurs.Authentication()
          .then(response => {
            if (response && response.data.userId != 0) {
              Concurs.createJudge({
                competitionId: this.$route.params.id,
                userId: response.data.userId,
              }).then(() => {
                this.reloadPage();
                this.AddAlert({ status: true, message: "Запрос отправлен" });
              }).catch(() => {
                this.AddAlert({ status: false, message: "Ошибка в отправлении запроса" });
              })
            }
            else {
              this.user_id = 0;
              this.AddAlert({ status: false, message: "Необходима авторизация" });
            }
          });
    },
    DeleteRequestJudge(){
      Concurs.Authentication()
          .then(response => {
            if (response && response.data.userId != 0) {
              Concurs.deleteJudge({
                competitionId: this.$route.params.id,
                userId: response.data.userId,
              }).then(() => {
                this.reloadPage();
                this.AddAlert({ status: true, message: "Успешный отказ" });
              }).catch(() => {
                this.AddAlert({ status: false, message: "Ошибка в отказе" });
              })
            }
            else {
              this.user_id = 0;
              this.AddAlert({ status: false, message: "Необходима авторизация" });
            }
          });

    },
    reloadPage() {
      location.reload();
    },
    JudgeApproval(approval, key) {
      Concurs.approvalJudge({
        approval: approval,
        judge_id: this.judge[key].id_judge,
      }).then(() => {
        location.reload();
        this.AddAlert({ status: true, message: "Список судей изменен" });
      }).catch(() => {

        this.AddAlert({ status: false, message: "Ошибка в изменение списка судей" });
      })
    }
  }
}
</script>

<style scoped>

.photo{
  background: linear-gradient(var(--color-main), var(--color-main-second));
  border: 1px solid rgba(255, 255, 255, 0.65);
  border-radius: 25px;
  color: rgba(255, 255, 255, 0.65);
  width: 50px;
  height: 50px;
}

.photoProfile img{
  border-radius: 25px;
  width: 50px; /* задаем ширину */
  height: 50px; /* задаем высоту */
  object-fit: cover; /* масштабируем изображение */
  object-position: center center; /* выравниваем по центру */
}

.photoProfile{
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.DownloadFile{
  opacity: 0.7;
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 5;
  height: 30px;
  top: 5px;
  left: 5px;
  border-radius: 20px;
  text-decoration: none;
  padding: 0 5px;
  color: black;
  background: hsl(0,0%,95%);
  font-size: 15px;
}

.DownloadFile:hover {
  opacity: 0.9;
}

.modelList{
  display: flex;
  flex-wrap: wrap;
  text-align: center;
  width: calc(100% - 50px);
  margin: 0 20px;
}

.model{
  width: 380px;
  height: 530px;
}

@media (max-width: 800px) {
  .model {
    width: 230px;
    height: 320px;
  }
}

.competitions{
  width: calc(100vw - 360px);
}

@media (max-width: 1000px) {
  .competitions{
    width: calc(100vw - 20px);
  }
}

.MainScreen{
  box-shadow: 1px 1px 25px 3px rgba(0,0,0,.3);
  position: absolute;
  right: 50%;
  transform: translate(+50%, 0);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  width: min(100%, 1017px);
  background-color: var(--color-back-second);
}

.GoToHome{
  position: absolute;
  z-index: 4;
  align-content: center;
  left: 20px;
  top: -15px;
  font-size: min(calc(4em + 1vw));
  background: var(--color-main);
  color: var(--color-back-second);
  border-radius: 0 0 20px 20px;
}

.GoToHome:hover {
  cursor: pointer;
}

.JudgeApproval{
  color: #92f16d;
}

.JudgeNotApproval{
  color: #f16d6d;
}

.JudgeHover:hover{
  opacity: 0.5;
  cursor: pointer;
}

.Criterias{
  margin-bottom: 10px;
}

.Criterias p{
  margin: 0;
}

.Criterias ul {
  margin: 0;
}

.Criterias span {
  font-size: min(calc(0.3em + 1vw), 18px);
  margin-left: 10px;

}

.spaceEmpty {
  height: 80px;
  width: 100px;
}

.menegerCompetitionBtn{
  display: flex;
  justify-content: space-between;
  text-align: center;
  width: calc(100% - 50px);
  margin: 0 20px;
  transition: all 0.1s ease-in-out;
  border-radius: 25px;
}

.menegerCompetitionBtn button{
  cursor: pointer;
  margin: 10px;
  background: linear-gradient(var(--color-main), var(--color-main-second));
  border: 1px solid rgba(255, 255, 255, 0.65);
  border-radius: 25px;
  color: rgba(255, 255, 255, 0.65);
  -webkit-align-self: flex-end;
  align-self: flex-end;
  font-size: 1.2rem;
  font-weight: 300;
  line-height: 2.5em;
  -webkit-transition: all .2s ease;
  transition: all .2s ease;
  width: 35%;
}

.menegerCompetitionBtn button:hover {
  opacity: 0.7;
}

.btnCopmetition {
  display: flex;
  justify-content: space-between;
  text-align: center;
  width: calc(100% - 50px);
  margin: 20px 20px;
  transition: all 0.1s ease-in-out;
  border-radius: 25px;
}

.btnCopmetition button {
  cursor: pointer;
  margin: 10px;
  background: linear-gradient(var(--color-main), var(--color-main-second));
  border: 1px solid rgba(255, 255, 255, 0.65);
  border-radius: 25px;
  color: rgba(255, 255, 255, 0.65);
  -webkit-align-self: flex-end;
  align-self: flex-end;
  font-size: 1.2rem;
  font-weight: 300;
  line-height: 2.5em;
  -webkit-transition: all .2s ease;
  transition: all .2s ease;
  width: 35%;
}

.btnCopmetition button:hover {
  opacity: 0.7;
}

@media screen and (max-width: 1000px) {
  .btnCopmetition button{
    font-size: 14px;
    left: 0;
    width: 50%;
  }
  .menegerCompetitionBtn button{
    font-size: 14px;
    left: 0;
    width: 50%;
  }
}

.rightContent {
  position: relative;
}

.rightContentDown {
  position: absolute;
  bottom: 0;
  right: 0;
}

.rightContentDown p {
  margin: 5px;
  text-align: right;
  opacity: 0.6;
}

.TitleCompetition{
  word-wrap: break-word;
  text-align: right;
  margin: 10px 10px;
  font-size: min(calc(1.3em + 1vw), 35px);
  font-weight: 200;
  letter-spacing: 0.05rem;
}

.CardTitle{
  position: relative;
  display: grid;
  grid-template-columns: 5fr 5fr;
  width: calc(100% - 50px);
  margin: 0 20px;
  height: 100%;
  border: 3px solid transparent;
  background: linear-gradient(var(--color-main), var(--color-main-second));
  box-shadow: inset 0px 0px 0px 100vw #fff;
  transition: all 0.1s ease-in-out;
  border-radius: 25px;
}

.fullText{
  text-align: justify;
  width: calc(100% - 50px);
  margin: 10px 20px;
  border: 3px solid transparent;
  background: linear-gradient(var(--color-main), var(--color-main-second));
  box-shadow: inset 0px 0px 0px 100vw #fff;
  transition: all 0.1s ease-in-out;
  border-radius: 25px;
}

.fullText p{
  font-size: min(calc(0.5em + 1vw), 20px);
  padding: 0 10px;
}

.right {
  position: relative;
  overflow: hidden;
  clip-path: polygon(0 0, 80% 0%, 100% 100%, 0% 100%);
  object-fit: cover;
  width: 40vw;
  height: 40vh;
}

.right img {
  height: 100%;
  border-radius: 21px 0 0 21px;
}

@media screen and (max-width: 1200px) {
  .TitleCompetition{
    font-size: 21px;
    font-weight: 150;
    letter-spacing: 0;
  }
}

@media screen and (max-width: 500px) {
  .DownloadFile{
    font-size: 10px;
  }
  .TitleCompetition{
    font-size: 18px;
  }
  .CardTitle {
    grid-template-columns: 2fr 10fr;
  }
  .right {
    width: 20vw;
  }
}


</style>
