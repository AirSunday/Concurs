<template>
  <AuthForm/>
  <div class="MainScreen">
    <div class="GoToHome" @click="$router.push('/competition/' + competitionId) ">
      &#11120;
    </div>
    <div class="spaceEmpty"></div>
    <div class="CardTitle">
      <div class="right">
        <img :src="imagePath" alt="">
      </div>
      <div class="rightContent">
        <p class="TitleCompetition">{{name}}</p>
        <div class="rightContentDown">
          <p>{{userName}}: Имя участника</p>
          <p>{{view}}: Вид модели</p>
          <p>{{scale}}: Масштаб</p>
          <p>{{score}}%: Оценка</p>
          <p>{{dateupload.split('T')[0]}}: Дата загрузки</p>
        </div>
      </div>
    </div>
    <div class="fullText">
      <p>{{text}}</p>
    </div>
    <div class="manegeModel" v-if="personId === personIdNow || role === 'organizer' || role === 'admin'">
      <button @click="DeleteModel">Удалить Модель</button>
      <EditModel :model="model"/>
    </div>

  </div>
  <AlertMessages ref="AddAlertMess"/>
</template>

<script>
import AuthForm from "@/components/AuthForm";
import Concurs from "@/services/Concurs";
import AlertMessages from "@/components/AlertMessages";
import path from "@/services/path";
import EditModel from "@/components/EditModel";

export default {
  name: "ModelPage",
  components: {AuthForm, AlertMessages, EditModel},
  data() {
    return {
      user_id: '',
      userName: '',
      modelId: '',
      name: '',
      view: '',
      scale: '',
      text: '',
      imagePath: '',
      participant: '',
      score: '',
      dateupload: '',
      personId: '',
      competitionId: '',
      role: '',
      model: {},
      personIdNow: '',
      image: '',
    }
  },
  beforeRouteUpdate(to, from, next) {
    this.GetOneModel(to.params.id);
    next();
  },
  created() {
    this.GetOneModel(this.$route.params.id);
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
              this.personIdNow = response.data.userId;
            }
            else {
              this.personIdNow = 0;
            }
          });
    },
    GetRole(){
      let isAdmin = false;
      let isJudge = 'not judge';
      let isOrganizer = false;
      let isParticipant = false;
      Concurs.isAdmin({competitionId: this.competitionId})
          .then(res => {
            isAdmin = res.data.admin;
            Concurs.isJudge({competitionId: this.competitionId})
                .then(res => {
                  isJudge = res.data.judge;
                  Concurs.isOrganizer({competitionId: this.competitionId})
                      .then(res => {
                        isOrganizer = res.data.organizer;
                        Concurs.isParticipant({competitionId: this.competitionId})
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
    },
    GetOneModel(pageId) {
      Concurs.GetOneModel({id: pageId})
          .then((res) => {
            this.modelId = res.data.dataValues.id;
            this.name = res.data.dataValues.name;
            this.view = res.data.dataValues.view;
            this.scale = res.data.dataValues.scale;
            this.dateupload = res.data.dataValues.dateupload;
            this.text = res.data.dataValues.text;
            this.imagePath = path.path + "/image/" + res.data.dataValues.image;
            this.image = res.data.dataValues.image;
            this.score = res.data.dataValues.score;
            this.participant = res.data.dataValues.participant;
            this.userName = res.data.person_name;
            this.personId = res.data.person_id;
            this.competitionId = res.data.dataValues.competitiondbId;

            this.model = {
              modelId: this.modelId,
              name: this.name,
              view: this.view,
              text: this.text,
              scale: this.scale,
              imageUrl: this.imagePath,
            }

            this.GetRole();
          })
    },
    reloadPage() {
      location.reload();
    },
    DeleteModel(){
      Concurs.deleteModel({
        modelId: this.modelId,
        participantId: this.participant,
        image: this.image,
      }).then(() => {
        this.$router.push('/competition/' + this.competitionId);
      })
    },
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
  background-color: var(--color-back-second);
}

.GoToHome{
  position: absolute;
  z-index: 4;
  align-content: center;
  left: 20px;
  top: -15px;
  font-size: min(calc(3em + 1vw));
  background: var(--color-main);
  color: var(--color-back-second);
  border-radius: 0 0 20px 20px;
}

.GoToHome:hover {
  cursor: pointer;
}

.spaceEmpty {
  height: 12vh;
  width: 100px;
}

.btnCopmetition button {
  margin-bottom: 10px;
  margin-left: 3vw;
  border: 2px solid transparent;
  border-radius: 20px;
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
  left: calc((100vw - 1058px) / 2);
  top: 20px;
}

.btnCopmetition button:hover {
  opacity: 0.7;
}

@media screen and (max-width: 1000px) {
  .btnCopmetition button{
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
  font-size: min(calc(1.5em + 1vw), 35px);
  color: transparent;
  -webkit-text-stroke: 1px #222222;
}

.CardTitle{
  position: relative;
  display: grid;
  border-radius: 20px;
  grid-template-columns: 5fr 5fr;
  width: 100%;
  height: 100%;
  background: #fff;
  box-shadow: 1px 1px 25px 3px rgba(0,0,0,.3);
}

.fullText{
  text-align: justify;
  border-radius: 20px;
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
  border-radius: 20px 0 0 20px;
  position: relative;
  overflow: hidden;
  clip-path: polygon(0 0, 80% 0%, 100% 100%, 0% 100%);
  object-fit: cover;
  width: 40vw;
  height: 40vh;
}

.right img {
  border-radius: 20px 0 0 20px;
  height: 400px;
}


.manegeModel{
  display: flex;
  justify-content: space-between;
  width: 100%;
}

.manegeModel button{
  margin: 10px 10vw 20px 10vw;
  border: 2px solid transparent;
  border-radius: 20px;
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

.manegeModel button:hover {
  opacity: 0.7;
}

@media screen and (max-width: 1000px) {
  .mangingModel button{
    left: 0;
    width: 30%;
  }
}



</style>
