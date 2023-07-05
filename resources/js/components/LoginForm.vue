<template>
  <v-card id="loginform" class="px-5">
    <v-card-title class="px-5 pt-8 pb-0">Login</v-card-title>
    <v-card-text class="py-5">
      <v-text-field outlined required type="text" name="username" label="Username" v-model="loginEmail"
        :rules="loginEmailrules" @keydown.enter="submitLogin" autofocus>
      </v-text-field>
      <v-text-field outlined required id="password" label="Password" type="password" name="password"
        v-model="loginPassword" :rules="loginPasswordrules" @keydown.enter="submitLogin">
      </v-text-field>
      <v-btn :loading="loadingLogin" width="100%" height="55" large grey lighten-1
        :class="`mb-3 ${loginValid == true ? 'primary' : 'grey lighten-2'}`" :disabled="!loginValid"
        @click="submitLogin">Login</v-btn>
      <div class="d-flex justify-space-between align-center my-3"></div>

      <v-alert v-if="hasError == true" type="error">
        {{ message }}
      </v-alert>
    </v-card-text>
  </v-card>
</template>

<script>
import gagUserClient from "../services/gagUserClient";
export default {
  data() {
    return {
      loadingLogin: false,
      hasError: false,
      loginValid: true,
      loginEmail: "",
      loginEmailrules: [
        (value) => !!value || "Required",
        // value => /.+@.+\..+/.test(value) || "E-mail must be valid"
      ],
      loginPassword: "",
      loginPasswordrules: [
        (value) => !!value || "Required",
        (value) =>
          (value && value.length > 8) ||
          "Password must be atleast 8 characters",
      ],

      message: "",
      is_logged: this.$store.state.authUser,
      test: false,
      key: this.VUE_APP_KEY
    };
  },
  methods: {
    submitLogin() {
      this.loadingLogin = true;
      let data = {
        username: this.loginEmail,
        password: this.loginPassword,
        url: this.key
      };

      gagUserClient.get("/sanctum/csrf-cookie").then((res) => {
        gagUserClient.post("api/sanctumlogin", data).then((response) => {
         console.log(response.data);
          this.loadingLogin = false;
          if (response.data.status) {
            this.$store.dispatch("fetchAuthUser", response.data.user);
            localStorage.setItem("gag_users_token", response.data.token.toString());
            localStorage.setItem("gag_users_profile", JSON.stringify(response.data.user));
            this.test = true;
            window.location.href = "/d/admin/dashboard";
          } else {
            this.hasError = true;
            this.message = response.data.message;
          }
        }).catch((err) => {
          console.log("Error: ", err);
        });
      });
    },
  },

  watch: {
    '$store.state.authUser.userObject': function () {
      if (!this.test) {
        if (this.$store.state.authUser.userObject) {
          window.location.href = "/d/admin/dashboard";
        }
      }
    },
  },
};
</script>
