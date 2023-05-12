<template>
  <GoPrev :path="'/'"/>
  <AuthForm/>
    <div class="competitions">
      <div class="emptySpace"></div>
        <div class="list">
            <div v-for="(competition,key) in Competition" :key="key">
              <div class="listCard">
                <CardCompetition :competition="competition"/>
              </div>
            </div>
        </div>
      <div class="emptySpace"></div>
    </div>
  <AlertMessages ref="AddAlertMess"/>
</template>

<script>
import AuthForm from "@/components/AuthForm";
import Concurs from "@/services/Concurs";
import AlertMessages from '@/components/AlertMessages.vue';
import CardCompetition from '@/components/CardCompetition.vue';
import GoPrev from "@/components/GoPrev";

export default {
  name: "CompetitionsPage",
  components: { AuthForm, AlertMessages, CardCompetition, GoPrev},
  data() {
    return {
      Competition: [],
      imageUrl: '',
      width: window.innerWidth,
      previousPage: null
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.previousPage = from.fullPath
    })
  },
  beforeRouteLeave(to, from, next) {
    this.previousPage = from.fullPath;
    next();
  },
  created() {
    this.GetCompetition();
  },
  methods: {
    GetCompetition(){
      Concurs.getCompetition().then((response) => {
        this.Competition = response.data;
      })
    },
  }
}
</script>

<style scoped>

.list{
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
}

.listCard {
  width: 410px;
  height: 530px;
}

.emptySpace{
  width: 100%;
  height: 80px;
}

.competitions{
  width: calc(100vw - 360px);
}

@media (max-width: 1000px) {
  .competitions{
    width: calc(100vw - 20px);
  }
}

@media (max-width: 600px) {
  .listCard {
    width: 230px;
    height: 320px;
  }
}
</style>
