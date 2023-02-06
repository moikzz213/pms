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
          <h4>{{ cardTitle }} <strong :class="formObj.status">: {{ cleanStatus(formObj.status) }}</strong> </h4>
        </v-card-title>
        <v-card-text>
          <v-row>
            <div class="col-12 col-md-12">

              <v-form ref="form">
                <v-row>
                  <v-col md="12" sm="12">
                    <v-card :loading="loading">
                      <v-card-text>
                        <v-row>
                          <v-col class="my-auto col-4 col-md-2 col-sm-3">
                            PRF No.
                          </v-col>
                          <v-col class="my-auto col-8 col-md-4 col-sm-9">
                            {{ formObj.prf_no }}
                          </v-col>

                          <v-col class="my-auto col-4 col-md-2 col-sm-3">
                            Urgency?*
                          </v-col>

                          <v-col
                            :class="`${formObj.prf_no ? 'my-auto col-8 col-md-3 col-sm-3' : 'my-auto col-8 col-md-4 col-sm-9'}`">
                            <div>
                              {{ urgentTitle(formObj.urgency) }}
                            </div>
                          </v-col>

                        </v-row>
                        <v-row class="mt-0">
                          <v-col class="my-auto col-4 col-md-2 col-sm-3">
                            Business Unit*
                          </v-col>
                          <v-col class="my-auto col-8 col-md-4 col-sm-9">
                            <div>
                              {{ formObj.company ? formObj.company.title : '' }}
                            </div>

                          </v-col>

                          <v-col class="my-auto col-4 col-md-2 col-sm-3">
                            Date (DD/MM/YY)
                          </v-col>
                          <v-col class="my-auto col-8 col-md-3 col-sm-3">{{
                            formObj.created_at ?
                              formatDateHelper(formObj.created_at) : formatDateHelper()
                          }}</v-col>
                        </v-row>

                        <v-row class="mt-0">
                          <v-col class="my-auto col-4 col-md-2 col-sm-3">
                            Requestor Name
                          </v-col>
                          <v-col class="my-auto col-8 col-md-4 col-sm-9">{{
                            formObj.profile ? formObj.profile.name :
                              auth.profile.name
                          }}</v-col>

                          <v-col class="my-auto col-4 col-md-2 col-sm-3">
                            Time
                          </v-col>
                          <v-col class="my-auto col-8 col-md-3 col-sm-3">{{
                            formObj.created_at ?
                              timeOnlyFormat(formObj.created_at) : timeOnlyFormat()
                          }}</v-col>
                        </v-row>

                        <v-row class="mt-0">
                          <v-col class="my-auto col-4 col-md-2 col-sm-3">
                            Designation
                          </v-col>
                          <v-col class="my-auto col-8 col-md-4 col-sm-9">{{
                            formObj.profile ?
                              formObj.profile.designation : auth.profile.designation
                          }}</v-col>

                          <v-col class="my-auto col-4 col-md-2 col-sm-3">
                            Branch/Location*
                          </v-col>
                          <v-col class="my-auto col-8 col-md-3 col-sm-9">

                            <div>
                              {{ formObj.location ? formObj.location.title : '' }}
                            </div>

                          </v-col>
                        </v-row>
                        <v-row>

                          <v-col class="col-12">
                            <h3>Attachment(s)</h3>
                            <ul v-if="formObj.images && formObj.images.length > 0">
                              <li v-for="img in formObj.images" :key="img.id"> <a :href="`/d/file/${img.path}`"
                                  target="_blank"> {{ img.title }} </a></li>
                            </ul>
                          </v-col>
                        </v-row>

                        <v-row>
                          <v-col sm="12" xs="12" md="12">

                            <v-text-field dense v-model="formObj.subject" label="Enter Subject*" outlined required
                              clearable hide-details></v-text-field>

                          </v-col>
                          <v-col md="12">
                            <ckeditor :editor="editor" v-model="editorData" :config="editorConfig"></ckeditor>
                          </v-col>
                        </v-row>

                        <v-row class="pb-5">
                          <v-col col="12" md="6">
                            <div v-if="formObj.status == 'pending' || formObj.status == 'onhold'">
                              Only <strong>ON PROCESS</strong> status can create LPO/PAF
                            </div>
                            <div v-else-if="formObj.status == 'onprocess'">
                              <v-btn class="secondary" :loading="loadingSubmit" small @click="routeLocation('NewLpo', formObj.id)">CREATE LPO</v-btn>
                              <v-btn class="primary mx-2" :loading="loadingSubmit" small @click="routeLocation('NewPaf', formObj.id)">CREATE PAF</v-btn>
                            </div>
                            <div v-else-if="formObj.status == 'cancelled' || formObj.status == 'closed'">
                              <div>Once the request has been cancelled/closed it will no longer be updated.</div>
                              <div> ONHOLD/PENDING STATUS enable requestor to edit their request</div>
                            </div>
                          </v-col>
                          <v-col col="12" md="6" v-if="auth.role == 'admin' || formObj.status !== 'cancelled' && formObj.status !== 'closed'">
                            <div>
                                <!-- <v-btn v-if="formObj.status != 'cancelled'" @click="changeStatus('cancelled')" class="error mx-2" :loading="loadingSubmit" small>CANCEL</v-btn> -->
                                <v-btn v-if="formObj.status != 'onhold'" @click="changeStatus('onhold')" class="secondary  mx-2" :loading="loadingSubmit" small>ONHOLD</v-btn>
                                <v-btn v-if="formObj.status != 'onprocess'" @click="changeStatus('onprocess')" class="info  mx-2" :loading="loadingSubmit" small>ON PROCESS</v-btn>
                                <v-btn v-if="formObj.status != 'closed'" @click="changeStatus('closed')" class="success  mx-2" :loading="loadingSubmit" small>CLOSED</v-btn>
                            </div>
                            <div class="mt-3">
                                <div class="red--text">Procurement Team needs to manually closed the request.</div>
                                <div>Once the request has been <strong>cancelled/closed</strong> it will no longer be updated.</div>
                                <div><strong>ONHOLD/PENDING STATUS</strong> enable requestor to edit their request</div>
                            </div>
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
    <snack-bar :snackbar-options="sbOptions"></snack-bar>

  </div>
</template>
<script>

import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
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

      editRedirect: this.redirectedit,

      cardTitle: this.headertitle,
      formObj: {
        urgency: 3
      },
      // ui  
      sbOptions: {},


      loading: this.objectdata ? true : false,
      editor: ClassicEditor,
      editorData: "",
      editorConfig: {},
      editorContent: "",

      loadingSubmit: false,
      preview: true,

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
    routeLocation(page, id) {
    
      this.$router.push({
        name: page,
        params: {request_id: id}
      });
    },

    funcEditForm: function (v) {
      this.isEditEnable = v;
      this.formEditable = v;
    },

    changeStatus: function (v) {
      this.loadingSubmit = true;
      this.btnHidden = true;
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
        .post('/d/admin/request/update-status', dataForm)
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


  },
  created() { 
    this.pageLoading = false;
  },
};
</script>