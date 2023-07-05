<template>
  <div>
    <v-app-bar color="white" dense class="elevation-0">
      <v-toolbar-title class="overline"> </v-toolbar-title>
    </v-app-bar>
    <v-container class="py-8 padding-0" v-if="pageLoading == true">
      <v-row>
        <v-col cols="12">
          <v-skeleton-loader class="mx-auto" max-width="100%"
            type="list-item-avatar-three-line, image, article"></v-skeleton-loader>
        </v-col>
      </v-row>
    </v-container>
    <v-container class="py-2" v-else>
      <v-card flat width="1200" class="mx-auto padding-0">
        <v-card-title class="no-print">
          <h4>{{ cardTitle }} <strong :class="formObj.status">: {{ cleanStatus(formObj.status) }}</strong> </h4>
        </v-card-title>
        <v-card-text class="padding-0">
          <v-row class="padding-0">
            <div class="col-12 col-md-12 padding-0"> 
              <v-form ref="form" class="padding-0">
                <v-row>
                  <v-col md="12" sm="12">
                    <v-card flat elavation="0" :loading="loading" class="padding-0">
                      <v-card-text class="padding-0">
                        <v-row>
                          <v-col class="my-auto col-4 col-md-2 col-sm-3 col-xs-2">
                            PRF No.
                          </v-col>
                          <v-col class="my-auto col-8 col-md-4 col-sm-9 col-xs-4">
                            {{ formObj.prf_no }}
                          </v-col>

                          <v-col class="my-auto col-4 col-md-2 col-sm-3 col-xs-2">
                            Urgency?*
                          </v-col>

                          <v-col
                            :class="`${formObj.prf_no ? 'my-auto col-8 col-md-3 col-sm-3 col-xs-2' : 'my-auto col-8 col-md-4 col-sm-9 col-xs-4'}`">
                            <div>
                              {{ urgentTitle(formObj.urgency) }}
                            </div>
                          </v-col>

                        </v-row>
                        <v-row class="mt-0">
                          <v-col class="my-auto col-4 col-md-2 col-sm-3 col-xs-2">
                            Business Unit*
                          </v-col>
                          <v-col class="my-auto col-8 col-md-4 col-sm-9 col-xs-4">
                            <div>
                              {{ formObj.company ? formObj.company.title : '' }}
                            </div>

                          </v-col>

                          <v-col class="my-auto col-4 col-md-2 col-sm-3 col-xs-2">
                            Date (DD/MM/YY)
                          </v-col>
                          <v-col class="my-auto col-8 col-md-3 col-sm-3 col-xs-2">{{
                            formObj.created_at ?
                              formatDateHelper(formObj.created_at) : formatDateHelper()
                          }}</v-col>
                        </v-row>

                        <v-row class="mt-0">
                          <v-col class="my-auto col-4 col-md-2 col-sm-3 col-xs-2">
                            Requestor Name
                          </v-col>
                          <v-col class="my-auto col-8 col-md-4 col-sm-9 col-xs-4">{{
                            formObj.profile ? formObj.profile.name :
                              auth.profile.name
                          }}</v-col>

                          <v-col class="my-auto col-4 col-md-2 col-sm-3 col-xs-2">
                            Time
                          </v-col>
                          <v-col class="my-auto col-8 col-md-3 col-sm-3 col-xs-2">{{
                            formObj.created_at ?
                              timeOnlyFormat(formObj.created_at) : timeOnlyFormat()
                          }}</v-col>
                        </v-row>

                        <v-row class="mt-0">
                          <v-col class="my-auto col-4 col-md-2 col-sm-3 col-xs-2">
                            Designation
                          </v-col>
                          <v-col class="my-auto col-8 col-md-4 col-sm-9 col-xs-4">{{
                            formObj.profile ?
                              formObj.profile.designation : auth.profile.designation
                          }}</v-col>

                          <v-col class="my-auto col-4 col-md-2 col-sm-3 col-xs-2">
                            Branch/Location*
                          </v-col>
                          <v-col class="my-auto col-8 col-md-3 col-sm-9 col-xs-4">

                            <div>
                              {{ formObj.location ? formObj.location.title : '' }}
                            </div>

                          </v-col>
                        </v-row>
                        <v-row class="no-print">

                          <v-col class="col-12">
                            <h3>Attachment(s)</h3>
                            <ul v-if="formObj.images && formObj.images.length > 0">
                              <li v-for="img in formObj.images" :key="img.id"> <a :href="`/file/${img.path}`"
                                  target="_blank"> {{ img.title }} </a></li>
                            </ul>
                          </v-col>
                        </v-row>

                        <v-row class="padding-0">
                          <v-col sm="12" xs="12" md="12" class="px-0"> 
                              <div class="bordered mx-3 pa-2"  >{{ formObj.subject }}</div>
                          </v-col>
                          </v-row>
                          <v-row class=" mt-0">
                        <v-col class="col-12 ">
                              <table border="1" cellspacing="0" cellpadding="0" class="pb-0"   v-if="tableForm.length > 0"> 
                                  <thead>
                                    <tr> 
                                      <th width="5%">#</th>
                                      <th width="55%" class="text-left ml-2">DESCRIPTION</th>
                                      <th width="20%">QTY</th>
                                      <th width="20%">UOM</th>  
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr v-for="(item, index) in tableForm" :key="item.id" class="mt-2"> 
                                      <td class="text-center">{{ index+1 }}</td>
                                      <td class="px-2"><pre>{{ item.description }}</pre></td>
                                      <td class="text-center"> {{ item.qty }}</td>
                                      <td class="text-center"> {{ item.uom }}</td>   
                                    </tr>
                                  </tbody>                                
                              </table>
                            <div v-else class="bordered pa-2 mx-0 details-table" v-html="editorData" style="min-height:250px;"> 
                            </div>
                          </v-col>
                        </v-row>

                        <v-row class="pb-5 no-print">
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
                                <v-btn v-if="formObj.status != 'cancelled'" @click="changeStatus('cancelled')" class="error mx-2" :loading="loadingSubmit" small>CANCEL</v-btn>
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
      tableForm: [],

      loading: this.objectdata ? true : false, 
      editorData: "", 

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
          this.tableForm = this.formObj.items;
          console.log(this.tableForm);
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
<style scoped> 
  .theme--light.v-card>.v-card__subtitle, .theme--light.v-card>.v-card__text, th,td,div,h2,h3,h4,h5,h6,pre, div { color: #000 !important}
   
</style> 