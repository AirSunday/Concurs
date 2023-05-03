<template>
  <AuthForm/>
  <AddCompetition/>

  <div class="card" v-for="(competition,key) in Competition" :key="key">
    <p>{{competition.name}}</p>
    <p>{{competition.minitext}}</p>
    <p>{{competition.fulltext}}</p>
    <p>{{competition.datestart.split('T')[0]}}</p>
    <p>{{competition.dateend.split('T')[0]}}</p>
    <p>{{competition.image}}</p>
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
.card{
  background-color:red;
  margin: 10px;
}
</style>
