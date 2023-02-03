<template>
  <div>
    <v-card>
      
      <v-card-text>
        <v-dialog v-model="dialog" persistent max-width="600">
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="secondary" dark v-bind="attrs" v-on="on">
              Change password
            </v-btn>
          </template>
          <v-card :loading="loading">
            <v-card-title class="text-h5"> Change Password </v-card-title>
            <v-card-text>
              <ValidationObserver
                ref="change_password_observer"
                v-slot="{ valid }"
              >
                <v-form ref="form">
                  <ValidationProvider
                    v-slot="{ errors }"
                    rules="required|min:9"
                    name="Password"
                  >
                    <v-text-field
                      dense
                      type="password"
                      v-model="userPassword.password"
                      label="Password"
                      outlined
                      required
                      :disabled="loading"
                      name="password"
                      :error-messages="errors"
                    ></v-text-field>
                  </ValidationProvider>
                  <ValidationProvider
                    v-slot="{ errors }"
                    rules="required|confirmed:Password"
                    name="Password Confirmation"
                  >
                    <v-text-field
                      dense
                      type="password"
                      v-model="userPassword.password_confirmation"
                      label="Confirm Password"
                      name="password_confirmation"
                      required
                      outlined
                      :disabled="loading"
                      :error-messages="errors"
                    ></v-text-field>
                  </ValidationProvider>
                  <div class="d-flex">
                    <v-spacer></v-spacer>
                    <v-btn
                      color="primary darken-1"
                      class="mr-2"
                      text
                      @click="dialog = false"
                    >
                      cancel
                    </v-btn>
                    <v-btn
                      :disabled="!valid"
                      color="primary"
                      @click="changePassword"
                    >
                      Update
                    </v-btn>
                  </div>
                </v-form>
              </ValidationObserver>
            </v-card-text>
          </v-card>
        </v-dialog>
      </v-card-text>
    </v-card>
    <snack-bar :snackbar-options="sbOptions"></snack-bar>
  </div>
</template>

<script>
import {
  ValidationObserver,
  ValidationProvider,
} from "vee-validate/dist/vee-validate.full";
export default {
  components: {
    ValidationProvider,
    ValidationObserver,
  },
  props: {
    user:{
      type: Object,
      default: null
    }
  },
  data() {
    return {
      dialog: false,
      loading: false,
      sbOptions: {},
      userPassword: {
        password: "",
        password_confirmation: "",
      },
    };
  },
  methods: {
    changePassword() {
      this.loading = true;
      let data = {
        id: this.user ? this.user.id : this.$route.params.id,
        password: this.userPassword.password,
        password_confirmation: this.userPassword.password_confirmation,
      };
      axios
        .post("/d/admin/user/changepassword", data)
        .then((response) => {
          this.sbOptions = {
              status: true,
              type: "success",
              text: response.data.msg,
            };
          this.$nextTick(() => { 
            this.userPassword = {};
            this.$refs.change_password_observer.reset();
            setTimeout(() => {
              this.loading = false;
              this.dialog = false;
            }, 500);
          });
        })
        .catch((err) => {
          console.log(err.response.data);
          this.loading = false;
          this.sbOptions = {
            status: true,
            type: "error",
            text: "Error saving data",
          };
        });
    },
  },
};
</script>
  