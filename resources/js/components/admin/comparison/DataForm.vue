<template>
  <div>
    <v-app-bar color="white" dense class="elevation-0 mt-10 no-print">
      <v-toolbar-title class="overline"> {{ cardTitle }}</v-toolbar-title>
    </v-app-bar>
    <v-container class="py-8" v-if="pageLoading == true">
      <v-row>
        <v-col cols="12">
          <v-skeleton-loader class="mx-auto" max-width="100%"
            type="list-item-avatar-three-line, image, article"></v-skeleton-loader>
        </v-col>
      </v-row>
    </v-container>
    <v-container class="py-2 print-container" v-else>

      <!-- Editable Form -->
      <v-card flat maxWidth="1200" class="mx-auto" v-if="formEditable">

        <v-card-title class="no-print bordered">
          <div v-if='pagetitle == "edit"'>
            <v-btn x-small color="primary" class="mx-2" @click="funcEditForm(false)">CANCEL</v-btn>
          </div>
        </v-card-title>
        <v-card-text>
          <v-row>
            <div class="col-12 col-md-12">
              <ValidationObserver ref="user_form_observer" v-slot="{ valid }">
                <v-form ref="form">
                  <v-row>
                    <v-col md="12" sm="12">
                      <v-card :loading="loading" elevation="0">
                        <v-card-text>

                          <v-row>
                            <!-- Left side column -->
                            <v-col class="col-6 pr-10">
                              <v-row>
                                <v-col class="my-auto col-4 col-md-4 col-sm-4  "> TITLE </v-col>
                                <v-col class="my-auto col-8 col-md-8 col-sm-8  ">
                                  <ValidationProvider v-slot="{ errors }" rules="required" name="Company">
                                    <v-text-field autofocus :error-messages="errors" v-model="formObj.title"
                                      hide-details dense outlined label="Comparison Title"></v-text-field>
                                  </ValidationProvider>
                                </v-col>
                                <v-col class="my-auto col-4 col-md-4 col-sm-4 py-0"> COMPANY </v-col>
                                <v-col class="my-auto col-8 col-md-8 col-sm-8 py-0">
                                  <ValidationProvider v-slot="{ errors }" rules="required" name="Company">
                                    <v-autocomplete :items="companyList" @click="fetchCompanies"
                                      v-model="formObj.company_id" item-value="id" item-text="title" outlined dense
                                      hide-details label="Company*" :error-messages="errors">
                                    </v-autocomplete>
                                  </ValidationProvider>
                                </v-col>

                                <v-col class="my-auto col-4 col-md-4 col-sm-4 py-0"> CATEGORY </v-col>
                                <v-col class="my-auto col-8 col-md-8 col-sm-8 py-0">
                                  <ValidationProvider v-slot="{ errors }" rules="required" name="Department"
                                    class="mx-2 col-3 col-md-3 pa-0">
                                    <v-autocomplete :error-messages="errors" :items="departmentList"
                                      @click="fetchDepartment" v-model="formObj.department_id" item-value="id"
                                      item-text="title" outlined dense label="Department" hide-details></v-autocomplete>
                                  </ValidationProvider>
                                </v-col>
                              </v-row>
                            </v-col>

                          </v-row>
                          <v-row>
                            <v-col class="col-12"> <v-divider></v-divider></v-col>
                          </v-row>

                          <v-row>
                            <v-col class="col-12">
                              <div class="d-flex">
                                <v-btn dense color="secondary" class="mx-2 my-auto" small
                                  @click="addItem('item')">ADD</v-btn>

                                <v-autocomplete chips :items="supplierList" multiple v-model="supplierObj"
                                  item-value="id" item-text="title" outlined dense label="Suppliers"
                                  hide-details></v-autocomplete>
                              </div>
                            </v-col>
                          </v-row>

                          <v-row>
                            <v-col class="col-12">
                              <v-simple-table>
                                <template v-slot:default>
                                  <thead>
                                    <tr>
                                      <th width="5%">S/N</th>
                                      <th width="50%">DESCRIPTION</th>
                                      <th width="20%">QTY</th>
                                      <th width="20%">UOM</th>
                                      <th width="5%"></th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr v-for="(item, index) in tableForm" :key="item.id" class="mt-2">
                                      <td>{{ index+ 1 }}</td>
                                      <td>
                                        <ValidationProvider v-slot="{ errors }" rules="required" name="Description">
                                          <v-textarea v-model="item.description" outlined dense rows="3"
                                            label="Description*" hide-details :error-messages="errors"></v-textarea>
                                        </ValidationProvider>
                                      </td>
                                      <td>
                                        <ValidationProvider v-slot="{ errors }" rules="required" name="Qty">
                                          <v-text-field hide-details v-model="item.qty" dense outlined type="number"
                                            label="Qty" :error-messages="errors"></v-text-field>
                                        </ValidationProvider>
                                      </td>
                                      <td>
                                        <ValidationProvider v-slot="{ errors }" rules="required" name="Unit of Measure">
                                          <v-text-field hide-details v-model="item.uom" dense outlined label="Unit"
                                            :error-messages="errors"></v-text-field>
                                        </ValidationProvider>
                                      </td>
                                      <td>
                                        <div class="row-delete" @click="removeItem(index, 'item')"><v-icon color="red"
                                            v-if="tableForm.length > 1">mdi-trash-can</v-icon> </div>
                                      </td>
                                    </tr>
                                  </tbody>
                                </template>
                              </v-simple-table>
                            </v-col>
                          </v-row>

                          <v-row class="pb-5">
                            <v-col col="12" md="12">
                              <v-btn class="primary" :loading="loadingSubmit" :disabled="!valid" small
                                @click="submit">Submit</v-btn>

                            </v-col>
                          </v-row>
                        </v-card-text>
                      </v-card>
                    </v-col>
                  </v-row>
                </v-form>
              </ValidationObserver>
            </div>
          </v-row>
        </v-card-text>
      </v-card>


    </v-container>
    <!-- actions and dialogs -->
    <snack-bar :snackbar-options="sbOptions" class="no-print"></snack-bar>

  </div>
</template>
<script>
import {
  ValidationObserver,
  ValidationProvider,
} from "vee-validate/dist/vee-validate.full";

export default {
  name: "DataForm",
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
    newurl: {
      type: String,
      default: "",
    },
    redirectname: {
      type: String,
      default: "",
    },
    redirectedit: {
      type: String,
      default: "",
    },
    redirectnew: {
      type: String,
      default: "",
    },
    headertitle: {
      type: String,
      default: "",
    },

  },
  data() {
    return {
      pageLoading: true,
      isEditEnable: false,
      formEditable: true,
      auth: this.$store.state.authUser.userObject,
      actionSave: this.pagetitle,
      URLadd: this.newurl,
      editRedirect: this.redirectedit,
      cardTitle: this.headertitle,
      companyList: [],
      supplierList: [],
      departmentList: [],
      supplierObj: [],

      formObj: {},

      // ui  
      sbOptions: {},

      confOptions: {},
      loading: this.objectdata ? true : false,
      loadingSubmit: false,

      // table form
      tableForm: [{ description: '', qty: '', uom: '' }],

      filterLoaded: { supplier: false, approver: false, dept: false, comp: false },
    };
  },
  watch: {
    objectdata: {
      handler(val, oldVal) {
        if (val != oldVal) {
          this.formEditable = false;
          this.formObj = Object.assign({}, val.item);

          this.tableForm = val.item.items;

        }

        this.loading = false;
      },
      deep: true,
    },
  },
  methods: {

    addItem: function (v) {
      if (v == 'item') {
        this.tableForm.push({ description: '', qty: '', uom: '' });
      } else {
        this.approvers.push({ user_id: null, approval_type: '' });
      }
    },

    removeItem: function (index, type) {
      if (type == 'item') {
        let rows = this.tableForm;
        rows.splice(index, 1)
        this.tableForm = [...rows];

        this.onChangeItem(0, true);
      } else {
        let rows = this.approvers;
        rows.splice(index, 1)
        this.approvers = [...rows];
      }

    },

    funcEditForm: function (v) {
      this.formEditable = v;
    },

    submit: function () {

      // this.loadingSubmit = true;

      // this.sbOptions = {
      //   status: true,
      //   type: "info",
      //   text: "Submitting...",
      // };

      let formItems = this.tableForm.map((o, i) => {
        delete o["id"];
        delete o["comparison_id"];
        delete o["created_at"];
        delete o["updated_at"];
        return o;
      });

      let dataForm = {
        data: this.formObj,
        items: formItems,
        suppliers: this.supplierObj
      };

      if (this.formObj.id) {
        let postID = this.formObj.id;
        let bdata = this.formObj;
        delete bdata["created_at"];
        delete bdata["updated_at"];
        delete bdata["user_id"];
        delete bdata["comparison_id"];
        delete bdata["items"];
        delete bdata["id"];
        dataForm = {
          data: bdata,
          id: postID,
          items: formItems,
          suppliers: this.supplierObj
        };
      }

      // Send data to save
      axios
        .post(this.URLadd, dataForm)
        .then((response) => {
          this.sbOptions = {
            status: true,
            type: "success",
            text: response.data.message,
          };
          if (this.pagetitle == "edit") {
            this.funcEditForm(false);
            this.$emit("saved", true);
            this.loadingSubmit = false;
          } else {
            this.$nextTick(() => {
              setTimeout(() => {
                this.loadingSubmit = false;
                this.$router.push({
                  name: this.editRedirect,
                  params: { id: response.data.id },
                });
              }, 1000);
            });
          }
        })
        .catch((err) => {
          this.loading = false;
          this.sbOptions = {
            status: true,
            type: "error",
            text: "Error saving data",
          };
        });
    },

    fetchSuppliers: async function () {

      await axios.get('/d/admin/fetch/non-paginate/suppliers').then((response) => {
        this.supplierList = response.data;
      });

    },
    fetchCompanies: async function () {
      if (!this.filterLoaded.comp) {
        this.filterLoaded.comp = true;
        await axios.get('/d/admin/fetch/non-paginate/companies').then((response) => {
          this.companyList = response.data;
        })
      }
    },

    fetchDepartment: async function () {
      if (!this.filterLoaded.dept) {
        this.filterLoaded.dept = true;

        await axios.get('/d/admin/fetch/non-paginate/departments').then((response) => {
          this.departmentList = response.data;
        });
      }
    },


  },
  created() {

    if (this.pagetitle == 'edit') {
      this.formEditable = false;
    }
    this.fetchSuppliers().then(() => {
      this.pageLoading = false;
    });


  },
};
</script> 
<style>
.row-delete {
  display: none;
}

table tr:hover .row-delete {
  display: block;
}

.v-data-table>.v-data-table__wrapper>table>tbody>tr>td {
  padding-top: 10px;
  padding-bottom: 10px;
}
</style>