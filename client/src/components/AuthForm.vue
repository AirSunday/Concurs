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
    <div class="AuthFormBack" v-if="viewAuthForm">
      Теперь только на выход
      <div class="btn btn-primary btn-large btn-block" @click="SignOut">Выйти с двух ног</div>
    </div>
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
                  this.reloadPage();
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
                            this.reloadPage();
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
  background: #e0b5b5;
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
  right: calc((100vw - 1076px) / 2);
  top: 20px;
  margin: 0;
}

.AuthFormTitle:hover {
  background-color: #e7cbcb;
}

.AuthFormMain{
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 50%;
  min-width: 300px;
  max-width: 500px;
  z-index: 4;
  padding: 10px;
  background: #e1cfcf;
  border-radius: 30px;
}

.AuthFormBack{
  top: 0;
  right: 0;
  position: fixed;
  z-index: 3;
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
  border-radius: 3px;
  font-size: 16px;
  font-weight: 200;
  padding: 10px 0;
  width: 80%;
  transition: border .5s;
}

input:focus {
  border: 2px solid #e0b5b5;
  box-shadow: none;
}

.btn {
  border: 2px solid transparent;
  background: #e0b5b5;
  color: #ffffff;
  font-size: 16px;
  line-height: 25px;
  padding: 10px 0;
  text-decoration: none;
  text-shadow: none;
  box-shadow: none;
  transition: 0.25s;
  display: block;
  width: 50%;
  margin: 0 auto;
}

.btn:hover {
  background-color: #e0b5b5;
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
}

</style>
