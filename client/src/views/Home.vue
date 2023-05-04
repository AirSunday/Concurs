<template>
  <div class="MainScreen">
    <AuthForm/>
    <AddCompetition/>
    <div class="wrapper" v-for="(competition,key) in Competition" :key="key">
      <div class="content-splitter">
        <div class="left">
          <div class="block">
            <div class="header">{{competition.name}}</div>
            <div class="content">{{competition.minitext}}</div>
            <div class="down-content">
              <div class="down-content-left">
                <p>Начало: {{competition.datestart.split('T')[0]}}</p>
                <p>Конец: {{competition.dateend.split('T')[0]}}</p>
              </div>
              <div class="down-content-right">
                <p>Организатор</p>
                <p>Имя организатора</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="right">
<!--        <p>{{competition.image}}</p>-->
<!--        <img src="https://images.unsplash.com/photo-1580707578919-892eb22db615?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTV8fG1hbiUyMHBvcnRyYWl0fGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=60" alt="">-->
        <img src="https://playerok.com/file-storage/images/1ed77f48-061e-6be0-52a6-80b1e05b1977.jpeg?timestamp=1670612753" alt="">
      </div>
    </div>
  </div>
  <AlertMessages ref="AddAlertMess"/>
</template>

<script>
import Concurs from "../services/Concurs";
import AuthForm from "@/components/AuthForm";
import AlertMessages from '@/components/AlertMessages.vue';
import AddCompetition from "@/components/AddCompetition";

export default {
  name: "HomeMain",
  components: {AuthForm, AlertMessages, AddCompetition},
  data() {
    return {
      Competition: [],
      imageUrl: ''
    }
  },
  created() {
    this.GetCompetition();
  },
  methods: {
    AddAlert(mess){
      this.$refs.AddAlertMess.AddAlertMess(mess);
      //this.AddAlert({ status: true, message: "Успешная авторизация" });
    },
    GetCompetition(){
      Concurs.getCompetition().then((response) => {
        this.Competition = response.data;
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
  width: min(100%, 1000px);
  background-color: #f6e8e8;
}

.wrapper {
  display: grid;
  grid-template-columns: 5fr 5fr;
  width: 80%;
  height: 500px;
  max-width: 900px;
  min-width: 250px;
  margin-top: 20px;
  background: hsl(0,0%,95%);
  box-shadow: 1px 1px 25px 3px rgba(0,0,0,.3);
}

.wrapper:hover {
  opacity: 0.7;
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
}

.MainTitle{
  top: 0;
  position: absolute;
  text-align: left;
  font-size: 4vw;
}

@media screen and (min-width: 1000px) {
  .content {
    font-size: 1.2em;
  }
  .down-content{
    font-size: 1em;;
  }
  .header{
    font-size: 2em;;
  }
}

</style>
