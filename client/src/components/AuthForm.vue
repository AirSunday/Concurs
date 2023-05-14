<template>

  <div v-if="width <= 1000" class="profileShow">
    <img :src="require(`@/components/images/profile.png`)" @click="viewAuthForm = !viewAuthForm"/>
  </div>

  <div class="container" v-if="width > 1000 || viewAuthForm">
    <div class='window'>
      <div class='overlay'></div>
      <div class="content">
        <div class="closeBtn" v-if="width <= 1000" @click="viewAuthForm = !viewAuthForm">&#10006;</div>

        <div class='welcome'>Добро пожаловать, {{userName}}!</div>
        <div class="photoProfile">
          <div class="photo">
            <img v-if="imageUrl !== ''" :src="imageUrl"/>
            <img v-else :src="require(`@/components/images/profileNone.png`)" class="photoProfile"/>
          </div>
        </div>

        <div class='subtitle' v-if="organizers.length > 0">Вы организвали</div>
        <div  v-if="organizers.length > 0" class="Split">
          <p @click="GoToOrganizer(-1)"> &#706; </p>
          <p @click="$router.push('/competition/' + organizers[indexOrganizer][0].id)" class="NameCompetition">
            {{organizers[indexOrganizer][0].name}}
          </p>
          <p @click="GoToOrganizer(1)"> &#707; </p>
        </div>

        <div class='subtitle' v-if="judges.length > 0">Вы судите</div>
        <div  v-if="judges.length > 0" class="Split">
          <p @click="GoToJudge(-1)"> &#706; </p>
          <p @click="$router.push('/competition/' + judges[indexJudge][0].id)" class="NameCompetition">
            {{judges[indexJudge][0].name}}
          </p>
          <p @click="GoToJudge(1)"> &#707; </p>
        </div>

        <div class='subtitle' v-if="participants.length > 0">Вы участвуете</div>
        <div  v-if="participants.length > 0" class="Split">
          <p @click="GoToParticipant(-1)"> &#706; </p>
          <p @click="$router.push('/competition/' + participants[indexParticipant][0].id)" class="NameCompetition">
            {{participants[indexParticipant][0].name}}
          </p>
          <p @click="GoToParticipant(1)"> &#707; </p>
        </div>

        <div class="profileBtn">
          <button class='ghost-round full-width' @click="EditProfile">Изменить профиль</button>
          <button class='ghost-round full-width' @click="SignOut">Выйти</button>
        </div>

      </div>
    </div>
  </div>
<AlertMessages ref="AddAlertMess"/>
</template>

<script>
import Concurs from '../services/Concurs';
import AlertMessages from './AlertMessages.vue';
import path from "@/services/path";

export default {
    name: "AuthForm",
    data() {
        return {
          authId: 0,
          userName: '',
          viewAuthForm: false,
          PAuthStatus: 'Авторизация',
          ModeViewAuthForm: 'Авторизация',
          ReverseModeViewAuthForm: 'Регистрация',
          Name: "",
          Email: "",
          Password: "",
          Repassword: "",
          indexOrganizer: 0,
          indexJudge: 0,
          indexParticipant: 0,
          organizers: [],
          judges: [],
          participants: [],
          EditProfileShow: false,
          width: window.innerWidth,
          imageUrl: '',
        };
    },
    created() {
      this.CheckSession();
      window.addEventListener("resize", this.updateWidth);
    },
    methods: {
        AddAlert(mess){
            this.$refs.AddAlertMess.AddAlertMess(mess);
        },
        updateWidth() {
          this.width = window.innerWidth;
        },
        CheckSession() {
          Concurs.Authentication()
                .then(response => {
                if (response && response.data.userId != 0) {
                  this.authId = response.data.userId;
                  Concurs.findUserById({ userId: this.authId })
                    .then(res => {
                      this.userName = res.data.name;
                      if(res.data.photo !== '')
                        this.imageUrl = path.path + '/image/' + res.data.photo;
                      this.PAuthStatus = 'Профиль';
                      this.GetCompoetitionProfile();
                    });
                }
                else {
                  this.userName = "";
                  this.authId = 0;
                }
            });
        },
        SignOut() {
          Concurs.signOut({})
              .then(res => {
                if(res.statusText == "OK"){
                  this.AddAlert({ status: true, message: 'Выход из профиля' });
                  this.CheckSession();
                  this.Name = "";
                  this.Email = "";
                  this.Password = "";
                  this.Repassword = "";
                  this.viewAuthForm = false;
                  this.reloadPage();
                }
                else
                  this.AddAlert({ status: false, message: "Ошибка в выходе" });
              })
              .catch(() => {
                this.AddAlert({ status: false, message: "Ошибка в выходе" });
              });
        },
        reloadPage() {
          location.reload();
        },
        GetCompoetitionProfile(){
          Concurs.GetOrganizers({personId: this.authId})
              .then((res) => {
                  this.organizers = res.data;
              })
              .catch(() => {this.AddAlert({ status: false, message: "Ошибка в получение организатора" });});

          Concurs.GetJudges({personId: this.authId})
              .then((res) => {
                  this.judges = res.data;
              })
              .catch(() => {this.AddAlert({ status: false, message: "Ошибка в получение судьи" });});

          Concurs.GetParticipants({personId: this.authId})
              .then((res) => {
                  this.participants = res.data;
              })
              .catch(() => {this.AddAlert({ status: false, message: "Ошибка в получение участника" });});
        },
        GoToParticipant(temp){
          this.indexParticipant += temp;
          if(this.indexParticipant >= this.participants.length)
            this.indexParticipant = this.participants.length - 1;
          else if(this.indexParticipant < 0)
            this.indexParticipant = 0;
        },
        GoToJudge(temp){
          this.indexJudge += temp;
          if(this.indexJudge >= this.judges.length)
            this.indexJudge = this.judges.length - 1;
          else if(this.indexJudge < 0)
            this.indexJudge = 0;
        },
        GoToOrganizer(temp){
          this.indexOrganizer += temp;
          if(this.indexOrganizer >= this.organizers.length)
            this.indexOrganizer = this.organizers.length - 1;
          else if(this.indexOrganizer < 0)
            this.indexOrganizer = 0;
        },
        EditProfile(){
          this.$router.push({ path: '/edit/profile' });
        }
    },
    components: { AlertMessages }
}
</script>

<style scoped>
body,
html {
  margin: 0;
  height: 100%;
}

input {
  border: none;
}

button:focus {
  outline: none;
}

::-webkit-input-placeholder {
  color: rgba(255, 255, 255, 0.65);
}

.photo{
  background: linear-gradient(var(--color-main), var(--color-main-second));
  border: 1px solid rgba(255, 255, 255, 0.65);
  border-radius: 25px;
  color: rgba(255, 255, 255, 0.65);
  width: 100px;
  height: 100px;
}

.photoProfile img{
  border-radius: 25px;
  width: 100px; /* задаем ширину */
  height: 100px; /* задаем высоту */
  object-fit: cover; /* масштабируем изображение */
  object-position: center center; /* выравниваем по центру */
}

.photoProfile{
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.profileShow{
  position: fixed;
  width: 50px;
  height: 50px;
  z-index: 7;
  background: rgba(255, 255, 255, 0.58);
  border-radius: 50px;
  top: 20px;
  right: 40px;
}

.profileShow img{
  width: 50px;
  height: 50px;
}

.profileShow img:hover{
  cursor: pointer;
  opacity: 0.5;
}

.closeBtn {
  position: absolute;
  right: 50px;
  top: 15px;
  font-size: 2.5em;
}

.closeBtn:hover {
  cursor: pointer;
  opacity: 0.5;
}

.container{
  position: fixed;
  z-index: 7;
  right: 0;
  width: 360px;
  height: 100%;
}

.Split {
  background: none;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  border: 1px solid rgba(255, 255, 255, 0.65);
  border-radius: 25px;
  color: rgba(255, 255, 255, 0.65);
  -webkit-align-self: flex-end;
  align-self: flex-end;
  font-size: 1.2rem;
  font-weight: 300;
  line-height: 1.2em;
  margin-top: auto;
  margin-bottom: 25px;
  -webkit-transition: all .2s ease;
  transition: all .2s ease;
}

.Split p {
  margin: 10px;
  padding: 0 5px;
  display: inline-block;
}

.Split p:hover {
  cursor: pointer;
  opacity: 0.4;
}

.NameCompetition{
  width: 200px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: center;
}

.highlight {
  color: rgba(255, 255, 255, 0.8);
  font-weight: 400;
  cursor: pointer;
  transition: color .2s ease;
}

.highlight:hover {
  color: #fff;
  transition: color .2s ease;
}

.spacing {
  position: absolute;
  bottom: -90px;
  left: 50%;
  transform: translate(-50%, 0);
  -webkit-box-flex: 1;
  -webkit-flex-grow: 1;
  flex-grow: 1;
  height: 120px;
  font-weight: 300;
  text-align: center;
  margin-top: 10px;
  color: rgba(255, 255, 255, 0.65)
}

.input-line:focus {
  outline: none;
  border-color: #fff;
  -webkit-transition: all .2s ease;
  transition: all .2s ease;
}

.ghost-round {
  cursor: pointer;
  background: none;
  border: 1px solid rgba(255, 255, 255, 0.65);
  border-radius: 25px;
  color: rgba(255, 255, 255, 0.65);
  -webkit-align-self: flex-end;
  align-self: flex-end;
  font-size: 1.2rem;
  font-weight: 300;
  line-height: 2.5em;
  margin-top: auto;
  margin-bottom: 25px;
  -webkit-transition: all .2s ease;
  transition: all .2s ease;
}

.ghost-round:hover {
  background: rgba(255, 255, 255, 0.15);
  color: #fff;
  -webkit-transition: all .2s ease;
  transition: all .2s ease;
}

.input-line {
  background: none;
  margin-bottom: 10px;
  line-height: 2.4em;
  color: #fff;
  font-weight: 300;
  letter-spacing: 0.02rem;
  font-size: 1.2rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.65);
  -webkit-transition: all .2s ease;
  transition: all .2s ease;
}

.full-width {
  width: 100%;
}

.input-fields {
  margin-top: 25px;
}

.content {
  padding-left: 25px;
  padding-right: 25px;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-flex-flow: column;
  flex-flow: column;
  z-index: 5;
}

.welcome {
  font-weight: 200;
  margin-top: 75px;
  text-align: center;
  font-size: 2rem;
  letter-spacing: 0.05rem;
}

.subtitle {
  margin-top: 20px;
  margin-bottom: 10px;
  text-align: center;
  line-height: 1em;
  font-weight: 100;
  letter-spacing: 0.02rem;
}

.menu {
  background: rgba(0, 0, 0, 0.2);
  width: 100%;
  height: 50px;
}

.window {
  z-index: 100;
  color: #fff;
  position: relative;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-flex-flow: column;
  flex-flow: column;
  box-shadow: 0px 15px 50px 10px rgba(0, 0, 0, 0.2);
  box-sizing: border-box;
  height: 100%;
  width: 360px;
  background: #fff;
}

.overlay {
  background: -webkit-linear-gradient(var(--color-main), var(--color-main-second));
  background: linear-gradient(var(--color-main), var(--color-main-second));
  opacity: 0.85;
  filter: alpha(opacity=85);
  height: 100%;
  position: absolute;
  width: 360px;
  z-index: 1;
}

.bold-line {
  background: #e7e7e7;
  position: absolute;
  top: 0px;
  bottom: 0px;
  margin: auto;
  width: 100%;
  height: 360px;
  z-index: 1;
  opacity:0.1;
  background-size:cover;
}

.profileBtn{
  position: absolute;
  width: 300px;
  left: 50%;
  bottom: 0;
  transform: translate(-50%, 0);
}

@media (max-width: 700px) {
  .window {
    width: 100%;
    height: 100%;
  }
  .overlay {
    width: 100%;
    height: 100%;
  }
  .container {
    width: 100%;
    height: 100%;
  }
}

</style>
