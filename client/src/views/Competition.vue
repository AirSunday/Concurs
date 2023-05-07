<template>
  <AuthForm/>
  <div class="MainScreen">
    <div class="btnCopmetition" v-if="role === 'user'">
      <AddModel/>
      <button @click="SendRequestJudge">Стать судьей</button>
    </div>
    <div class="btnCopmetition" v-if="role === 'not approval judge' || role === 'approval judge'">
      <button @click="DeleteRequestJudge">Отказаться от судьейства</button>
    </div>
    <div class="spaceEmpty"></div>
    <div class="CardTitle">
      <div class="right">
        <img :src="imageUrl" alt="">
      </div>
      <div class="rightContent">
        <p class="TitleCompetition">{{name}}</p>
        <div class="rightContentDown">
          <p>Организатор: {{organizer_name}}</p>
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
      <EditCompetition/>
      <button @click="DeleteCompetition">Удалить Конкурс</button>
    </div>

    <div class="ModelList" v-for="(mod, key) in model" :key="key">
      <ModelCard :model="mod"/>
    </div>

  </div>
  <AlertMessages ref="AddAlertMess"/>
</template>

<script>
import AuthForm from "@/components/AuthForm";
import Concurs from "@/services/Concurs";
import EditCompetition from "@/components/EditCompetition";
import AlertMessages from "@/components/AlertMessages";
import ModelCard from "@/components/ModelCard";
import AddModel from "@/components/AddModel";

export default {
  name: "CompetitionPage",
  components: {AuthForm, EditCompetition, AlertMessages, ModelCard, AddModel},
  data() {
    return {
      name: '',
      user_id: '',
      minitext: '',
      fulltext: '',
      datestart: '',
      dateend: '',
      criterias: [],
      imageUrl: '',
      organizer_name: '',
      organizer_id: 0,
      judge: [],
      model: [],
      day: 0,
      month: 0,
      role: 'user',
      ShowJudgeList: false,
      countApprovalJudge: 0,
    }
  },
  created() {
    this.GetOneCompetition();
  },
  methods: {
    AddAlert(mess){
      this.$refs.AddAlertMess.AddAlertMess(mess);
    },
    GetOneCompetition() {
      Concurs.getOneCompetition({id: this.$route.params.id})
        .then((res) =>{
          this.name = res.data.name;
          this.minitext = res.data.minitext;
          this.fulltext = res.data.fulltext;
          this.criterias = res.data.criterias;
          this.imageUrl = 'https://whoisa.ru/api/image/' + res.data.image_path;
          // this.imageUrl = 'http://localhost:8080/api/image/' + res.data.image_path;
          this.organizer_id = res.data.organizer_id;
          this.organizer_name = res.data.organizer_name;
          this.judge = res.data.judges;
          this.countApprovalJudge = this.judge.filter(judge => judge.approval).length;
          this.model = res.data.models;

          this.datestart = new Date();
          this.dateend = new Date(res.data.dateend);
          const diffInMs = this.dateend - this.datestart;
          this.month = Math.floor(diffInMs / (1000 * 60 * 60 * 24 * 30));
          this.day = Math.floor(diffInMs / (1000 * 60 * 60 * 24)) % 30 + 1;

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
                  Concurs.isOrganizer({organizerId: this.organizer_id})
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
        this.$router.push('/');
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
        this.GetOneCompetition();
        this.AddAlert({ status: true, message: "Список судей изменен" });
      }).catch(() => {

        this.AddAlert({ status: false, message: "Ошибка в изменение списка судей" });
      })
    }
  }
}
</script>

<style scoped>

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
  background-color: #f6e8e8;
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
  height: 12vh;
  width: 100px;
}

.menegerCompetitionBtn{
  display: flex;
  justify-content: space-between;
  width: 100%;
}

.menegerCompetitionBtn button{
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

.menegerCompetitionBtn button:hover {
  background-color: #e7cbcb;
}

.btnCopmetition {
  position: absolute;
  left: 0;
  width: 60%;
}

.btnCopmetition button {
  margin-bottom: 10px;
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
  left: calc((100vw - 1058px) / 2);
  top: 20px;
}

.btnCopmetition button:hover {
  background-color: #e7cbcb;
}

@media screen and (max-width: 1000px) {
  .btnCopmetition button{
    left: 0;
    width: 70%;
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
  margin: 2px;
  text-align: right;
  opacity: 0.6;
}

.TitleCompetition{
  word-wrap: break-word;
  text-align: right;
  margin: 10px 10px;
  font-size: min(calc(1.5em + 1vw), 35px);
  color: transparent;
  -webkit-text-stroke: 1px #222222;
}

.CardTitle{
  display: grid;
  grid-template-columns: 5fr 5fr;
  width: 100%;
  height: 100%;
  background: #fff;
  box-shadow: 1px 1px 25px 3px rgba(0,0,0,.3);
}

.fullText{
  text-align: justify;
  width: 100%;
  margin: 10px;
  background: #fff;
  box-shadow: 1px 1px 25px 3px rgba(0,0,0,.3);
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
  height: 400px;
}

</style>
