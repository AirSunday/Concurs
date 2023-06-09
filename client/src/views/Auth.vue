<template>
  <div class="container">
    <div class='window'>
      <div class='overlay'></div>
      <div class='content'>
        <div class='welcome'>Приветсвуем!</div>
        <div class='subtitle'>Прежде чем воспользоваться нашими услугами, вам необходимо создать учетную запись.</div>
        <div class='input-fields'>
            <div v-if="ModeViewAuthForm === 'Регистрация'">
                <input type="text" class='input-line full-width' v-model="Name" placeholder="Имя">
            </div>
            <input type="text" class='input-line full-width' v-model="Email" placeholder="Почта">
            <input type="password" class='input-line full-width' v-model="Password" placeholder="Пароль">
            <div v-if="ModeViewAuthForm === 'Регистрация'">
                <input type="password" class='input-line full-width' v-model="Repassword" placeholder="Повторите пароль">
            </div>

          <div class="control-group imgPicker" v-if="ModeViewAuthForm === 'Регистрация'">
            <input type="file" id="fileUpload" @change="onFileChange" hidden/>
            <button class='ghost-round full-width' @click="chooseFiles()">Выберите картинку</button>
            <p v-if="file">Картинка загружена</p>
          </div>

        </div>
        <div>
          <button class='ghost-round full-width' v-if="ModeViewAuthForm === 'Регистрация'" @click="Sign">{{ ModeViewAuthForm }}</button>
          <button class='ghost-round full-width' v-else @click="Login">{{ ModeViewAuthForm }}</button>
        </div>
        <div class='spacing'><span class='highlight' @click="ChangeModeAuthForm">{{ ReverseModeViewAuthForm }}</span></div>
      </div>
    </div>
  </div>
  <AlertMessages ref="AddAlertMess"/>
</template>

<script>
import Concurs from "@/services/Concurs";
import AlertMessages from "@/components/AlertMessages";

export default {
  name: "AuthPage",
  components: { AlertMessages },
  data() {
    return {
      authId: 0,
      userName: '',
      PAuthStatus: 'Авторизация',
      ModeViewAuthForm: 'Авторизация',
      ReverseModeViewAuthForm: 'Регистрация',
      Name: "",
      Email: "",
      Password: "",
      Repassword: "",
      file: null,
    };
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
    this.CheckSession();
  },
  methods: {
    AddAlert(mess){
      this.$refs.AddAlertMess.AddAlertMess(mess);
    },
    chooseFiles: function() {
      document.getElementById("fileUpload").click()
    },
    onFileChange(e) {
      this.file = e.target.files[0];
    },
    ChangeModeAuthForm(){
      this.Name = "";
      this.Email = "";
      this.Password = "";
      this.Repassword = "";
      const temp = this.ModeViewAuthForm;
      this.ModeViewAuthForm = this.ReverseModeViewAuthForm;
      this.ReverseModeViewAuthForm = temp;
    },
    CheckSession() {
      Concurs.isAuthenticated().then((res) => {
        if (res.data.login)
          this.$router.push({ path: this.$route.query.redirect || '/' });
      })
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
              this.Name = "";
              this.Email = "";
              this.Password = "";
              this.Repassword = "";
              this.viewAuthForm = false;
              this.$router.push({ path: this.$route.query.redirect || '/' });
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
                let formData = new FormData();
                formData.append("filedata", this.file);
                formData.append("name", this.Name);
                formData.append("email", this.Email);
                formData.append("password", this.Password);
                Concurs.CreateUser(formData)
                    .then(response => {
                      if(response.statusText === "OK"){
                        this.AddAlert({ status: true, message: "Успешная регистрация" });
                        this.Login();
                        this.Name = "";
                        this.Email = "";
                        this.Password = "";
                        this.Repassword = "";
                        this.viewAuthForm = false;
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
  },
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

.container{
  position: fixed;
  top: 50%;
  left: 50%;
  display: flex;
  justify-content: center;
  width: 100%;
  transform: translate(-50%, -50%);
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
  font-size: 2.5rem;
  letter-spacing: 0.05rem;
}

.subtitle {
  text-align: center;
  line-height: 1em;
  font-weight: 100;
  letter-spacing: 0.02rem;
}

.imgPicker img{
  border-radius: 20px 0 0 20px;
  width: 100px;
  height: 100px;
}

.imgPicker p{
  margin: 0;
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
  height: 660px;
  width: 360px;
  background: #fff;
}

.overlay {
  background: -webkit-linear-gradient(var(--color-main), var(--color-main-second));
  background: linear-gradient(var(--color-main), var(--color-main-second));
  opacity: 0.85;
  filter: alpha(opacity=85);
  height: 660px;
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

@media (max-width: 500px) {
  .window {
    width: 100%;
    height: 100%;
  }
  .overlay {
    width: 100%;
    height: 100%;
  }
}
</style>
