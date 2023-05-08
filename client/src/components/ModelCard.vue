<template>
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
        <p>{{score}}: Оценка</p>
        <p>{{dateupload.split('T')[0]}}: Дата загрузки</p>
        <p></p>
      </div>
    </div>
  </div>
  <div class="mangingModel" v-if="personId === personIdNow || role === 'organizer' || role === 'admin'">
    <button @click="DeleteModel">Удалить Модель</button>
    <EditModel :model="model"/>
  </div>
</template>

<script>
import Concurs from "@/services/Concurs";
import EditModel from "@/components/EditModel";

export default {
  name: "ModelCard",
  components: {EditModel},
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
    }
  },
  props: {
    model: {
      type: Object,
      required: true
    },
    role: {
      type: String
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
    reloadPage() {
      location.reload();
    },
    DeleteModel(){
      Concurs.deleteModel({
        modelId: this.model.id,
        participantId: this.model.participant,
        image: this.model.image,
      }).then(() => {
        // this.reloadPage();
      })
    },
  }
}
</script>

<style scoped>

.mangingModel{
  display: flex;
  justify-content: space-between;
  width: 100%;
}

.mangingModel button{
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
  width: 30%;
}

.mangingModel button:hover {
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
  display: grid;
  grid-template-columns: 4fr 6fr;
  border-radius: 20px;
  background: #fff;
  box-shadow: 1px 1px 25px 3px rgba(0,0,0,.3);
  margin-top: 10px;
}
</style>
