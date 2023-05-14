<template>
  <GoPrev :path="'/'"/>
  <AuthForm/>
  <div>
    <select class='select-line' v-model="category">
      <option value="" disabled selected hidden>Фильтр по категориям</option>
      <option value="">Все</option>
      <option value="Авиация">Авиация</option>
      <option value="Автомобили">Автомобили</option>
      <option value="Бронетехника">Бронетехника</option>
      <option value="Диорамы">Диорамы</option>
      <option value="Действующие">Действующие</option>
      <option value="Корабли">Корабли</option>
      <option value="Ретро">Ретро</option>
      <option value="Разное">Разное</option>
    </select>
  </div>
  <div class="competitions">
    <div class="emptySpace"></div>
      <div class="list">
          <div v-for="(competition,key) in Competition" :key="key" v-show="category === '' || category === competition.category">
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
      previousPage: null,
      category: '',
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

.listCard {
  margin: 10px 0;
  display: flex;
  justify-content: center;
  width: calc(100vw - 360px);
}

.emptySpace{
  width: 100%;
  height: 80px;
}

.competitions{
  width: calc(100vw - 360px);
}

.select-line {
  padding-left: 10px;
  position: fixed;
  top: 20px;
  left: 100px;
  z-index: 7;
  cursor: pointer;
  background: linear-gradient(var(--color-main), var(--color-main-second));
  border: 1px solid rgba(255, 255, 255, 0.65);
  border-radius: 25px;
  color: rgba(255, 255, 255, 0.65);
  -webkit-align-self: flex-end;
  align-self: flex-end;
  font-size: 1.2rem;
  font-weight: 300;
  line-height: 2.5em;
  -webkit-transition: all .2s ease;
  transition: all .2s ease;
  height: 50px;
  width: 250px;
}

.select-line:hover {
  opacity: 0.7;
}

.select-line option {
  background-color: var(--color-main);
}

@media (max-width: 1000px) {
  .listCard {
    width: calc(100vw);
  }
}

</style>
