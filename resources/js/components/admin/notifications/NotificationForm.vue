<template>
  <div>
    <v-app-bar color="white" dense class="elevation-0">
      <v-toolbar-title class="overline">{{ pagetitle }} Receiver</v-toolbar-title>
    </v-app-bar>
    <v-container class="py-8">
      <v-row>
        <div class="col-12 col-md-8">
          <ValidationObserver ref="user_form_observer" v-slot="{ valid }">
            <v-form ref="form">
              <v-card :loading="loading">
                <v-card-title>
                  <h4>{{ cardTitle }}</h4>
                </v-card-title>
                <v-card-text>
                  <v-switch
                    style="max-width: 120px"
                    v-model="statusSwitch"
                    :color="`${statusSwitch == true ? 'success' : 'grey'}`"
                    :label="`${statusSwitch == true ? 'Active' : 'Disabled'}`"
                  ></v-switch>
                   
                  <ValidationProvider
                    v-slot="{ errors }"
                    rules="required"
                    name="Full Name"
                  >
                    <v-text-field
                      dense
                      outlined
                      v-model="usersObj.fullname"
                      label="Full Name *"
                      :error-messages="errors"
                      required
                    ></v-text-field>
                  </ValidationProvider>
                   
                  <ValidationProvider v-slot="{ errors }" rules="" name="Email">
                    <v-text-field
                      dense
                      outlined
                      v-model="usersObj.email"
                      label="Email"
                      :error-messages="errors"
                    ></v-text-field>
                  </ValidationProvider>
                 
                  <v-card-actions>
                    <v-btn
                      v-if="pagetitle == 'edit'"
                      text
                      color="error"
                      @click="deleteData()"
                      >delete</v-btn
                    >
                  
                    <v-btn class="primary" :disabled="!valid" @click="submit"
                      >Save</v-btn
                    >
                  </v-card-actions>
                </v-card-text>
              </v-card>
            </v-form>
          </ValidationObserver>
        </div>
        
      </v-row>
    </v-container>
    <!-- actions and dialogs -->
    <snack-bar :snackbar-options="sbOptions"></snack-bar>
    <confirmation-dialog
      :conf-options="confOptions"
      @response="confResponse"
    ></confirmation-dialog>
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
    objectdata: {
      type: Object,
      default: null,
    },
    pagetitle: {
      type: String,
      default: "new",
    },
  },
  data() {
    return {
      statusSwitch: true, 
      actionSave: this.pagetitle,
      cardTitle: "New Receiver",
      emailExisted: "",
      usersObj: {}, 
      newStatus: "", 
      sbOptions: {},
      confOptions: {},
      loading: this.objectdata ? true : false,
       
    };
  },
  watch: {
    objectdata: {
      handler(val, oldVal) {
        if (val != oldVal) {
          this.usersObj = Object.assign({}, val); 
          this.cardTitle = "Update Receiver";
          this.statusSwitch = val.status == "active" ? true : false;
        }
        this.loading = false;
      },
      deep: true,
    },
  },
  methods: {
  
    submit() {
      this.loading = true;

      // Set status value
      this.usersObj.status = this.statusSwitch == true ? "active" : "disabled";

      let dataForm = { data: this.usersObj };
        // Send data to save
        axios
          .post("/d/admin/notification/save", dataForm)
          .then((response) => {
            this.sbOptions = {
              status: true,
              type: "success",
              text: "Data has been saved",
            };
            if (this.pagetitle == "edit") {
              this.$emit("saved", true);
            } else {
              this.$nextTick(() => {
                this.loading = false;
                this.usersObj = {};
                this.$refs.user_form_observer.reset();
                this.$router.push({ name: "Notifications" });
              });
            }
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
    deleteData() {
      this.confOptions = {
        status: true,
        title: "Confirm",
        msg: "Please confirm that you want to delete this account.",
        btnTitle: "delete",
        action: "delete",
      };
    },
    confResponse(value) {
      if (value == true) {
        axios
          .post("/d/admin/notification/delete/" + this.usersObj.id)
          .then((response) => {
            this.$emit("saved", true);
            this.sbOptions = {
              status: true,
              type: "success",
              text: "Data has been deleted",
            };
          })
          .catch((err) => {
            console.log(err.response.data);
            this.loading = false;
            this.sbOptions = {
              status: true,
              type: "error",
              text: err.response.data.message,
            };
          });
      }
    },
 
  },
};
</script>
