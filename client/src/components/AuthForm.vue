<template>
  <div v-if="PAuthStatus === 'Авторизация'">
    <div class="AuthFormMain" v-if="viewAuthForm">
      <div class="title">
        <div class="app-title">
          <h1>{{ ModeViewAuthForm }}</h1>
        </div>
        <h1 class="close" @click="viewAuthForm = !viewAuthForm;">&#10006;</h1>
      </div>

      <div class="login-form">
        <div v-if="ModeViewAuthForm === 'Регистрация'">
          <div class="control-group">
            <input type="text" class="login-field" v-model="Name" placeholder="Имя">
            <label class="login-field-icon fui-user"></label>
          </div>
        </div>

        <div class="control-group">
          <input type="text" class="login-field" v-model="Email" placeholder="Почта">
          <label class="login-field-icon fui-user"></label>
        </div>

        <div class="control-group">
          <input type="password" class="login-field" v-model="Password" placeholder="Пароль">
          <label class="login-field-icon fui-lock"></label>
        </div>

        <div v-if="ModeViewAuthForm === 'Регистрация'">
          <div class="control-group">
            <input type="password" class="login-field" v-model="Repassword" placeholder="Повторите пароль">
            <label class="login-field-icon fui-lock"></label>
          </div>
        </div>

        <div class="btn" v-if="ModeViewAuthForm === 'Регистрация'" @click="Sign">{{ ModeViewAuthForm }}</div>
        <div class="btn" v-else @click="Login">{{ ModeViewAuthForm }}</div>

        <div class="app-down">
          <h1 @click="ChangeModeAuthForm">{{ ReverseModeViewAuthForm }}</h1>
        </div>
      </div>
    </div>
    <div class="AuthFormBack" v-if="viewAuthForm"></div>
  </div>

  <div v-else>
    <div class="profile" v-if="viewAuthForm">
      <div class="info">
        <p>Добро пожаловать, {{userName}}!</p>
        <span v-if="organizers.length > 0">Вы организвали:</span>
        <div  v-if="organizers.length > 0" class="Split">
          <p @click="GoToOrganizer(-1)"> &#706; </p>
          <p @click="$router.push('/competition/' + organizers[indexOrganizer][0].id)" class="NameCompetition">
            {{organizers[indexOrganizer][0].name}}
          </p>
          <p @click="GoToOrganizer(1)"> &#707; </p>
        </div>

        <span v-if="judges.length > 0">Вы судите:</span>
        <div  v-if="judges.length > 0" class="Split">
          <p @click="GoToJudge(-1)"> &#706; </p>
          <p @click="$router.push('/competition/' + judges[indexJudge][0].id)" class="NameCompetition">
            {{judges[indexJudge][0].name}}
          </p>
          <p @click="GoToJudge(1)"> &#707; </p>
        </div>

        <span v-if="participants.length > 0">Вы участвуете:</span>
        <div  v-if="participants.length > 0" class="Split">
          <p @click="GoToParticipant(-1)"> &#706; </p>
          <p @click="$router.push('/competition/' + participants[indexParticipant][0].id)" class="NameCompetition">
            {{participants[indexParticipant][0].name}}
          </p>
          <p @click="GoToParticipant(1)"> &#707; </p>
        </div>
      </div>
      <div class="profileBtn">
        <button class="btn btn2" @click="SignOut">Выйти</button>
        <button class="btn btn2" @click="EditProfileShow = !EditProfileShow">Редактировать</button>
      </div>
    </div>
    <div class="AuthFormMain" v-if="EditProfileShow">
      <div class="title">
        <div class="app-title">
          <h1>Изменение профиля</h1>
        </div>
        <h1 class="close" @click="EditProfileShow = !EditProfileShow;">&#10006;</h1>
      </div>

      <div class="login-form">
        <div class="control-group">
          <input type="text" class="login-field" v-model="Name" placeholder="Имя">
          <label class="login-field-icon fui-user"></label>
        </div>

        <div class="control-group">
          <input type="text" class="login-field" v-model="Email" placeholder="Почта">
          <label class="login-field-icon fui-user"></label>
        </div>

        <div class="control-group">
          <input type="password" class="login-field" v-model="Password" placeholder="Пароль">
          <label class="login-field-icon fui-lock"></label>
        </div>

        <div class="control-group">
          <input type="password" class="login-field" v-model="Repassword" placeholder="Повторите пароль">
          <label class="login-field-icon fui-lock"></label>
        </div>

        <div class="btn" @click="EditProfile">Изменить</div>
      </div>
    </div>
    <div class="AuthFormBack" v-if="EditProfileShow"></div>
  </div>

  <button class="AuthFormTitle" @click="viewAuthForm = !viewAuthForm; CheckSession();">{{ PAuthStatus }}</button>
<AlertMessages ref="AddAlertMess"/>
</template>

<script>
import Concurs from '../services/Concurs';
import AlertMessages from './AlertMessages.vue';

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
        };
    },
    created() {
        this.CheckSession();
    },
    methods: {
        AddAlert(mess){
            this.$refs.AddAlertMess.AddAlertMess(mess);
        },
        CheckSession() {
          Concurs.Authentication()
                .then(response => {
                if (response && response.data.userId != 0) {
                  this.authId = response.data.userId;
                  Concurs.findUserById({ userId: this.authId })
                    .then(res => {
                      this.userName = res.data.name;
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
        ChangeModeAuthForm(){
          const temp = this.ModeViewAuthForm;
          this.ModeViewAuthForm = this.ReverseModeViewAuthForm;
          this.ReverseModeViewAuthForm = temp;
        },
        Login(){
          const user = {
            email: this.Email,
            password: this.Password
          };
          Concurs.signIn(user)
              .then(response => {
                if(response.statusText === "OK"){
                  this.AddAlert({ status: true, message: "Успешная авторизация" });
                  this.CheckSession();
                  this.Name = "";
                  this.Email = "";
                  this.Password = "";
                  this.Repassword = "";
                  this.viewAuthForm = false;
                  // this.reloadPage();
                }
                else
                  this.AddAlert({ status: false, message: "Ошибка в авторизации" });
              }).catch(() => {
            this.AddAlert({ status: false, message: "Ошибка в авторизации" });
          });
        },
        Sign(){
          if (this.Password === this.Repassword) {
            const data = {
              email: this.Email,
            };
            Concurs.findUserByEmail(data)
                .then(response => {
                  if (response.data.name) {
                    this.AddAlert({ status: false, message: "Почта занята" });
                    return;
                  }
                  else {
                    const newUser = {
                      name: this.Name,
                      email: this.Email,
                      password: this.Password,
                    };
                    Concurs.CreateUser(newUser)
                        .then(response => {
                          if(response.statusText === "OK"){
                            this.AddAlert({ status: true, message: "Успешная регистрация" });
                            this.CheckSession();
                            this.Login();
                            this.Name = "";
                            this.Email = "";
                            this.Password = "";
                            this.Repassword = "";
                            this.viewAuthForm = false;
                            // this.reloadPage();
                          }
                          else this.AddAlert({ status: false, message: "Ошибка в регистрации" });
                        })
                        .catch(() => {
                          this.AddAlert({ status: false, message: "Ошибка в регистрации" });
                        });
                  }
                });
          }
          else
            this.AddAlert({ status: false, message: "Пароли не совпадают" });
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
          if (this.Password === this.Repassword) {
            const data = {
              email: this.Email,
            };
            Concurs.findUserByEmail(data)
                .then(response => {
                  if (response.data.name) {
                    this.AddAlert({ status: false, message: "Почта занята" });
                    return;
                  }
                  else {
                    const editUser = {
                      userId: this.authId,
                      name: this.Name,
                      email: this.Email,
                      password: this.Password,
                    };
                    Concurs.updateUser(editUser)
                        .then(response => {
                          if(response.statusText === "OK"){
                            this.AddAlert({ status: true, message: "Успешное изменение" });
                            this.CheckSession();
                            this.Name = "";
                            this.Email = "";
                            this.Password = "";
                            this.Repassword = "";
                            this.EditProfileShow = false;
                          }
                          else this.AddAlert({ status: false, message: "Ошибка в изменении" });
                        })
                        .catch(() => {
                          this.AddAlert({ status: false, message: "Ошибка в изменении" });
                        });
                  }
                });
          }
          else
            this.AddAlert({ status: false, message: "Пароли не совпадают" });
        }
    },
    components: { AlertMessages }
}
</script>

<style scoped>
.AuthFormTitle{
  position: absolute;
  z-index: 3;
  border: 2px solid transparent;
  border-radius: 20px;
  background: var(--color-main);
  color: #ffffff;
  font-size: calc(0.5em + 1vw);
  line-height: 25px;
  padding: 0.5vw 1vw;
  text-align: left;
  text-decoration: none;
  text-shadow: none;
  box-shadow: none;
  transition: 0.25s;
  display: block;
  width: 20%;
  right: calc((100vw - 1000px) / 2);
  top: 20px;
  margin: 0;
}

.AuthFormTitle:hover {
  opacity: 0.7;
}

.AuthFormMain{
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 50%;
  min-width: 300px;
  max-width: 500px;
  z-index: 6;
  padding: 10px;
  background: var(--color-second);
  border-radius: 30px;
}

.AuthFormBack{
  top: 0;
  right: 0;
  position: fixed;
  z-index: 5;
  width: 100vw;
  height: 100vh;
  background: #000;
  opacity: 0.8;
}

.title{
  display: flex;
  padding-left: 10%;
}

.close:hover{
  opacity: 0.8;
}

* {
  box-sizing: border-box;
}

*:focus {
  outline: none;
}

.app-title {
  width: 90%;
  font-size: 0.8em;
}

.login-form {
  text-align: center;
}
.control-group {
  margin-bottom: 10px;
}

input {
  text-align: center;
  background-color: #ECF0F1;
  border: 2px solid transparent;
  border-radius: 20px;
  font-size: 16px;
  font-weight: 200;
  padding: 10px;
  width: 80%;
  transition: border .5s;
}

input:focus {
  border: 2px solid var(--color-main);
  box-shadow: none;
}

.btn {
  border-radius: 20px;
  border: 2px solid transparent;
  background: var(--color-main);
  color: #ffffff;
  font-size: calc(0.5em + 1vw);
  line-height: 25px;
  padding: 0.5vw 1vw;
  text-decoration: none;
  text-shadow: none;
  box-shadow: none;
  transition: 0.25s;
  display: block;
  width: 50%;
  margin: 0 auto;
}

.btn:hover {
  opacity: 0.7;
}

.btn2{
  width: 40%;
  margin: 0;
}

.profile{
  position: absolute;
  z-index: 3;
  padding: 10px;
  background: var(--color-second);
  border-radius: 20px;
  border: 2px solid var(--color-main);
  box-shadow: 1px 1px 25px 3px rgba(0,0,0,.3);
  right: calc((100vw - 1000px) / 2);
  top: 20px;
  width: 40vw;
}

.info{
  margin: min(3vw, 40px) 0;
  font-size: calc(0.5em + 1vw);
  width: 100%;
}

.info span{
  margin-left: 10px;
  font-size: calc(0.2em + 1vw);
}

.Split{
  display: flex;
  justify-content: space-between;
  text-align: center;
  background-color: #ECF0F1;
  border: 2px solid transparent;
  border-radius: 20px;
  padding: 10px;
  transition: border .5s;
  margin-bottom: min(3vw, 40px);
}

.Split:hover {
  border: 2px solid var(--color-main);
  box-shadow: none;
}

.Split p{
  margin: 0;
}

.NameCompetition {
  width: 90%
}

.Split p:hover{
  opacity: 0.7;
  cursor: pointer;
}

.profileBtn{
  position: absolute;
  display: flex;
  justify-content: space-between;
  text-align: center;
  bottom: -2px;
  left: 0;
  width: 100%;
}

.app-down{
  font-size: 0.5em;
  opacity: 0.9;
}

.app-down:hover{
  opacity: 0.6;
}

@media screen and (max-width: 1000px) {
  .AuthFormTitle{
    right: 0;
    width: 40%;
  }
  .profile{
    right: 0;
    width: 60vw;
  }
  .info{
    margin: 35px 0;
    font-size: 15px;
  }
  .info span{
    font-size: 15px;
  }

}

</style>
