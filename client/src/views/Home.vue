<template>

  <AuthForm/>

  <div class="routerCards">

    <div class="nowCompetition card" @click="$router.push('/competition')">
      <div>
        <div class='welcome'>Посмотреть действующие конкурсы</div>
        <div class='subtitle' v-if="width > 1260">
          Перейти на страницу, где вы сможете ознакомиться с конкурсами, в которых может принять участи каждый
        </div>
      </div>
    </div>

    <div class="endCompetition card" @click="$router.push('/competition/end')">
      <div>
        <div class='welcome'>Посмотреть завершенные конкурсы</div>
        <div class='subtitle' v-if="width > 1260">
          Перейти на страницу, где расположены завершенные конкурсы и представлены победители
        </div>
      </div>
    </div>

    <div class="createCompetition card" @click="$router.push('/add/competition')">
      <div>
        <div class='welcome'>Создать конкурс</div>
        <div class='subtitle' v-if="width > 1260">
          Создайте конкурс, в котором сможет поучаствовать каждый желающий!
          Назначайте судей, которые оценят работу других участников, чтобы выявить лучшую работу
        </div>
      </div>
    </div>

    <div class="contacts card">
      <div style="width: 100%">
        <div v-if="width > 1260" class='welcome'>Контакты</div>
        <a href="https://vk.com/chesheerchick">
          <div class="link">
            <img :src="require(`@/components/images/vk.png`)"/>
            <p v-if="width > 1260">мы в вконтакте</p>
          </div>
        </a>
        <a href="https://t.me/@nasyapur">
          <div class="link">
            <img :src="require(`@/components/images/telegram.png`)"/>
            <p v-if="width > 1260">мы в телеграмм</p>
          </div>
        </a>
        <div class="link" @click="copy()">
          <img :src="require(`@/components/images/mail.png`)"/>
          <p v-if="width > 1260">mymail@gmail.com</p>
        </div>
      </div>
    </div>

  </div>
  <AlertMessages ref="AddAlertMess"/>
</template>

<script>
// import Concurs from "../services/Concurs";
import AuthForm from "@/components/AuthForm";
import AlertMessages from '@/components/AlertMessages.vue';
// import AddCompetition from "@/components/AddCompetition";
// import CardCompetition from "@/components/CardCompetition"

export default {
  name: "HomeMain",
  // components: {AuthForm, AlertMessages, AddCompetition, CardCompetition},
  components: { AuthForm, AlertMessages },
  data() {
    return {
      width: window.innerWidth,
    }
  },
  created() {
    window.addEventListener("resize", this.updateWidth);
  },
  methods: {
    AddAlert(mess){
      this.$refs.AddAlertMess.AddAlertMess(mess);
    },
    updateWidth() {
      this.width = window.innerWidth;
    },
    copy() {
      navigator.clipboard.writeText('mymail@gmail.com')
          .then(() => {
            this.$refs.AddAlertMess.AddAlertMess({ status: true, message: "Почта скопирована" });
          })
          .catch(() => {
            // возможно, пользователь не дал разрешение на чтение данных из буфера обмена
            this.$refs.AddAlertMess.AddAlertMess({ status: true, message: "Ошибка в копировании" });
          });
    },
  }
}
</script>

<style scoped>

.welcome {
  font-weight: 200;
  text-align: center;
  font-size: 2.5rem;
  letter-spacing: 0.05rem;
  padding: 10px;
}

.subtitle {
  text-align: center;
  line-height: 1em;
  font-weight: 100;
  font-size: 1.5rem;
  letter-spacing: 0.02rem;
  padding: 10px;
}

.contacts img{
  width: 40px;
  height: 40px;
  filter: brightness(100%);
}

.contacts a{
  text-decoration: none;
}

.link{
  color: black;
  margin: 20px;
  padding: 5px;
  background: none;
  border: 1px solid #000;
  border-radius: 25px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 85%;
}

.link:hover{
  cursor: pointer;
  background: rgba(255, 255, 255, 0.30);
}

.link p{
  padding: 0 20px;
  width: 100%;
  margin: 0;
  line-height: 1em;
  font-weight: 100;
  font-size: 1.5rem;
}

.routerCards{
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  width: calc(100vw - 360px);
}

.card {
  margin: 30px;
  width: 30vw;
  height: 30vw;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 3px solid transparent;
  background: linear-gradient(var(--color-main), var(--color-main-second));
  box-shadow: inset 0px 0px 0px 100vw var(--color-back);
  border-radius: 70px;
  transition: all 0.1s ease-in-out;
}

.card:hover {
  cursor: pointer;
  color: #fff;
  box-shadow: none;
  width: 31vw;
  height: 31vw;
}

@media (max-width: 1260px) {
  .card {
    width: 25vw;
    height: 25vw;
  }
  .card:hover {
    width: 26vw;
    height: 26vw;
  }
  .link{
    display: flex;
    justify-content: center;
  }
}

@media (max-width: 1000px) {
  .routerCards{
    width: calc(100vw - 100px);
  }
  .card {
    width: 300px;
    height: 300px;
    border-radius: 50px;
  }
  .card:hover {
    width: 310px;
    height: 310px;
  }
}

@media (min-width: 1300px) {
  .card {
    width: 400px;
    height: 400px;
  }
  .card:hover {
    width: 410px;
    height: 410px;
  }
  .contacts{
    display: flex;
    justify-content: center;
    align-items: center;
  }
}

@media (max-width: 500px) {
  .link{
    margin: 20px 0 ;
  }
}

</style>
