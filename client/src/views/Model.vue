<template>
  <GoPrev :path="'/competition/' + competitionId"/>
  <AuthForm/>

  <div class="backEmpty" v-show="showImages"></div>
  <div class="imagesShow" v-show="showImages">
    <p class="closeBtn" @click="showImages = !showImages">&#215;</p>
    <div class="imageCard">
      <div class="imageGoTo">
        <p @click="GoTo(-1)">&#706;</p>
        <img :src="imagePathTemp" alt="">
        <p @click="GoTo(1)">&#707;</p>
      </div>
    </div>
  </div>

  <div class="competitions">
    <div class="spaceEmpty"></div>
    <div class="CardTitle" @click="showImages = !showImages">
      <div v-if="role === 'approval judge'" class="rated" v-bind:class="{ ratedFalse: !rated, ratedTrue: rated}">
        <p v-if="rated">Оценено</p>
        <p v-else>Не оценено</p>
      </div>
      <div class="right">
        <img :src="imagePath" alt="">
      </div>
      <div class="rightContent">
        <p class="TitleCompetition">{{name}}</p>
        <div class="rightContentDown">
          <p>Имя участника:</p>
          <div class="photoProfile">
            <p>{{userName}}</p>
            <div v-show="imageUrlPerson !== ''" class="photo">
              <img :src="imageUrlPerson" alt="">
            </div>
          </div>
          <p>Вид модели: {{view}}</p>
          <p>Масштаб: {{scale}}</p>
          <p>Оценка: {{score}}%</p>
          <p>Дата загрузки: {{dateupload.split('T')[0]}}</p>
        </div>
      </div>
    </div>
    <div class="fullText">
      <p>{{text}}</p>
    </div>
    <div class="menegerCompetitionBtn" v-if="personIdNow === personId || role === 'organizer' || role === 'admin'">
      <button @click="DeleteModel">Удалить Модель</button>
      <button @click="$router.push('/edit/model/' + $route.params.id)">Изменить Модель</button>
    </div>

    <div v-if="role === 'approval judge'" class="ratedClass">
      <div class="criteriaModel" v-if="role === 'approval judge'">
        <div>
          <div class="criteria" v-for="(score, key) in scores" :key="key">
            <p class="welcome">{{score.name}}: </p>
            <div class="criteriaScore">
              <input class="input-line full-width" type="number" v-model="score.score" :min="0" :max="score.maxscore" placeholder="Максимальная оценка"/>
              <p class="welcome"> / {{score.maxscore}}</p>
            </div>
          </div>
        </div>
        <div class="btnSend">
          <button class="ghost-round" @click="SendScore">Оценить</button>
        </div>
      </div>
    </div>
  </div>

  <div class="spaceEmpty"></div>
  <AlertMessages ref="AddAlertMess"/>
</template>

<script>
import AuthForm from "@/components/AuthForm";
import GoPrev from "@/components/GoPrev";
import Concurs from "@/services/Concurs";
import AlertMessages from "@/components/AlertMessages";
import path from "@/services/path";

export default {
  name: "ModelPage",
  components: {AuthForm, AlertMessages, GoPrev},
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
      imagePathTemp: '',
      participant: '',
      score: '',
      dateupload: '',
      personId: '',
      competitionId: '',
      role: '',
      model: {},
      personIdNow: '',
      image: '',
      imageUrlPerson: '',
      rated: true,
      showImages: false,
      scores: [],
      criterias: [],
      images: [],
      imagesTemp: 0,
      previousPage: null
    }
  },
  beforeRouteUpdate(to, from, next) {
    this.GetOneModel(to.params.id);
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
    GoTo(temp){
      this.imagesTemp += temp;
      if(this.imagesTemp < 0) this.imagesTemp = 0;
      if(this.imagesTemp >= this.images.length) this.imagesTemp = this.images.length - 1;
      this.imagePathTemp = path.path + "/image/" + this.images[this.imagesTemp].image;
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

                              if(this.role === 'approval judge') this.getScore();
                            })
                      })
                })
          })
    },
    getScore(){
      Concurs.getCriteria({competitionId: this.competitionId})
          .then(criterias => {
            criterias.data.forEach(criteria => {
              this.scores.push({
                id: criteria.id,
                name: criteria.name,
                score: 0,
                maxscore: criteria.maxscore
              })
            })

            Concurs.getScore({
              competitionId: this.competitionId,
              modelId: this.modelId
            })
                .then(res => {
                  if(res.data.length === 0) this.rated = false;
                  res.data.forEach(nowScore => {
                    const score = this.scores.find(score => score.id === nowScore.criteria_id);
                    if (score) {
                      score.score = nowScore.score;
                    }
                    else this.rated = false;
                  });
                });
          })
    },
    SendScore(){
      this.scores.forEach(score => {
        if(score.score > score.maxscore) score.score = score.maxscore;
        Concurs.sendScore({
          criteriaId: score.id,
          score: score.score,
          maxScore: score.maxscore,
          competitionId: this.competitionId,
          modelId: this.modelId, })
            .then((res) => {
              this.scores = [];
              this.criterias = [];
              this.rated = true;
              this.getScore();
              if(res.statusText == "OK")
                this.AddAlert({ status: true, message: "Оценено " + score.name });
              else
                this.AddAlert({ status: false, message: "Ошибка в оценке " + score.name });
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
            this.image = res.data.dataValues.image;
            this.score = res.data.dataValues.score;
            this.participant = res.data.dataValues.participant;
            this.userName = res.data.person_name;
            this.personId = res.data.person_id;
            this.competitionId = res.data.dataValues.competitiondbId;

            if(res.data.imageUrlPerson !== '') this.imageUrlPerson = path.path + '/image/' + res.data.imageUrlPerson;
            else this.imageUrlPerson = '';

            Concurs.GetModelImages({modelId: this.modelId}).then(images => {
              this.imagePath = path.path + "/image/" + images.data[0].image;
              this.imagePathTemp = this.imagePath;
              this.images = images.data;
            })

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

.imageGoTo {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.imageGoTo p {
  color: #fff;
  margin: 30px;
  font-size: 100px;
}

.imageGoTo p:hover {
  cursor: pointer;
  opacity: 0.7;
}

.imageGoTo img {
  width: 40vw;
  height: auto;
}

.closeBtn{
  position: fixed;
  color: #fff;
  font-size: 100px;
  z-index: 9;
  top: 40px;
  right: 40px;
  margin: 0;
}

.closeBtn:hover {
  cursor: pointer;
  opacity: 0.7;
}

.imagesShow{
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  z-index: 8;
  height: 100%;
}

.backEmpty{
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: black;
  opacity: 0.4;
  z-index: 8;
}

.ratedClass{
  text-align: justify;
  width: calc(100% - 50px);
}

.competitions{
  width: calc(100vw - 360px);
}

@media (max-width: 1000px) {
  .competitions{
    width: calc(100vw - 20px);
  }
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

.CardTitle:hover{
  cursor: pointer;
  opacity: 0.6;
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
  border-radius: 21px 0 0 21px;
}

.right img {
  height: 400px;
  border-radius: 21px 0 0 21px;
}


.criteriaModel{
  border-radius: 30px;
  width: 600px;
  margin: 10px 20px;
  padding: 10px 0;
  background: linear-gradient(var(--color-main), var(--color-main-second));
  transition: all 0.1s ease-in-out;
}

.input-line {
  border: none;
  background: none;
  line-height: 2.4em;
  color: #fff;
  font-weight: 300;
  letter-spacing: 0.02rem;
  font-size: 1.2rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.65);
  -webkit-transition: all .2s ease;
  transition: all .2s ease;
  width: 100px;
  height: 30px;
  margin: 0;
  text-align: right;

}

.input-line:focus {
  outline: none;
  border-color: #fff;
  -webkit-transition: all .2s ease;
  transition: all .2s ease;
}

.welcome {
  margin: 0;
  font-weight: 200;
  text-align: center;
  font-size: 1.5rem;
  letter-spacing: 0.05rem;
  color: #fff;
}

.criteria {
  margin: 10px;
  display: flex;
  align-items: center;
}

.criteriaScore {
  display: flex;
  align-items: center;
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
  -webkit-transition: all .2s ease;
  transition: all .2s ease;
  width: 200px;
  margin-top: 10px;
  margin-bottom: 5px;
  margin-left: 10px;
}

.ghost-round:hover {
  background: rgba(255, 255, 255, 0.15);
  color: #fff;
  -webkit-transition: all .2s ease;
  transition: all .2s ease;
}

.ratedTrue{
  background: #b0ecae;
}

.ratedFalse{
  background: #ecaeae;
}

.rated{
  position: absolute;
  top: 10px;
  padding: 3px;
  left: -3px;
  z-index: 5;
}

.rated p {
  margin: 10px;
}

input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}


@media screen and (max-width: 1200px) {
  .TitleCompetition{
    font-size: 21px;
    font-weight: 150;
    letter-spacing: 0;
  }
}

@media screen and (max-width: 630px) {
  .criteriaModel {
    width: 500px;
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
  .criteriaModel {
    border-radius: 30px;
    width: 300px;
  }
  .ghost-round{
    font-size: 15px;
  }
  .welcome{
    font-size: 17px;
  }
  .input-line{
    font-size: 17px;
  }
}

</style>
