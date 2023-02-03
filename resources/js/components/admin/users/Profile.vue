<template>
    <div>
      <v-app-bar color="white" dense class="elevation-0">
        <v-toolbar-title class="overline">Profile</v-toolbar-title>
      </v-app-bar>
      <v-container class="py-8">
        <ValidationObserver ref="user_form_observer" v-slot="{ valid }">
          <v-form ref="form">
            <v-row>
              <div class="col-12 col-md-9">
                <v-card :loading="loading">
                  <v-card-title>
                    <h4>{{ cardTitle }}</h4>
                  </v-card-title>
                  <v-card-text> 
                      <v-text-field
                        dense
                        outlined
                        v-model="usersObj.email"
                        label="Email"
                        disabled
                      ></v-text-field>
                    <ValidationProvider
                      v-slot="{ errors }"
                      rules="required"
                      name="Full Name"
                    >
                      <v-text-field
                        dense
                        outlined
                        v-model="usersObj.name"
                        label="Full Name *"
                        :error-messages="errors"
                        required
                      ></v-text-field>
                    </ValidationProvider> 
                  
                    <ValidationProvider
                      v-slot="{ errors }"
                      rules="required"
                      name="Company"
                    >
                      <v-autocomplete
                        dense
                        v-model="usersObj.company"
                        :items="companies"
                        label="Company *"
                        outlined
                        item-value="id"
                        item-text="title"
                        required
                        :error-messages="errors"
                      >
                      </v-autocomplete>
                    </ValidationProvider>
                  
                    <v-text-field
                      dense
                      outlined
                      v-model="usersObj.position"
                      label="Position"
                    ></v-text-field>
    
                    <v-text-field
                        dense
                        outlined
                        v-model="usersObj.contact_no"
                        label="Contact No."  
                      ></v-text-field>
                  </v-card-text>
                </v-card>
              </div>
              <div class="col-12 col-md-3">
                <v-card :loading="loading">
                  <v-card-text>
                    <div class="d-flex">
                      <v-btn
                        class="primary"
                        :disabled="!valid"
                        small
                        @click="submit"
                        >Save</v-btn
                      >
                    </div>
                  </v-card-text>
                </v-card>
                <v-divider></v-divider>
                  <ChangePassword />
              </div>
            </v-row>
          </v-form>
        </ValidationObserver>
      </v-container>
      <!-- actions and dialogs -->
      <snack-bar :snackbar-options="sbOptions"></snack-bar>
 
    </div>
  </template>
  <script>
  import {
    ValidationObserver,
    ValidationProvider,
  } from "vee-validate/dist/vee-validate.full";
  import ChangePassword from "./ChangePassword.vue";
  
  export default {
    components: {
      ValidationProvider,
      ValidationObserver,
      ChangePassword
    },
  
    data() {
      return {
        auth: this.$store.state.authUser.userObject, 
        companies: [], 
        cardTitle: "My Profile",
        emailExisted: "",
        usersObj: {  }, 
        // ui 
        sbOptions: {},
        confOptions: {},
        loading:   false,  
      };
    },
    
    methods: {
    
      submit() {
        this.sbOptions = {
          status: true,
          type: "info",
          text: "Please wait...",
        };
        this.loading = true; 
       
        let dData = { data : {
            company_id: this.usersObj.company,  
            name: this.usersObj.name,
            position: this.usersObj.position,
            contact_no: this.usersObj.contact_no,  
            }
        };  
  
          // Send data to save
          axios
            .post("/d/users/profile-update", dData)
            .then((response) => {
              this.sbOptions = {
                status: true,
                type: "success",
                text: "User has been saved",
              };
              setTimeout(() => {
                
                  this.$nextTick(() => {
                    this.loading = false; 
                  });
                
              }, 800);
            })
            .catch((err) => {
              console.log(err.response);
              this.loading = false;
              this.sbOptions = {
                status: true,
                type: "error",
                text: err.response.msg,
              };
            });
         
      },
   
      fetchCompany: async function () {
        await axios
          .get("/d/admin/fetch/non-paginate/companies")
          .then((response) => { 
            this.companies = Object.assign([], response.data);
            this.usersObj = {
                email : this.auth.email,
                name : this.auth.profile.name,
                company : this.auth.profile.company_id,
                position : this.auth.profile.designation,
                contact_no :  this.auth.profile.contact_no,

            }
          });
      },
    
    },
    mounted() {
      this.fetchCompany();
    },
  };
  </script>
  