<template>

  <div class="card" @click="$router.push('/model/' + model.id)"
       v-on:mouseover="showFullText = true" v-on:mouseleave="showFullText = false">
    <div v-if="role === 'approval judge'" class="rated" v-bind:class="{ ratedFalse: !rated, ratedTrue: rated}">
      <p v-if="rated">Оценено</p>
      <p v-else>Не оценено</p>
    </div>
    <div class="imgCard">
      <img :src="imagePath" alt="">
    </div >
    <div class="content" v-if="!showFullText">
      <p class="titleCard">{{name}}</p>
      <div class="downContent">
        <p>Имя участника: {{userName}}</p>
        <p>Вид модели: {{view}}</p>
        <p>Масшта: {{scale}}</p>
        <p>Оценка: {{score}}%</p>
        <p>Дата загрузки: {{dateupload.split('T')[0]}}</p>
      </div>
    </div>
    <div class="hideText" v-if="showFullText">
      <p>{{text}}</p>
    </div>
  </div>
  <AlertMessages ref="AddAlertMess"/>
</template>

<script>
import Concurs from "@/services/Concurs";
import AlertMessages from "@/components/AlertMessages"
import path from "@/services/path";

export default {
  name: "ModelCard",
  components: {AlertMessages},
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
      rated: true,
      showFullModel: false,
      showFullText: false,
    }
  },
  props: {
    model: {
      type: Object,
      required: true
    },
    rang: {
      type: Number,
    },
    role: {
      type: String,
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
      this.imagePath = path.path + "/image/" + this.model.image;
      this.score = this.model.score;
      this.userName = this.model.person_name;
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
    getScore() {
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
                  if (res.data.length === 0) this.rated = false;
                  res.data.forEach(nowScore => {
                    const score = this.scores.find(score => score.id === nowScore.criteria_id);
                    if (score) {
                      score.score = nowScore.score;
                    } else this.rated = false;
                  });
                });
          })
    }
  }
}
</script>

<style scoped>

.card{
  position: relative;
  width: 350px;
  height: 500px;
  border: 3px solid transparent;
  background: linear-gradient(var(--color-main), var(--color-main-second));
  box-shadow: inset 0px 0px 0px 100vw #fff;
  transition: all 0.1s ease-in-out;
}

.card:hover{
  width: 365px;
  height: 515px;
}

.content{
  text-align: justify;
  width: 350px;
  height: 300px;
  position: relative;
}

.content p {
  margin: 0;
}

.titleCard {
  margin: 0;
  padding: 5px;
  font-size: 25px;
}

.downContent{
  position: absolute;
  bottom: 10px;
  left: 10px;
}

.hideText{
  text-align: justify;
  width: 340px;
  height: 300px;
  padding: 0 5px;
  font-size: 16px;
  transition: transform 0.4s ease-in-out;
}

.hideText p{
  margin: 5px;
}

.imgCard {
  overflow: hidden;
  height: 200px;
  border: 2px solid transparent;
  background: linear-gradient(var(--color-main), var(--color-main-second));
  box-shadow: inset 0px 0px 0px 100vw #fff;
}

.imgCard img {
  object-fit: cover;
  height: 200px;
  width: 100%;
  transform-origin: center;
  transform: scale(1.001);
  transition: transform 0.4s ease-in-out;
}

@media (max-width: 800px) {

  .card{
    width: 200px;
    height: 300px;
  }
  .card:hover{
    width: 210px;
    height: 310px;
  }

  .content{
    width: 200px;
    height: 200px;
    font-size: 10px;
  }

  .titleCard {
    font-size: 15px;
  }

  .hideText{
    width: 190px;
    height: 100px;
    font-size: 10px;
  }

  .imgCard {
    height: 100px;
  }

  .imgCard img {
    height: 100px;
  }
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

.ratedTrue{
  background: #b0ecae;
}

.ratedFalse{
  background: #ecaeae;
}

</style>
