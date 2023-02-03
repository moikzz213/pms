<template>
  <div>
    <v-app-bar color="white" dense class="elevation-0">
      <v-toolbar-title class="overline"> </v-toolbar-title>
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
      <v-card flat maxWidth="1200" class="mx-auto">
        <v-card-title>
          <h4 >{{ cardTitle }} <strong v-if="formObj.prf_no" :class="formObj.status">: {{ cleanStatus(formObj.status) }}</strong> 
            <span v-if="!btnHidden && (formObj.status=='pending' || formObj.status=='onhold' ) && !isEditEnable"> <v-btn dense  @click="funcEditForm(true)" small color="secondary"><v-icon dark small>mdi-pencil</v-icon>Edit</v-btn> 
              <v-btn v-if="formObj.status=='pending'" dense small color="red" class="white--text" @click="cancelledRequest">CANCEL REQUEST</v-btn></span> 
            <span v-else-if="!btnHidden && (formObj.status=='pending' || formObj.status=='onhold' ) && isEditEnable"> <v-btn dense  @click="funcEditForm(false)" small color="secondary">Cancel</v-btn> 
              <v-btn dense small color="green" class="white--text" @click="submit(true)">UPDATE</v-btn></span> 
          
          </h4>
          <v-spacer></v-spacer>
          <v-btn v-if="pagetitle == 'edit'" @click="newPost" fab x-small><v-icon>mdi-plus-box</v-icon></v-btn>
        </v-card-title>
        <v-card-text>
          <v-row>
            <div class="col-12 col-md-12">
              <ValidationObserver ref="user_form_observer" v-slot="{ valid }">
                <v-form ref="form">
                  <v-row>
                    <v-col md="12" sm="12">
                      <v-card :loading="loading">
                        <v-card-text>
                          <v-row>
                            <v-col class="my-auto col-4 col-md-2 col-sm-3" v-if="formObj.prf_no"> 
                              PRF No.
                            </v-col>
                            <v-col class="my-auto col-8 col-md-4 col-sm-9" v-if="formObj.prf_no">
                              {{ formObj.prf_no }}
                            </v-col>
                           
                            <v-col class="my-auto col-4 col-md-2 col-sm-3">
                              Urgency?*
                            </v-col>
                          
                            <v-col :class="`${formObj.prf_no ?   'my-auto col-8 col-md-3 col-sm-3': 'my-auto col-8 col-md-4 col-sm-9'}`">
                              <div v-if="formObj.prf_no">
                              {{ urgentTitle(formObj.urgency) }}
                              </div>
                              <v-autocomplete v-else v-model="formObj.urgency" :items="urgencyList" item-value="id"
                                item-text="title" clearable outlined dense hide-details
                                label="Urgency*"></v-autocomplete>
                            </v-col>
                           
                          </v-row>
                          <v-row class="mt-0">
                            <v-col class="my-auto col-4 col-md-2 col-sm-3" >
                              Business Unit*
                            </v-col>
                            <v-col class="my-auto col-8 col-md-4 col-sm-9" >
                              <div v-if="formObj.prf_no && !formEditable">
                                {{ formObj.company ? formObj.company.title : '' }}                             
                            </div>
                              <div v-else-if="formEditable">
                                <ValidationProvider v-slot="{ errors }" rules="required" name="Business Unit" >
                                <v-autocomplete dense v-model="formObj.company_id" label="Business Unit *"
                                  :items="companyList" item-value="id" item-text="title" outlined required clearable
                                  hide-details :error-messages="errors"></v-autocomplete>
                              </ValidationProvider>
                              </div>
                            </v-col>
                            
                            <v-col class="my-auto col-4 col-md-2 col-sm-3">
                              Date (DD/MM/YY)
                            </v-col>
                            <v-col class="my-auto col-8 col-md-3 col-sm-3">{{ formObj.created_at ?  formatDateHelper(formObj.created_at) : formatDateHelper() }}</v-col>
                          </v-row>

                          <v-row class="mt-0">
                            <v-col class="my-auto col-4 col-md-2 col-sm-3">
                              Requestor Name
                            </v-col>
                            <v-col class="my-auto col-8 col-md-4 col-sm-9">{{ formObj.profile ? formObj.profile.name : auth.profile.name }}</v-col>
                           
                            <v-col class="my-auto col-4 col-md-2 col-sm-3">
                              Time
                            </v-col>
                            <v-col class="my-auto col-8 col-md-3 col-sm-3">{{ formObj.created_at ?  timeOnlyFormat(formObj.created_at) :timeOnlyFormat() }}</v-col>
                          </v-row>

                          <v-row class="mt-0">
                            <v-col class="my-auto col-4 col-md-2 col-sm-3">
                              Designation
                            </v-col>
                            <v-col class="my-auto col-8 col-md-4 col-sm-9">{{ formObj.profile ? formObj.profile.designation : auth.profile.designation }}</v-col>
                          
                            <v-col class="my-auto col-4 col-md-2 col-sm-3">
                              Branch/Location*
                            </v-col>
                            <v-col class="my-auto col-8 col-md-3 col-sm-9">
                              
                              <div v-if="formObj.prf_no && !formEditable">
                                  {{ formObj.location ? formObj.location.title : '' }}
                              </div>
                              <ValidationProvider v-else v-slot="{ errors }" rules="required" name="Branch / Location">
                                <v-autocomplete dense v-model="formObj.location_id" label="Location *" outlined required
                                  :items="locationList" item-value="id" item-text="title" clearable hide-details
                                  :error-messages="errors"></v-autocomplete>
                              </ValidationProvider>
                            </v-col>
                          </v-row>
                          <v-row>
                            <v-col col="12" v-if="!formObj.prf_no">
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
                            </v-col>
                            <v-col class="col-12" v-else>
                              <h3>Attachment(s)</h3>
                                <ul v-if="formObj.images && formObj.images.length > 0">
                                    <li v-for="img in formObj.images" :key="img.id"> <a :href="`/d/file/${img.path}`" target="_blank"> {{ img.title }} </a></li>
                                </ul>
                            </v-col>
                          </v-row>

                          <v-row>
                            <v-col sm="12" xs="12" md="12">
                              <ValidationProvider v-slot="{ errors }" rules="required" name="Subject">
                                <v-text-field dense v-model="formObj.subject" label="Enter Subject*" outlined required
                                  clearable hide-details :error-messages="errors"></v-text-field>
                              </ValidationProvider>
                            </v-col>
                            <v-col md="12">

                              <ckeditor :editor="editor" v-model="editorData" :config="editorConfig"></ckeditor>
                            </v-col>
                          </v-row>
                          <v-row>
                            <v-col col="12">
                              <v-text-field v-if="!formObj.prf_no" dense v-model="formObj.recipients"
                                label="(Optional) Email recipient notification - add comma if multiple email." outlined
                                clearable hide-details></v-text-field>
                                <div v-else>Normal Requests will take atleast 14 working days.</div>
                                <div v-if="formObj.status && formObj.status == 'onprocess'">
                                  Note: Contact the Procurement Team who is processing this request to change the status to ON HOLD for you to edit the description.
                                </div>
                            </v-col>
                          </v-row>
                          <v-row class="pb-5">
                            <v-col v-if="!formObj.prf_no" col="12" md="12" class="pb-0"> 
                              <v-checkbox dense hide-details v-model="acceptance"
                                label="I accept that the request will take atleast 14 working days."></v-checkbox> 
                            </v-col>
                            
                            <v-col  col="12" md="12">
                              <v-btn v-if="!formObj.prf_no" class="primary" :loading="loadingSubmit"
                                :disabled="!valid || !acceptance || !editorData" small
                                @click="processingFunction">Submit</v-btn>
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
    <snack-bar :snackbar-options="sbOptions"></snack-bar>

  </div>
</template>
<script>

import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
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
      btnHidden: false,
      isEditEnable: false,
      formEditable: true,
      auth: this.$store.state.authUser.userObject,
      acceptance: false,
      urgencyList: [
        { id: 3, title: '3. Normal' },
        { id: 2, title: '2. Medium' },
        { id: 1, title: '1. High' },
      ],
      actionSave: this.pagetitle,
      URLadd: this.newurl,
      URLdelete: this.deleteurl,
      deleteRedirect: this.redirectname,
      editRedirect: this.redirectedit,
      newRedirect: this.redirectnew,
      cardTitle: this.headertitle,
      companyList: [],
      locationList: [],
      formObj: {
        urgency: 3
      },
      // ui  
      sbOptions: {},
      filterObj: {},
      confOptions: {},
      loading: this.objectdata ? true : false,
      editor: ClassicEditor,
      editorData: "",
      editorConfig: {},
      editorContent: "",

      loadingSubmit: false,
      preview: true,
      dropzoneOptions: {
        url: this.newurl,
        thumbnailWidth: 200,
        thumbnailHeight: 180,
        uploadMultiple: true,
        autoProcessQueue: false,
        addRemoveLinks: true,
        maxFiles: 3,
        parallelUploads: 3,
        maxFilesize: 5,
        timeout: 180000,
        acceptedFiles: ".jpeg,.jpg,.png,.jfif",
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
          this.formObj = Object.assign({}, val.item);
          this.editorData = this.formObj.details ? this.formObj.details : "";
        }

        this.loading = false;
      },
      deep: true,
    },
  },
  methods: {
    funcEditForm: function(v){
      this.isEditEnable = v;
      this.formEditable = v;
    },  
    /**
     * Dropzone methods
     */
    processingFunction(e) {
      e.preventDefault();
      this.loadingSubmit = true;

      this.sbOptions = {
        status: true,
        type: "info",
        text: "Submitting...",
      };
      this.loading = true;
      

      if (this.$refs.myVueDropzone.getQueuedFiles().length == 0) {
        this.submit(false);
      } else {
        this.$refs.myVueDropzone.processQueue();
      }
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
      this.formObj.details = this.editorData;
      let data = this.formObj;
      
      formData.append("requestObj", JSON.stringify(data));
    },
    uploadSuccessFuntion(files, response) {
      
      this.loadingSubmit = false;
      this.sbOptions = {
            status: true,
            type: "success",
            text: response.msg,
          };

      if (this.pagetitle == "edit") {

      }else{
          this.$refs.user_form_observer.reset();
          this.removeAllFilesFunction();  

          this.$nextTick(() => {
              setTimeout(() => {
                this.loading = false;
                this.$refs.user_form_observer.reset();
                this.$router.push({
                  name: this.editRedirect,
                  params: { id: response.id },
                });
              }, 1000);
          });
        }
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

    newPost: function () {
      this.$router.push({ name: this.newRedirect });
    },
    cancelledRequest: function(){ 
        this.loadingSubmit = true;
        this.btnHidden = true;
        this.sbOptions = {
          status: true,
          type: "info",
          text: "Submitting...",
        };  
 
        let postID = this.formObj.id; 
        let dataForm = {
          type: 'cancelled',
          id: postID,
        }; 

      // Send data to save
      axios
        .post('/d/admin/request/update-status', dataForm)
        .then((response) => {
          this.sbOptions = {
            status: true,
            type: "success",
            text: response.data.message,
          }; 
           
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

    submit: function (v) {   
      if(v){
        this.loadingSubmit = true;

        this.sbOptions = {
          status: true,
          type: "info",
          text: "Submitting...",
        };
      }  
      this.formObj.details = this.editorData;
      let dataForm = {
        data: this.formObj
      };

      if (this.formObj.id) {
        let postID = this.formObj.id;
        let bdata = this.formObj;
        delete bdata["created_at"];
        delete bdata["updated_at"];
        delete bdata["images"];
        delete bdata["user_id"];
        dataForm = {
          data: bdata,
          id: postID,
        };
      }

      // Send data to save
      axios
        .post(this.URLadd, dataForm)
        .then((response) => {
          this.sbOptions = {
            status: true,
            type: "success",
            text: response.data.msg,
          };
          if (this.pagetitle == "edit") {
            this.funcEditForm(false);
            this.$emit("saved", true);
          } else { 
            this.$nextTick(() => {
              setTimeout(() => {
                this.loading = false;
                this.$refs.user_form_observer.reset();
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

    fetchCompanies: async function () {
      await axios.get('/d/admin/fetch/non-paginate/companies').then((response) => {
        this.companyList = response.data;
      })
    },
    fetchBranch: async function () {
      await axios.get('/d/admin/fetch/non-paginate/locations').then((response) => {
        this.locationList = response.data;
      })
    }
  },
  created() { 
    if(this.pagetitle == 'edit'){
      this.formEditable = false;
    }
    this.fetchCompanies().then(() => {
      this.fetchBranch().then(() => {
        this.pageLoading = false;
      })
    });
  },
};
</script>
<style lang="scss">
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
  top: 30%;
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