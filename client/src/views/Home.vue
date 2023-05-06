<template>
  <AuthForm/>
  <AddCompetition/>
  <div class="MainScreen">
    <div class="spaceEmpty"></div>
    <div class="Card" v-for="(competition,key) in Competition" :key="key">
      <CardCompetition :competition="competition"/>
    </div>
  </div>
  <AlertMessages ref="AddAlertMess"/>
</template>

<script>
import Concurs from "../services/Concurs";
import AuthForm from "@/components/AuthForm";
import AlertMessages from '@/components/AlertMessages.vue';
import AddCompetition from "@/components/AddCompetition";
import CardCompetition from "@/components/CardCompetition"

export default {
  name: "HomeMain",
  components: {AuthForm, AlertMessages, AddCompetition, CardCompetition},
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

.Card{
  display: flex;
  justify-content: center;
  width: 100%;
  height: 100%;
}

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

.spaceEmpty {
  height: 4vh;
  width: 100px;
}

</style>
