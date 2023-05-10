<template>
  <div class="MainWrapper">
    <a v-if="fileUrl !== ''" class="DownloadFile" :href="fileUrl" download>
      <div>
        <p>Положение &#129095;</p>
      </div>
    </a>
    <div @click="$router.push('/competition/' + competition.id)" class="wrapper">
      <div class="content-splitter">
        <div class="left">
          <div class="block">
            <div class="header">{{competition.name}}</div>
            <div class="content">{{competition.minitext}}</div>
            <div class="down-content">
              <div class="down-content-left">
                <div v-if="datenow < dateend">
                  <p>Старт: {{competition.datestart.split('T')[0]}}</p>
                  <p>Конец: {{competition.dateend.split('T')[0]}}</p>
                </div>
                <div v-else>
                  <p>Конкурс</p>
                  <p>закончился</p>
                </div>
              </div>
              <div class="down-content-right">
                <p>Категория: Моделирование</p>
                <p>Организатор: {{competition.organizer_name}}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="right">
        <img :src="imageUrl" alt="">
      </div>
    </div>
    <div @click="$router.push('/competition/' + competition.id)" class="winner" v-if="winners.length > 0">
      <p class="winnerTitile">Победители</p>
      <div v-for="(winner, key) in winners" :key="key">
        <div class="winnerList" v-if="winner.score > 0" >
          <div class="leftWinner"  v-bind:class="{'win1': key === 0, 'win2': key === 1,'win3': key === 2,}">
            <p>{{key + 1}}</p>
          </div>
          <div class="rightWinner">
            <div>
              <p>Название модели: {{winner.name}}</p>
            </div>
            <div>
              <p>Имя участника: {{winner.person_name}}</p>
            </div>
            <div>
              <p>Оценка: {{winner.score}}</p>
            </div>
          </div>
        </div>
      </div>
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
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 5;
  height: 30px;
  bottom: 5px;
  right: 5px;
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

.MainWrapper{
  position: relative;
  width: 80%;
}

.winnerTitile{
  width: 100%;
  text-align: center;
  font-size: calc(0.6em + 1vw);
  margin: 10px;
}

.wrapper {
  display: grid;
  border-radius: 20px;
  grid-template-columns: 5fr 5fr;
  width: 100%;
  height: 500px;
  max-width: 900px;
  min-width: 250px;
  margin-top: 20px;
  background: hsl(0,0%,95%);
  box-shadow: 1px 1px 25px 3px rgba(0,0,0,.3);
}

.winners p{
  font-size: calc(0.4em + 1vw);
}

.winner{
  position: relative;
  z-index: -1;
  border-radius: 0 0 20px 20px;
  background: hsl(0,0%,95%);
  box-shadow: 1px 1px 25px 3px rgba(0,0,0,.3);
  padding: 10px 3px 3px 3px;
  transform: translate(0, -5%);
}

.winnerList{
  margin: 5px;
  display: flex;
  justify-content: space-between;
  align-content: center;
  border-radius: 20px;
}

.leftWinner{
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 20px 0 0 20px;
  width: 2vw;
  text-align: center;
}

.rightWinner{
  width: 100%;
  border-radius: 0 20px 20px 0;
  background-color: #e6e9ea;
}

.leftWinner p{
  display: inline-block;
  font-size: calc(0.4em + 1vw);
}

.rightWinner p {
  margin: 5px;
  font-size: calc(0.4em + 1vw);
}

.win1{
  background: #ffdd4b;
}

.win2{
  background: #dadada;
}

.win3{
  background: #bca08f;
}

.wrapper:hover {
  opacity: 0.7;
  transition: 0.5s;
}

.winner:hover {
  opacity: 0.7;
  transition: 0.5s;
}

.header{
  word-wrap: break-word;
  text-align: left;
  font-size: calc(1em + 1vw);
  color: transparent;
  -webkit-text-stroke: 1px #222222;
}

.content-splitter {
  display: flex;
  flex-direction: column;
  gap: 2em;
}

.left {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 4em;
  padding-left: 1em;
  width: max(80px, 90%);
  height: 500px;
}
.block {
  display: flex;
  flex-direction: column;
  gap: .75em;
}
.content {
  font-size: calc(0.4em + 1vw);
  text-align: justify;
  color: #404040;
}

.down-content{
  opacity: 0.6;
  width: 100%;
  position: absolute;
  bottom: 5px;
  display: flex;
  justify-content: space-between;
  font-size: calc(0.2em + 1vw);
}

.down-content p {
  margin: 2px;
  white-space: nowrap;
}

.down-content-left{
  text-align: left;
}

.down-content-right{
  text-align: right;
}

.right {
  position: relative;
  overflow: hidden;
  clip-path: polygon(35% 0%, 100% 0, 100% 100%, 8% 100%);
  object-fit: cover;
  /*width: max(80px, 50%);*/
}
.right img {
  position: absolute;
  right: 0;
  height: 100%;
  border-radius: 0 20px 20px 0;
}

@media screen and (max-width: 500px) {
  .wrapper {
    grid-template-columns: 7fr 3fr;
    height: 300px;
  }
  .right img {
    height: 300px;
  }
  .left {
    height: 300px;
  }
  .down-content{
    width: 90%;
    font-size: calc(0.3em + 1vw);
  }
  .header{
    font-size: 0.8em;;
  }
  .DownloadFile{
    font-size: 10px;
  }
}

@media screen and (min-width: 1000px) {
  .content {
    font-size: 1.2em;
  }
  .leftWinner p{
    font-size: 1.2em;
  }
  .rightWinner p {
    font-size: 1.2em;
  }
  .winnerTitile{
    font-size: 1.6em;
  }
  .down-content{
    font-size: 1em;;
  }
  .header{
    font-size: 1.5em;;
  }
}

</style>
