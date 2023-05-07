<template>
  <div class="CardModel">
    <div class="right">
      <img :src="imagePath" alt="">
    </div>
    <div class="rightContent">
      <p class="TitleCompetition">{{name}}</p>
      <p class="content">{{text}}</p>
      <div class="rightContentDown">
        <p>{{participant}}: Имя участника</p>
        <p>{{view}}: Вид модели</p>
        <p>{{scale}}: Масштаб</p>
        <p>{{score}}: Оценка</p>
        <p>{{dateupload.split('T')[0]}}: Дата загрузки</p>
        <p></p>
      </div>
    </div>
  </div>
</template>

<script>
// import Concurs from "@/services/Concurs";

export default {
  name: "ModelCard",
  data() {
    return {
      name: '',
      view: '',
      scale: '',
      text: '',
      imagePath: '',
      participant: '',
      score: '',
      dateupload: '',
    }
  },
  props: {
    model: {
      type: Object,
      required: true
    }
  },
  created() {
    this.SetModel();
  },
  methods: {
    SetModel(){
      this.name = this.model.name;
      this.view = this.model.view;
      this.scale = this.model.scale;
      this.dateupload = this.model.dateupload;
      this.text = this.model.text;
      // this.imagePath = "http://localhost:8080/api/image/" + this.model.image;
      this.imagePath = "http://whoisa.ru/api/image/" + this.model.image;
      this.score = this.model.score;
      this.participant = this.model.participant;
    }
  }
}
</script>

<style scoped>

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
}

.rightContent {
  position: relative;
}

.rightContentDown {
  position: absolute;
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
  overflow: hidden;
  clip-path: polygon(0 0, 80% 0%, 100% 100%, 0% 100%);
  object-fit: cover;
  height: 25vh;
}

.right img {
  height: 400px;
}

.CardModel{
  display: grid;
  grid-template-columns: 4fr 6fr;
  background: #fff;
  box-shadow: 1px 1px 25px 3px rgba(0,0,0,.3);
  margin-top: 10px;
}
</style>
