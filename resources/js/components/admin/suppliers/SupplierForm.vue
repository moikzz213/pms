<template>
  <div>
    <v-app-bar color="white" dense class="elevation-0">
      <v-toolbar-title class="overline"></v-toolbar-title>
    </v-app-bar>
    <v-container class="py-8" v-if="pageLoading == true">
      <v-row>
        <v-col cols="12">
          <v-skeleton-loader class="mx-auto" max-width="100%"
            type="list-item-avatar-three-line, image, article"></v-skeleton-loader>
        </v-col>
      </v-row>
    </v-container>
    <v-container class="py-2" v-else>
      <v-card flat>
        <v-card-title>
          <h4 class="text-capitalize">{{ pagetitle }} Supplier</h4>
          <v-spacer></v-spacer>
          <v-btn v-if="pagetitle == 'edit'" @click="newPost" fab x-small><v-icon>mdi-plus-box</v-icon></v-btn>
        </v-card-title>
        <v-card-text>
          <v-row>
            <div class="col-12 col-md-12">
              <ValidationObserver ref="user_form_observer" v-slot="{ valid }">
                <v-form ref="form">
                  <v-row>
                    <div class="col-12 col-md-9">
                      <v-card :loading="loading">
                        <v-card-text>
                         <v-row>
                          <v-col class="col-12 col-md-6">
                            <ValidationProvider v-slot="{ errors }" rules="required" name="Supplier Name">
                              <v-text-field dense outlined hide-details v-model="dataObj.title" label="Supplier Name *"
                                :error-messages="errors" clearable required></v-text-field>
                            </ValidationProvider>
                          </v-col>
                          <v-col class="col-12 col-md-6">
                            <ValidationProvider v-slot="{ errors }" rules="required" name="Code">
                              <v-text-field dense outlined hide-details v-model="dataObj.code" label="Code *"
                                :error-messages="errors" clearable required></v-text-field>
                            </ValidationProvider>
                          </v-col>
                          <v-col class="col-12 col-md-6">
                            <ValidationProvider v-slot="{ errors }" rules="required" name="Contact Person">
                              <v-text-field dense outlined hide-details v-model="dataObj.contact_person" label="Contact Person *"
                                :error-messages="errors" clearable required></v-text-field>
                            </ValidationProvider>
                          </v-col>
                          <v-col class="col-12 col-md-6">
                            <ValidationProvider v-slot="{ errors }" rules="required" name="Address">
                              <v-text-field dense outlined hide-details v-model="dataObj.address" label="Supplier Address *"
                                :error-messages="errors" clearable required></v-text-field>
                            </ValidationProvider>
                          </v-col>
                          <v-col class="col-12 col-md-6">
                            <ValidationProvider v-slot="{ errors }" rules="required" name="Contact No">
                              <v-text-field dense outlined hide-details v-model="dataObj.contact_no" label="Contact No.*"
                                :error-messages="errors" clearable required></v-text-field>
                            </ValidationProvider>
                          </v-col>
                          <v-col class="col-12 col-md-6">
                            <ValidationProvider v-slot="{ errors }" rules="required" name="Tax No">
                              <v-text-field dense outlined hide-details v-model="dataObj.tax_no" label="Tax No. *"
                                :error-messages="errors" clearable required></v-text-field>
                            </ValidationProvider>
                          </v-col>
                          <v-col class="col-12 col-md-6">
                            <ValidationProvider v-slot="{ errors }" rules="required" name="Email">
                              <v-text-field dense outlined hide-details v-model="dataObj.email" label="Email *"
                                :error-messages="errors" clearable required></v-text-field>
                            </ValidationProvider>
                          </v-col>
                          <v-col class="col-12 col-md-6">
                             
                              <v-autocomplete dense :items="categories" item-value="id" item-text="title" outlined hide-details v-model="category" label="Category"
                               clearable multiple></v-autocomplete>
                             
                          </v-col>
                          </v-row>
                        </v-card-text>
                      </v-card>
                    </div>

                    <div class="col-12 col-md-3">
                      <v-card :loading="loading">
                        <v-card-text> 
                          <div class="d-flex">
                            <v-btn class="primary" :disabled="!valid" small @click="submit">Save</v-btn>
                            <v-spacer></v-spacer>

                            <v-btn v-if="pagetitle == 'edit'" text color="error" small
                              @click="deleteData()">delete</v-btn>
                          </div>
                        </v-card-text>
                      </v-card>
                      
                    </div>
                  </v-row>
                </v-form>
              </ValidationObserver>
            </div>
          </v-row>
        </v-card-text>
      </v-card>
    </v-container>
    <!-- actions and dialogs -->
    <snack-bar :snackbar-options="sbOptions"></snack-bar>
    <dialog-loader :loader-options="loaderOptions"></dialog-loader>
    <confirmation-dialog :conf-options="confOptions" @response="confResponse"></confirmation-dialog>
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
      pageLoading: true,
       
      auth_user: this.$store.state.authUser.userObject,
      loaderOptions: {},
      actionSave: this.pagetitle,
      cardTitle: "New Supplier",
      dataObj: {},
      // ui
      sbOptions: {},
      confOptions: {},
      loading: false, 
      categories: [],
      category:[]
    };
  },

  watch: {
    objectdata: {
      handler(val, oldVal) {
        if (val != oldVal) {
          this.dataObj = Object.assign({}, val); 
          this.category = this.dataObj.category;
        }
        this.loading = false;
      },
      deep: true,
    },
  },
  methods: {
    newPost: function () {
      this.$router.push({ name: 'NewSupplier' });
    }, 

    submit() {
      this.loading = true;
      this.loaderOptions = {
        status: true,
        text: "Please wait...",
      }; 
 
      let dataForm = { data: this.dataObj, category: this.category  };

      if (this.dataObj.id) {
        let postID = this.dataObj.id;
        let bdata = this.dataObj;
        delete bdata["created_at"];
        delete bdata["updated_at"]; 
        delete bdata["category"]; 
        delete bdata["id"];
        delete bdata["user_id"];
        dataForm = {
          data: bdata, 
          id: postID,
          category: this.category
        };
      }
      axios
        .post("/d/admin/suppliers/save", dataForm)
        .then((response) => {
          this.sbOptions = {
            status: true,
            type: "success",
            text: "Data has been saved",
          };
          if (this.pagetitle == "edit") {
            this.$emit("saved", true);
            this.loaderOptions.status = false;
          } else {
            this.$nextTick(() => {
              setTimeout(() => {
                this.loading = false;
                this.dataObj = {};
                this.$refs.user_form_observer.reset();
                this.$router.push({ name: "Suppliers" });
              }, 800);
            });
          }
        })
        .catch((err) => {
          let errMsg = "Error saving data";

          this.sbOptions = {
            status: true,
            type: "error",
            text: errMsg,
          };
          this.loading = false;
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
          .get("/d/admin/suppliers/delete/" + this.dataObj.id)
          .then((response) => {
            this.$emit("saved", true);
            this.sbOptions = {
              status: true,
              type: "success",
              text: "Data has been deleted",
            };

            setTimeout(() => {
              this.$router.push({ name: "Suppliers" });
            }, 800);
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
    fetchCategories: async function(){
      await axios.get('/d/admin/categories/fetch/non-paginate').then((response)=>{
         this.categories = response.data;
         console.log(this.categories);
      });
    }
  },
  created() { 
    this.fetchCategories().then(()=>{
      this.pageLoading = false;
    });
  },
};
</script>
