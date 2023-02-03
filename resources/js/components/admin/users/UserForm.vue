<template>
  <div>
    <v-app-bar color="white" dense class="elevation-0">
      <v-toolbar-title class="overline">{{ pagetitle }} User</v-toolbar-title>
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
                  
                  <ValidationProvider
                    v-slot="{ errors }"
                    rules="required"
                    name="Full Name"
                  >
                    <v-text-field
                      dense
                      outlined
                      v-model="usersObj.name"
                      label="Full Name*"
                      :error-messages="errors"
                      required
                    ></v-text-field>
                  </ValidationProvider>                   
                   
                  <ValidationProvider
                    v-slot="{ errors }"
                    rules="email|required"
                    name="Email"
                  >
                    <div class="d-flex">
                      <v-text-field
                        autocomplete="false"
                        dense
                        outlined
                        v-model="usersObj.email"
                        label="Email*"
                        :error-messages="errors"
                        required
                      ></v-text-field> 
                    </div>
                  </ValidationProvider>
                  <ValidationProvider
                    v-slot="{ errors }"
                    rules="required"
                    name="Company"
                  >
                    <v-autocomplete
                      dense
                      v-model="usersObj.company_id"
                      :items="companies"
                      label="Company*"
                      outlined
                      item-value="id"
                      item-text="title"
                      required
                      :error-messages="errors"
                    >
                    </v-autocomplete>
                  </ValidationProvider>
                  <ValidationProvider
                    v-slot="{ errors }"
                    rules="required"
                    name="Department"
                  >
                    <v-autocomplete
                      dense
                      v-model="usersObj.department_id"
                      :items="departments"
                      label="Department*"
                      item-value="id"
                      item-text="title"
                      outlined
                      required
                      :error-messages="errors"
                    >
                    </v-autocomplete>
                  </ValidationProvider>
                  <v-text-field
                    dense
                    outlined
                    v-model="usersObj.designation"
                    label="Designation*"
                  ></v-text-field> 

                  <ValidationProvider
                    v-slot="{ errors }"
                    rules="required"
                    name="role"
                  >
                  <v-text-field
                    dense
                    outlined
                    v-model="usersObj.contact_no"
                    label="Contact No*"
                  ></v-text-field> 
                  </ValidationProvider>
                 
                </v-card-text>
              </v-card>
            </div>
            <div class="col-12 col-md-3">
              <v-card :loading="loading">
                <v-card-text class="d-flex">
                  <v-switch
                    style="max-width: 120px"
                    v-model="statusSwitch"
                    :color="`${statusSwitch == true ? 'success' : 'grey'}`"
                    :label="`${statusSwitch == true ? 'Active' : 'Disabled'}`"
                  ></v-switch>
                    <v-btn
                      class="primary ma-auto"
                      :disabled="!valid"
                      small
                      @click="submit"
                      >Save</v-btn
                    >                  
                </v-card-text>
              </v-card> 
              <div class="mt-2" v-if="pagetitle === 'edit'">
                <v-btn @click="resetPass" color="secondary" class="col-12" dense>RESET PASSWORD</v-btn>
              </div>
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
 
 
export default {
  components: {
    ValidationProvider,
    ValidationObserver,
     
     
  },
  props: {
    userdata: {
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
      auth: this.$store.state.authUser.userObject, 
      statusSwitch: true, 
      companies: [],
      departments: [],
      actionSave: this.pagetitle,
      cardTitle: "New user",
       
      usersObj: { role: "normal" },
      origEmail: this.userdata ? this.userdata.email : "", 
      // ui 
      sbOptions: {},
      confOptions: {},
      loading: this.userdata ? true : false,
       
    };
  },
  watch: {
    userdata: {
      handler(val, oldVal) {
        if (val != oldVal) {
          this.usersObj = Object.assign({}, val);
          this.origEmail = val.email;
          this.cardTitle = val.full_name;
 

          this.statusSwitch = val.status == "active" ? true : false;
          
          if (this.usersObj.profile) { 
            this.usersObj.name = this.usersObj.profile.name;  
            this.usersObj.designation = this.usersObj.profile.designation;
            this.usersObj.company_id = this.usersObj.profile.company_id;
            this.usersObj.department_id = this.usersObj.profile.department_id; 
            this.usersObj.contact_no = this.usersObj.profile.contact_no; 
          }
        
        }
        this.loading = false;
      },
      deep: true,
    },
  },
  methods: {
    resetPass: function(){
      let data = {id : this.usersObj.id};
      this.sbOptions = {
        status: true,
        type: "info",
        text: "Please wait...",
      };
      this.loading = true;
      axios.post('/d/admin/user/reset-password', data).then((response) => { 

        setTimeout(() => {
          
          this.sbOptions = {
            status: true,
            type: "success",
            text: response.data.msg,
          };
          
          this.loading = false;
        }, 1000);
      })
    },
    submit() {
      this.sbOptions = {
        status: true,
        type: "info",
        text: "Please wait...",
      };
      this.loading = true;
   
      // Set status value
      this.usersObj.status = this.statusSwitch == true ? "active" : "disabled";
      
      // Check if the email is changed
      let uObject = {
        status: this.usersObj.status,
        email: this.usersObj.email, 
      };
      if (this.usersObj.email == this.origEmail) {
        delete this.usersObj["email"];
        uObject = { status: this.usersObj.status};
      } 
    
      let dData = {
        nUser: uObject,
        nProfile: {
          company_id: this.usersObj.company_id,
          department_id: this.usersObj.department_id, 
          name: this.usersObj.name,
          designation: this.usersObj.designation,
          contact_no: this.usersObj.contact_no, 
        },
        id: this.usersObj ? this.usersObj.id : null, 
      };  

        // Send data to save
        axios
          .post("/d/admin/user/save", dData)
          .then((response) => {
            this.sbOptions = {
              status: true,
              type: "success",
              text: "User has been saved",
            };
            setTimeout(() => {
              if (this.pagetitle == "edit") {
                this.$emit("saved", true);
              } else {
                this.$nextTick(() => {
                  this.loading = false;
                  this.usersObj = {};
                  this.$refs.user_form_observer.reset();
                  this.$router.push({ name: "Users" });
                });
              }
            }, 800);
          })
          .catch((err) => {
            console.log(err.response);
            this.loading = false;
            this.sbOptions = {
              status: true,
              type: "error",
              text: "Email already Exist!",
            };
          });      
    }, 
    
    fetchCompany: async function () {
      await axios
        .get("/d/admin/fetch/non-paginate/companies")
        .then((response) => {
          console.log(response.data);
          this.companies = Object.assign([], response.data);
        });
    },
    fetchDepartment: async function () {
      await axios
        .get("/d/admin/fetch/non-paginate/departments")
        .then((response) => {
          this.departments = Object.assign([], response.data);
        });
    },
  },
  mounted() {
    this.fetchCompany().then(() => {
      this.fetchDepartment();
    });
  },
};
</script>
