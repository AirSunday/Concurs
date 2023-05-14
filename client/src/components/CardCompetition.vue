<template>
  <div class="card" @click="$router.push('/competition/' + competition.id)"
       v-on:mouseover="showFullText = true" v-on:mouseleave="showFullText = false">
    <a v-if="fileUrl !== ''" class="DownloadFile" :href="fileUrl" download>
      <div>
        <p>Положение &#129095;</p>
      </div>
    </a>
    <div class="imgCard">
      <div class="endWaterMark" v-if="datenow >= dateend"><p>Окончено</p></div>
      <img :src="imageUrl" alt="">
    </div >
    <div class="content" v-if="!showFullText">
      <h2>{{competition.name}}</h2>
      <div class="downContent">
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
    <div class="hideText" v-if="showFullText">
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

.card{
  position: relative;
  width: 350px;
  height: 500px;
  border: 3px solid transparent;
  background: linear-gradient(var(--color-main), var(--color-main-second));
  box-shadow: inset 0px 0px 0px 100vw #fff;
  border-radius: 25px;
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

.content h2 {
  margin: 0;
  padding: 5px;
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
  font-size: 18px;
  transition: transform 0.4s ease-in-out;
}

.hideText p{
  margin: 0;
}

.rangTitile{
  margin-bottom: 15px;
  text-align: center;
  font-size: 22px;
}

.imgCard {
  position: relative;
  overflow: hidden;
  height: 200px;
  border: 2px solid transparent;
  background: linear-gradient(var(--color-main), var(--color-main-second));
  box-shadow: inset 0px 0px 0px 100vw #fff;
  border-radius: 20px 20px 0 0;
}

.endWaterMark {
  position: absolute;
  width: 100%;
  height: 100%;
  background: rgba(170, 170, 170, 0.55);
  opacity: 0.9;
  display: flex;
  z-index: 5;
  justify-content: center;
  align-items: center;
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

@media (max-width: 1600px) {
  .card{
    width: 450px;
    height: 500px;
  }
  .card:hover{
    width: 455px;
    height: 505px;
  }
  .content{
    width: 450px;
    height: 300px;
  }

  .hideText{
    width: 450px;
    height: 500px;
  }

}

@media (max-width: 1360px) {
  .card{
    width: 350px;
    height: 500px;
  }
  .card:hover{
    width: 365px;
    height: 515px;
  }
  .content{
    width: 350px;
    height: 300px;
  }

  .hideText{
    width: 340px;
    height: 300px;
  }

}

@media (max-width: 1200px) {
  .card{
    width: 450px;
    height: 500px;
  }
  .card:hover{
    width: 455px;
    height: 505px;
  }
  .content{
    width: 450px;
    height: 300px;
  }

  .hideText{
    width: 450px;
    height: 500px;
  }

}

@media (max-width: 1000px) {
  .card{
    width: 350px;
    height: 500px;
  }
  .card:hover{
    width: 365px;
    height: 515px;
  }
  .content{
    width: 350px;
    height: 300px;
  }

  .hideText{
    width: 340px;
    height: 300px;
  }

}

@media (max-width: 900px) {
  .card{
    width: 450px;
    height: 500px;
  }
  .card:hover{
    width: 455px;
    height: 505px;
  }
  .content{
    width: 450px;
    height: 300px;
  }

  .hideText{
    width: 450px;
    height: 500px;
  }

}

@media (max-width: 850px) {

  .card{
    width: 200px;
    height: 350px;
  }
  .card:hover{
    width: 210px;
    height: 355px;
  }
  .rangTitile{
    font-size: 16px;
  }
  .content{
    width: 200px;
    height: 250px;
    font-size: 13px;
  }

  .content h2 {
    font-size: 15px;
  }

  .hideText{
    width: 190px;
    height: 100px;
    font-size: 12px;
  }

  .imgCard {
    height: 100px;
  }

  .imgCard img {
    height: 100px;
  }
}

</style>
