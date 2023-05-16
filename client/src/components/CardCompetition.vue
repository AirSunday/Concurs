<template>

  <div class="CardTitle"  @click="$router.push('/competition/' + competition.id)"
       v-on:mouseover="showFullText = true" v-on:mouseleave="showFullText = false">
    <a v-if="fileUrl !== ''" class="DownloadFile" :href="fileUrl" download>
      <div>
        <p>Положение &#129095;</p>
      </div>
    </a>
    <div class="right">
      <img :src="imageUrl" alt="">
    </div>
    <div class="rightContent" v-show="!showFullText">
      <p class="TitleCompetition">{{competition.name}}</p>
      <div class="rightContentDown">
        <p>Категория: {{competition.category}}</p>
        <div v-if="datenow < dateend">
          <p>Старт: {{competition.datestart.split('T')[0]}}</p>
          <p>Конец: {{competition.dateend.split('T')[0]}}</p>
        </div>
        <div v-else>
          <p>Конкурс</p>
          <p>закончился</p>
        </div>
      </div>
    </div>
    <div class="hideText" v-show="showFullText">
      <div class="winners" v-if="datenow >= dateend">
        <div v-for="(winner ,key) in winners" :key="key">
          <p class="rangTitile">&#9733; Место {{key + 1}} &#9733;</p>
          <p>Участник: {{winner.person_name}}</p>
          <p>Модель: {{winner.name}}</p>
          <p>Оценка: {{winner.score}}%</p>
        </div>
      </div>
      <p v-else>{{competition.minitext}}</p>
    </div>
  </div>

</template>

<script>

import Concurs from "@/services/Concurs";
import path from "@/services/path";

export default {
  name: "cardCompetiyion",
  data() {
    return {
      imageUrl: '',
      fileUrl: '',
      datenow: '',
      dateend: '',
      winners: [],
      showFullText: false,
    };
  },
  props: {
    competition: {
      type: Object,
      required: true
    }
  },
  created(){
    this.imageUrl = path.path + "/image/" + this.competition.image_path;
    if(this.competition.fileDop !== '')
      this.fileUrl = path.path + "/file/" + this.competition.fileDop;
    else this.fileUrl = '';
    this.datenow = new Date();
    this.dateend = new Date(this.competition.dateend);
    if(this.datenow > this.dateend) this.GetWinner();
  },
  methods: {
    GetWinner(){
      Concurs.getWinner({competitionId: this.competition.id})
          .then(res => {
            this.winners = res.data;
          })
    },

  }
}
</script>

<style scoped>

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
  font-weight: 100;
  letter-spacing: 0;
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

.DownloadFile{
  opacity: 0.7;
  z-index: 3;
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
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

.content p {
  margin: 0;
}

.content h2 {
  margin: 0;
  padding: 5px;
}

.hideText{
  text-align: justify;
  margin: 10px;
  padding: 0 5px;
  font-size: calc(0.7em + 1vw);
  transition: transform 0.4s ease-in-out;
}

.hideText p{
  margin: 0;
}

.winners p{
  font-size: calc(0.3em + 1vw);
}

.rangTitile{
  margin-bottom: 15px;
  text-align: center;
  font-size: 22px;
}

.endWaterMark p{
  color: #fff;
  font-size: 18px;
}

.imgCard img {
  object-fit: cover;
  height: 200px;
  width: 100%;
  transform-origin: center;
  transform: scale(1.001);
  transition: transform 0.4s ease-in-out;
}

@media (max-width: 1550px) {
  .hideText{
    font-size: calc(0.3em + 1vw);
  }
  .winners p{
    font-size: 20px;
  }
}

@media (max-width: 1000px) {
  .hideText{
    font-size: calc(0.7em + 1vw);
  }
  .winners p{
    font-size: 18px;
  }
}


@media (max-width: 400px) {
  .hideText{
    font-size: calc(0.7em + 1vw);
  }
  .winners p{
    font-size: 16px;
  }
}

</style>
