<template>
  <div class="CardModelMain">
    <div class="Rang" v-if="rang < 4">
      <img :src="require(`@/components/images/${rang}.png`)"/>
    </div>
    <div class="CardModel">
      <div class="right">
        <img :src="imagePath" alt="">
      </div>
      <div class="rightContent">
        <p class="TitleCompetition">{{name}}</p>
        <p class="content">{{text}}</p>
        <div class="rightContentDown">
          <p>{{userName}}: Имя участника</p>
          <p>{{view}}: Вид модели</p>
          <p>{{scale}}: Масштаб</p>
          <p>{{score}}%: Оценка</p>
          <p>{{dateupload.split('T')[0]}}: Дата загрузки</p>
          <p></p>
        </div>
      </div>
    </div>
    <div class="manegeModel" v-if="personId === personIdNow || role === 'organizer' || role === 'admin'">
      <button @click="DeleteModel">Удалить Модель</button>
      <EditModel :model="model"/>
    </div>

    <div v-if="role === 'approval judge'" class="rated" v-bind:class="{ ratedFalse: !rated, ratedTrue: rated}">
      <p v-if="rated">Оценено</p>
      <p v-else>Не оценено</p>
    </div>

    <div class="criteriaModel" v-if="role === 'approval judge'">
      <div>
        <div class="criteria" v-for="(score, key) in scores" :key="key">
          <p>{{score.name}}: </p>
          <div class="criteriaScore">
            <input type="number" v-model="score.score" :min="0" :max="score.maxscore" placeholder="Максимальная оценка"/>
            <p> / {{score.maxscore}}</p>
          </div>
        </div>
      </div>
      <div class="btnSend">
        <button @click="SendScore">Оценить</button>
      </div>
    </div>
  </div>
  <AlertMessages ref="AddAlertMess"/>
</template>

<script>
import Concurs from "@/services/Concurs";
import EditModel from "@/components/EditModel";
import AlertMessages from "@/components/AlertMessages"

export default {
  name: "ModelCard",
  components: {EditModel, AlertMessages},
  data() {
    return {
      userName: '',
      name: '',
      view: '',
      scale: '',
      text: '',
      imagePath: '',
      participant: '',
      score: '',
      dateupload: '',
      personId: '',
      personIdNow: '',
      scores: [],
      rated: true
    }
  },
  props: {
    model: {
      type: Object,
      required: true
    },
    role: {
      type: String
    },
    criterias: {
      type: Object,
      required: true
    },
    rang: {
      type: Number,
    }
  },
  created() {
    this.SetModel();
    this.CheckSession();
  },
  methods: {
    SetModel(){
      this.name = this.model.name;
      this.view = this.model.view;
      this.scale = this.model.scale;
      this.dateupload = this.model.dateupload;
      this.text = this.model.text;
      // this.imagePath = "http://localhost:8080/api/image/" + this.model.image;
      this.imagePath = "https://whoisa.ru/api/image/" + this.model.image;
      this.score = this.model.score;
      this.participant = this.model.participant;
      this.userName = this.model.person_name;
      this.personId = this.model.person_id;

      this.criterias.forEach(criteria => {
        this.scores.push({
          id: criteria.id,
          name: criteria.name,
          score: 0,
          maxscore: criteria.maxscore
        })
      })

      Concurs.getScore({
        competitionId: this.$route.params.id,
        modelId: this.model.id
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
    AddAlert(mess){
      this.$refs.AddAlertMess.AddAlertMess(mess);
    },
    reloadPage() {
      location.reload();
    },
    DeleteModel(){
      Concurs.deleteModel({
        modelId: this.model.id,
        participantId: this.model.participant,
        image: this.model.image,
      }).then(() => {
        this.reloadPage();
      })
    },
    SendScore(){
      this.scores.forEach(score => {
        if(score.score > score.maxscore) score.score = score.maxscore;
        Concurs.sendScore({
          criteriaId: score.id,
          score: score.score,
          maxScore: score.maxscore,
          competitionId: this.$route.params.id,
          modelId: this.model.id })
            .then((res) => {
              location.reload();
              if(res.statusText == "OK")
                this.AddAlert({ status: true, message: "Оценено " + score.name });
              else
                this.AddAlert({ status: false, message: "Ошибка в оценке " + score.name });
            })
      })
    }
  }
}
</script>

<style scoped>

.rated {
  position: relative;
  display: flex;
  justify-content: center;
  border-radius: 0 0 20px 20px;
  background: #fff;
  box-shadow: 1px 1px 25px 3px rgba(0,0,0,.3);
  margin-bottom: -20px;
  width: 100%;
  height: 5vh;
  transform: translate(0, -50%);
}

.rated p{
  position: absolute;
  bottom: 0;
  margin: 0;
  right: 50%;
  transform: translate(50%, 0);
  font-size: min(calc(0.5em + 1vw), 18px);
}

.ratedTrue{
  background: #b0ecae;
}

.ratedFalse{
  background: #ecaeae;
}

.btnSend{
  position: absolute;
  bottom: 0;
  right: 0;
}

.btnSend button{
  border-radius: 20px;
  border: 2px solid transparent;
  background: var(--color-main);
  color: #ffffff;
  font-size: calc(0.5em + 1vw);
  line-height: 25px;
  padding: 0.5vw 1vw;
  margin: 1vw 1vw;
  text-align: right;
  transition: 0.25s;
  display: block;
}

.btnSend button:hover {
  opacity: 0.7;
}

.criteriaModel{
  position: relative;
  display: grid;
  grid-template-columns: 5fr 5fr;
}

.criteria {
  display: flex;
  justify-content: space-between;
  margin: 10px;
  border-bottom: 1px solid #ccc;
}

.criteria p{
  font-size: min(calc(0.4em + 1vw), 20px);
}

.criteriaScore{
  display: flex;
}

.criteria input {
  text-align: right;
  font-size: min(calc(0.4em + 1vw), 20px);
  background-color: #ECF0F1;
  margin-left: 10px;
  border: 2px solid transparent;
  font-weight: 200;
  padding: 0 10px;
  transition: border .5s;
}

.criteria input:focus {
  border: 2px solid var(--color-main);
  box-shadow: none;
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

.TitleCompetition{
  word-wrap: break-word;
  text-align: left;
  font-size: min(calc(1em + 1vw), 25px);
  color: transparent;
  -webkit-text-stroke: 1px #222222;
  margin-top: 10px;
  margin-bottom: 0;
}

.content {
  font-size: min(calc(0.4em + 1vw), 17px);
  text-align: justify;
  color: #404040;
  padding-right: 20px;
}

.rightContent {
  position: relative;
}

.rightContentDown {
  position: absolute;
  margin: 10px;
  bottom: 0;
  right: 0;
  font-size: min(calc(0.2em + 1vw), 14px);
}

.rightContentDown p {
  margin: 2px;
  text-align: right;
  opacity: 0.6;
}

.right {
  position: relative;
  border-radius: 20px 0 0 20px;
  overflow: hidden;
  clip-path: polygon(0 0, 80% 0%, 100% 100%, 0% 100%);
  object-fit: cover;
  height: 25vh;
}

.right img {
  border-radius: 20px 0 0 20px;
  height: 400px;
}

.CardModel{
  position: relative;
  display: grid;
  grid-template-columns: 4fr 6fr;
  z-index: 3;
  border-radius: 20px;
  background: #fff;
  box-shadow: 1px 1px 25px 3px rgba(0,0,0,.3);
  margin-top: 10px;
}

.CardModelMain{
  border-radius: 20px;
  background: #fff;
  box-shadow: 1px 1px 25px 3px rgba(0,0,0,.3);
  margin-top: 10px;
}

.Rang {
  position: absolute;
  z-index: 4;
  margin: 10px;
}

.Rang img{
  height: auto;
  width: min(10vw, 100px);
}

@media screen and (max-width: 500px) {
  .Rang img{
    height: auto;
    width: 20vw;
  }
}
</style>
