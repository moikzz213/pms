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
      <v-card flat maxWidth="1200" class="mx-auto my-3" v-if="formEditable">

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
                                    <v-text-field autofocus :error-messages="errors" v-model="formObj.title" hide-details
                                      dense outlined label="Comparison Title"></v-text-field>
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

                                <v-col class="my-auto col-4 col-md-4 col-sm-4 py-0"> DEPARTMENT </v-col>
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

                                <v-autocomplete chips :items="supplierList" multiple v-model="supplierObj" item-value="id"
                                  item-text="title" outlined dense label="Suppliers" hide-details></v-autocomplete>
                              </div>

                              <v-checkbox v-model="enableNotification" dense hide-details
                                label="Enabled: Suppliers that has been selected above will receive notification once this form is submitted"></v-checkbox>
                            </v-col>
                          </v-row>

                          <v-row class="mt-0">
                            <v-col class="col-12">
                              <v-simple-table class="bordered">
                                <template v-slot:default>
                                  <thead>
                                    <tr>
                                      <th width="5%">S/N</th>
                                      <th width="30%">DESCRIPTION</th>
                                      <th width="15%">CATEGORY</th>
                                      <th width="15%">QTY</th>
                                      <th width="15%">UOM</th>
                                      <th width="15%">PREVIOUS AMOUNT</th>
                                      <th width="5%"></th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr v-for="(item, index) in tableForm" :key="item.id" class="mt-2">
                                      <td>{{ index + 1 }}</td>
                                      <td>
                                        <ValidationProvider v-slot="{ errors }" rules="required" name="Description">
                                          <v-textarea v-model="item.description" outlined dense rows="3"
                                            label="Description*" hide-details :error-messages="errors"></v-textarea>
                                        </ValidationProvider>
                                      </td>
                                      <td>
                                        <v-autocomplete :items="categoryList" v-model="item.category_id" item-value="id"
                                          item-text="title" outlined dense label="Category" hide-details></v-autocomplete>
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
                                        <v-text-field hide-details v-model="item.previous_amount" dense outlined
                                          label="Previous Amount"></v-text-field>
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

                          <v-row>
                            <v-col class="col-12 d-flex">
                              <v-btn small color="secondary" class="mr-4" @click="addItem('approvers')">ADD</v-btn>
                              <h3 class="my-auto"> APPROVAL SETUP</h3>
                            </v-col>
                            <v-col class="col-12 pt-0">
                              <v-simple-table>
                                <template v-slot:default>
                                  <thead>
                                    <tr>
                                      <th width="5%">#</th>
                                      <th width="45%">TITLE</th>
                                      <th width="45%">NAME</th>
                                      <th width="5%"></th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr v-for="(item, index) in approvers" :key="item.id" class="mt-2">
                                      <td>{{ index + 1 }}</td>
                                      <td>
                                        <div v-if="index == 0">
                                          Prepared By
                                        </div>
                                        <ValidationProvider v-else v-slot="{ errors }" rules="required"
                                          name="Approval Type">
                                          <v-autocomplete :error-messages="errors" :items="approvalType" item-value="id"
                                            item-text="text" v-model="item.approval_type" outlined dense
                                            label="Approval Type*" hide-details></v-autocomplete>
                                        </ValidationProvider>
                                      </td>
                                      <td>
                                        <div v-if="index == 0">
                                          {{ auth.profile.name }}
                                        </div>
                                        <ValidationProvider v-else v-slot="{ errors }" rules="required" name="Approver">
                                          <v-autocomplete :error-messages="errors" @click="fetchActiverUsers"
                                            :items="approverList" v-model="item.user_id" item-value="user_id"
                                            item-text="name" outlined dense label="Approval*"
                                            hide-details></v-autocomplete>
                                        </ValidationProvider>
                                      </td>

                                      <td>
                                        <div v-if="index > 0" class="row-delete" @click="removeItem(index, 'approver')">
                                          <v-icon color="red" v-if="approvers.length > 1">mdi-trash-can</v-icon> </div>
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

      <!-- View / Printing -->
      <v-card flat maxWidth="1200" class="mx-auto" v-else>
        <v-card-title class="no-print bordered" style="display:block !important;">
          <div v-if='pagetitle == "edit"' class="d-flex flex-wrap justify-space-between">
            <div>
              <v-btn x-small v-if="formObj.status == 'onprocess'" color="primary" class="mx-2" @click="funcEditForm(true)">EDIT</v-btn>
              <v-btn x-small v-if="formObj.status == 'onprocess'" color="primary" class="mx-2" @click="uploadImage = true">UPLOAD IMAGES</v-btn>
              <v-btn x-small color="secondary" class="mx-2" @click="viewQuotationComparison">VIEW QUOTATION
                COMPARISON</v-btn>
              <v-btn x-small v-if="supplierEmails.length > 0 && formObj.status == 'onprocess'" color="primary" :loading="loadingSubmit" class="mx-2" @click="supplierReminder()">SEND
                REMINDER</v-btn>
            </div>
            <v-spacer></v-spacer>
            <div class="d-flex">
              <h6 class="text-uppercase">STATUS: <span :class="`${formObj.status}`">{{ formObj.status }}</span></h6>
              <v-btn x-small v-if="formObj.status != 'closed' && formObj.status != 'cancelled'" color="success"
                class="mx-2" @click="changeStatus('closed')">Closed</v-btn>
              <v-btn x-small v-if="formObj.status != 'cancelled' && formObj.status != 'closed'" color="error" class="mx-2"
                @click="changeStatus('cancelled')">Cancel Comparison</v-btn>
              <v-btn x-small v-if="formObj.status != 'onprocess'" color="secondary" class="mx-2"
                @click="changeStatus('onprocess')">OnProcess</v-btn>
            </div>
          </div>
        </v-card-title>
        <v-card-text>
          <v-row>
            <div class="col-12 col-md-12">

              <v-form ref="form">
                <v-row>
                  <v-col md="12" sm="12">
                    <v-card :loading="loading" elevation="0">
                      <v-card-text>
                        <v-row>
                          <!-- Left side column -->
                          <v-col class="col-6 pr-10 mt-5">
                            <v-row>
                              <v-col class="my-auto col-4 col-md-4 col-sm-4 py-0 "> TITLE </v-col>
                              <v-col class="my-auto col-8 col-md-8 col-sm-8 py-0 ">
                                {{ formObj.title }}
                              </v-col>
                              <v-col class="my-auto col-4 col-md-4 col-sm-4 py-0"> COMPANY </v-col>
                              <v-col class="my-auto col-8 col-md-8 col-sm-8 py-0">
                                {{ formObj.company ? formObj.company.title : '' }}

                              </v-col>

                              <v-col class="my-auto col-4 col-md-4 col-sm-4 py-0"> CATEGORY </v-col>
                              <v-col class="my-auto col-8 col-md-8 col-sm-8 py-0">
                                {{ formObj.department ? formObj.department.title : '' }}
                              </v-col>
                            </v-row>
                          </v-col>
                          <v-col class="col-6">
                              
                              <h3>Attachment(s)</h3>
                          
                                <ul v-if="formObj.images && formObj.images.length > 0">
                                    <li v-for="(img,idx) in formObj.images" :key="img.id"> 
                                      <a :href="`/file/quotations/${img.path}`" target="_blank"> {{ img.title }} </a> 
                                      <v-btn v-if="!isViewing" text @click="removeImage(img,idx)" class="ml-2"  small><v-icon small  color="error">mdi-close</v-icon></v-btn>
                                    </li>
                                </ul>
                            </v-col>
                        </v-row>
                        <v-row>
                          <v-col class="col-12"> <v-divider></v-divider></v-col>
                          <v-col class="col-12">
                            <div class="d-flex">
                              <h4>SUPPLIERS:</h4>
                              <div class="mx-2 bold" v-for="suppliers in formObj.suppliers" :key="suppliers.id">  
                                <u class="cursor-pointer" @click="addQuotation(suppliers)">{{ suppliers.title }}</u> /
                              </div>
                            </div>
                          </v-col>
                        </v-row>

                        <v-row>
                          <v-col class="col-12">
                            <table border="1" cellspacing="0" cellpadding="0"
                              class="pb-0 td-vertical-top th-vertical-top">
                              <thead>
                                <tr>
                                  <th width="5%">S/N</th>
                                  <th width="30%">DESCRIPTION</th>
                                  <th width="15%">CATEGORY</th>
                                  <th width="15%">QTY</th>
                                  <th width="15%">UOM</th>
                                  <th width="15%">PREVIOUS AMOUNT</th>
                                </tr>

                              </thead>
                              <tbody v-if="tableForm && tableForm.length > 0">
                                <tr v-for="(item, index) in tableForm" :key="item.id">
                                  <td class="text-center">{{ index + 1 }}</td>
                                  <td>{{ item.description }}</td>
                                  <td class="text-center">{{ item.category ? item.category.title : '' }}</td>
                                  <td class="text-center">{{ item.qty }}</td>
                                  <td class="text-center">{{ item.uom }}</td>
                                  <td class="text-center">{{ item.previous_amount }}</td>
                                </tr>
                              </tbody>
                            </table>
                          </v-col>
                        </v-row>

                      </v-card-text>
                    </v-card>
                  </v-col>
                </v-row>
              </v-form>

            </div>
          </v-row>
        </v-card-text>
      </v-card>

    </v-container>
    <!-- actions and dialogs -->
    <v-dialog v-model="uploadImage" width="650">
    <v-card>
      <v-card-title class="text-capitalize">UPLOAD IMAGES</v-card-title>
      <v-card-text class="pt-3">
        <vue-dropzone ref="myVueDropzone" class="open-uploader" id="customdropzone" required
                                :options="dropzoneOptions" :useCustomSlot="preview" addRemoveLinks: true
                                v-on:vdropzone-file-added="addedFunction" v-on:vdropzone-files-added="addedFunction"
                                v-on:vdropzone-sending="sendingFunction" v-on:vdropzone-drop="dropFunction"
                                v-on:vdropzone-removed-file="removedFunction"
                                v-on:vdropzone-success-multiple="uploadSuccessFuntion"
                                v-on:vdropzone-processingFunction-multiple="processingFunction"
                                v-on:vdropzone-thumbnail="thumbnail"
                                v-on:vdropzone-error-multiple="uploadErrorFunction">
                                <div class="dropzone-custom-content">
                                  <h3 class="dropzone-custom-title">Drag 'n' drop some files here, or click to select
                                    files</h3>
                                  <div class="subtitle">max of 3 files only. (.jpg, .jpeg, .png, .jfif & .pdf)</div>

                                </div>
                              </vue-dropzone>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="grey" text @click="uploadImage = false">Cancel</v-btn>
        <v-btn class="success ml-2" @click="processingFunction">UPLOAD IMAGE</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
    <snack-bar :snackbar-options="sbOptions" class="no-print"></snack-bar>

  </div>
</template>
<script>
import {
  ValidationObserver,
  ValidationProvider,
} from "vee-validate/dist/vee-validate.full";
import vueDropzone from "vue2-dropzone";
import "vue2-dropzone/dist/vue2Dropzone.min.css";
export default {
  name: "DataForm",
  components: {
    ValidationProvider,
    ValidationObserver,
    vueDropzone
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
    headertitle: {
      type: String,
      default: "",
    },

  },
  data() {
    return {
      uploadImage: false,
      enableNotification: false,
      pageLoading: true,
      isEditEnable: false,
      formEditable: true,
      auth: this.$store.state.authUser.userObject,
      actionSave: this.pagetitle,
      URLadd: this.newurl,
      editRedirect: this.redirectedit,
      cardTitle: this.headertitle,
      categoryList: [],
      supplierObj: [],
      supplierEmails: [],
      formObj: {},

      // ui  
      sbOptions: {},

      confOptions: {},
      loading: this.objectdata ? true : false,
      loadingSubmit: false,
      origTableForm: [],
      // table form
      tableForm: [{ description: '', qty: '', uom: '' }],
      filterLoaded: { supplier: false, approver: false, dept: false, comp: false },
      approvers: [{ user_id: this.$store.state.authUser.userObject.id, approval_type: 'prepared_by' }],
      approvalType: [{ id: 'requested_by', text: 'Requested By' }, { id: 'reviewed_by', text: 'Reviewed By' }, { id: 'verified_by', text: 'Verified By' }, { id: 'approved_by', text: 'Approved By' }],
      preview: true,
      dropzoneOptions: {
        url: '/d/admin/comparisons/upload-images',
        thumbnailWidth: 200,
        thumbnailHeight: 180,
        uploadMultiple: true,
        autoProcessQueue: false,
        addRemoveLinks: true,
        maxFiles: 3,
        parallelUploads: 3,
        maxFilesize: 5,
        timeout: 180000,
        acceptedFiles: ".jpeg,.jpg,.png,.jfif,.pdf",
        clickable: ".open-uploader",
        headers: {
          "x-csrf-token": document
            .querySelector('meta[name="csrf-token"]')
            .getAttribute("content"),
        },
        previewTemplate: this.dropzoneTemplate(),
      },
    };
  },
  watch: {
    objectdata: {
      handler(val, oldVal) {
        if (val != oldVal) {
          this.formEditable = false;
          this.formObj = Object.assign({}, val.item);
          this.tableForm = this.formObj.items;

          let selectedSuppliers = [];
          this.formObj.suppliers.map((o, i) => {
            selectedSuppliers[i] = o.id;
            if(o.quotations && o.quotations.length > 0){ 
            }else{
              this.supplierEmails[i] = {id: o.id, email:o.email};
            }
          });
         
          let emails = this.supplierEmails.filter(function (el) {
            return el != null;
          });
          
          this.supplierEmails = emails;
          this.supplierObj = selectedSuppliers;
          this.approvers = val.item.comparison_approvals;
        }

        this.loading = false;
      },
      deep: true,
    },
  },
  computed: {
    companyList() {
      return this.$store.state.companies.companyList;
    },

    approverList() {
      return this.$store.state.profiles.profileList;
    },
    supplierList() {
      return this.$store.state.suppliers.supplierList;
    },
    departmentList() {
      return this.$store.state.departments.departmentList;
    },
  },
  methods: {
    addQuotation: function(v){
      let url = btoa(JSON.stringify(this.formObj.id +"&suppid="+v.id+'&key='+v.email));
      window.location.href = '/suppliers/add-quotation?id='+url;
    },
    removeImage: function(v, idx){
      this.loadingSubmit = true;
      let formData = { id: this.formObj.id , image_id: v.id };
       
      axios.post('/d/admin/comparison/detach-image', formData).then((response) =>{ 
        const index = idx;
        if (index > -1) { // only splice array when item is found          
          this.formObj.images.splice(index, 1); // 2nd parameter means remove one item only
        }
        
        this.loadingSubmit = false;
        this.sbOptions = {
              status: true,
              type: "success",
              text: response.data.msg,
          };
      });
    },
     // Start Dropzone
    processingFunction(e) {
      e.preventDefault();
      this.loadingSubmit = true;

      this.sbOptions = {
        status: true,
        type: "info",
        text: "Uploading...",
      };
      this.loading = true; 
      this.$refs.myVueDropzone.processQueue();
     
      return;
    },
    dropFunction(e) {
      e.preventDefault();
      // this.removeAllFilesFunction();

      this.preview = false;
    },
    addedFunction(file) {
      this.preview = false;
    },

    removeAllFilesFunction(file, xhr, formData) {
      this.$refs.myVueDropzone.removeAllFiles();
      this.preview = true;
    },
    removedFunction(file, xhr, formData) {
      if (this.$refs.myVueDropzone.dropzone.files.length <= 0) {
        this.preview = true;
      }
    },
    sendingFunction(file, xhr, formData) {
      let data = this.formObj;
      this.uploadImage = false;
      formData.append("requestObj", JSON.stringify(data));
    },
    uploadSuccessFuntion(files, response) {
      this.removeAllFilesFunction(); 
      this.$emit("saved", true); 
      this.loadingSubmit = false;
      this.loading = false; 
      this.sbOptions = {
            status: true,
            type: "success",
            text: response.message,
          };   
     
    },
    uploadErrorFunction(files, message, xhr) {
      this.$refs.myVueDropzone.removeFile(files[0]);
      //this.$refs.myVueDropzone.dropzone.files.pop();
      this.loadingSubmit = false;
      this.sbOptions = {
        status: true,
        type: "error",
        text: message,
      };
      this.loadingSubmit = false;
    },
    dropzoneTemplate() {
      return `<div class="dz-preview dz-file-preview">
                <div class="dz-image">
                    <div data-dz-thumbnail-bg></div>
                </div>
                <div class="dz-details">
                    <div class="dz-size"><span data-dz-size></span></div>
                    <div class="dz-filename"><span data-dz-name></span></div>
                </div>
                <div class="dz-progress"><span class="dz-upload" data-dz-uploadprogress></span></div>
                <div class="dz-error-message"><span data-dz-errormessage></span></div>
                <div class="dz-success-mark"><i class="fa fa-check"></i></div>
                <div class="dz-error-mark"><i class="fa fa-close"></i></div>
            </div>
        `;
    },
    thumbnail: function (file, dataUrl) {
      var j, len, ref, thumbnailElement;
      if (file.previewElement) {
        file.previewElement.classList.remove("dz-file-preview");
        ref = file.previewElement.querySelectorAll("[data-dz-thumbnail-bg]");
        for (j = 0, len = ref.length; j < len; j++) {
          thumbnailElement = ref[j];
          thumbnailElement.alt = file.name;
          thumbnailElement.style.backgroundImage = 'url("' + dataUrl + '")';
        }
        return setTimeout(((function (_this) {
          return function () {
            return file.previewElement.classList.add("dz-image-preview");
          };
        })(this)), 1);
      }
    },
    // End Dropzone
    supplierReminder: function () {
      this.loadingSubmit = true; 
       
      this.sbOptions = {
        status: true,
        type: "info",
        text: "Sending reminder...",
      };

      let formItems = this.tableForm.map((o, i) => {
        delete o["comparison_id"];
        delete o["created_at"];
        delete o["updated_at"];
        delete o["title"];
        return o;
      }); 

      let postID = this.formObj.id;
        let bdata = this.formObj;
        delete bdata["created_at"];
        delete bdata["updated_at"];
        delete bdata["user_id"];
        delete bdata["comparison_id"];
        delete bdata["comparison_approvals"];
        delete bdata["company"];
        delete bdata["department"];
        delete bdata["suppliers"];
        delete bdata["items"];
        delete bdata["id"];
        let dataForm = {
          data: bdata,
          id: postID,
          items: formItems,
          suppliers: this.supplierEmails
        };

      // Send data to save
      axios
        .post('/d/admin/comparisons/sending-reminder', dataForm)
        .then((response) => {
          this.sbOptions = {
            status: true,
            type: "success",
            text: response.data.message,
          };
           
          this.loadingSubmit = false;
           
        })
        .catch((err) => {
          this.loading = false;
          this.sbOptions = {
            status: true,
            type: "error",
            text: "Error sending data",
          };
        });
    },
    viewQuotationComparison: function () {
      this.$router.push({
        name: 'QuotationComparison',
        params: { id: this.formObj.id },
      });
    },
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

    changeStatus: function (v) {
      this.loadingSubmit = true;

      this.sbOptions = {
        status: true,
        type: "info",
        text: "Submitting...",
      };

      let postID = this.formObj.id;
      let dataForm = {
        type: v,
        id: postID,
      };

      // Send data to save
      axios
        .post('/d/admin/comparison/update-status', dataForm)
        .then((response) => {
          this.sbOptions = {
            status: true,
            type: "success",
            text: response.data.message,
          };
          this.loadingSubmit = false;
          this.$emit("saved", true);

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
    fetchCategories: async function () {
      await axios.get('/d/admin/categories/fetch/non-paginate').then((response) => {
        this.categoryList = response.data;
      });
    },
    submit: function () {

      this.loadingSubmit = true;

      this.sbOptions = {
        status: true,
        type: "info",
        text: "Submitting...",
      };

      let formItems = this.tableForm.map((o, i) => {
        delete o["comparison_id"];
        delete o["created_at"];
        delete o["updated_at"];
        delete o["title"];
        return o;
      });

      let formApprover = this.approvers.map((o, i) => {
        delete o["id"];
        delete o["comparison_id"];
        delete o["created_at"];
        delete o["updated_at"];
        delete o["profile"];
        return o;
      });

      let dataForm = {
        data: this.formObj,
        items: formItems,
        suppliers: this.supplierObj,
        notification: this.enableNotification,
        approvers: formApprover
      };

      if (this.formObj.id) {
        let postID = this.formObj.id;
        let bdata = this.formObj;
        delete bdata["created_at"];
        delete bdata["updated_at"];
        delete bdata["images"];
        delete bdata["evaluation"];
        delete bdata["status"];
        delete bdata["user_id"];
        delete bdata["comparison_id"];
        delete bdata["comparison_approvals"];
        delete bdata["company"];
        delete bdata["department"];
        delete bdata["suppliers"];
        delete bdata["items"];
        delete bdata["id"];
        dataForm = {
          data: bdata,
          id: postID,
          items: formItems,
          suppliers: this.supplierObj,
          notification: this.enableNotification,
          approvers: formApprover
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
      if (this.supplierList.length == 0) {
        this.$store.dispatch("fetchSupplierList");
      }
    },
    fetchCompanies: async function () {
      if (this.companyList.length == 0) {
        this.$store.dispatch("fetchCompanyList");
      }
    },

    fetchDepartment: async function () {
      if (this.departmentList.length == 0) {
        this.$store.dispatch("fetchDepartmentList");
      }
    },

    fetchActiverUsers: async function () {
      if (this.approverList.length == 0) {
        this.$store.dispatch("fetchProfileList");
      }
    },
  },
  created() {

    if (this.pagetitle == 'edit') {
      this.formEditable = false;
    }
    this.fetchSuppliers().then(() => {
      this.fetchCategories().then(() => {

        this.pageLoading = false;
      });
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
<style lang="scss" scoped>
#customdropzone {
  background-color: #f7f7f7;
  font-family: 'Arial', sans-serif;
  letter-spacing: 0.2px;
  color: #777;
  transition: background-color .2s linear;
  height: 200px;
  width: 100%;
  padding: 20px;
  display: flex;
  flex-wrap: nowrap;
  justify-content: flex-start;
}

#customdropzone .dz-preview {
  background-color: #ebebeb;
  width: calc(33% - 10px);
  display: inline-block;
  overflow: hidden;
  margin: 0 10px;
}

#customdropzone .dz-preview .dz-image {
  width: 100%;
  height: 180px;
  margin-left: 0px;
  margin-bottom: 10px;
}

#customdropzone .dz-preview .dz-image>div {
  width: inherit;
  height: inherit;
  border-radius: 0;
  background-size: contain;
}

#customdropzone .dz-preview .dz-image>img {
  width: 100%;
}

#customdropzone .dz-preview .dz-details {
  color: #000;
  transition: opacity .2s linear;
  text-align: center;
}

#customdropzone .dz-success-mark,
.dz-error-mark,
.dz-remove {
  display: none;
}

.dz-message {
  width: 100%;
}

.dropzone-custom-content {
  position: absolute;
  top: 60%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}

.vue-dropzone>.dz-preview .dz-remove {
  width: 98%;
  margin: 0 1%;
  bottom: 2px;
}

.dropzone-custom-title {
  margin-top: 0;
  color: #00b782;
}

.subtitle {
  color: #314b5f;
}

.dz-progress {
  display: none;
}

table td {
  font-size: 11px !important;
}

.dropzone .dz-preview .dz-error-message {
  top: 0 !important;
}
</style>