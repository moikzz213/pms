<template>
  <div>
    <v-app-bar color="white" dense class="justify-center">
      <v-toolbar-title class="overline text-center"> GAG - PROCUREMENT SYSTEM - REQUEST QUOTATION </v-toolbar-title>
    </v-app-bar>
    <v-container class="py-8" v-if="pageLoading == true">
      <v-row>
        <v-col cols="12">
          <v-skeleton-loader class="mx-auto" max-width="100%"
            type="list-item-avatar-three-line, image, article"></v-skeleton-loader>
        </v-col>
      </v-row>
    </v-container>
    <v-container style="width:100%; max-width:1800px;" class="py-2" v-else>

      <!-- Editable Form -->
      <v-card flat class="px-5">
        <v-card-text>
          <v-row>
            <div class="col-12 col-md-12">

              <v-form ref="form">
                <v-row>
                  <v-col md="12" sm="12">
                    <v-card :loading="loading" elevation="0">
                      <v-card-text>

                        <v-row>
                          <v-col class="col-9 pr-10">
                            <v-row>
                              <v-col class="my-auto col-5 col-md-2 col-sm-5 py-0"> TITLE </v-col>
                              <v-col class="my-auto col-7 col-md-10 col-sm-7 py-0">: {{ formObj.title }}</v-col>
                              <v-col class="my-auto col-5 col-md-2 col-sm-5 py-0"> COMPANY </v-col>
                              <v-col class="my-auto col-7 col-md-10 col-sm-7 py-0">: GHASSAN ABOUD GROUP</v-col>
                              <v-col class="my-auto col-5 col-md-2 col-sm-5 py-0"> SUPPLIER </v-col>
                              <v-col class="my-auto col-7 col-md-10 col-sm-7 py-0 font-weight-bold">: {{ formObj.suppliers
                                && formObj.suppliers.length > 0 ? formObj.suppliers[0].title : '' }}</v-col>
                              <v-col class="my-auto col-5 col-md-2 col-sm-5 py-0"> DATE CREATED </v-col>
                              <v-col class="my-auto col-7 col-md-10 col-sm-7 py-0">:
                                {{ formatDateHelper(formObj.created_at) }}</v-col>
                            </v-row>
                          </v-col>
                          <v-col class="col-3">
                            <v-img color="black" contain src="/logo/GAG-EnhancedLogo.svg"></v-img>
                          </v-col>
                          <v-col class="col-8 no-printing" color="info"
                            v-if="formObj.status !== 'closed' && formObj.status !== 'cancelled'">
                            This form/request has been specifically sent to you. <br />
                            You can re-submit this form once submitted.<br />
                            Kindly provide your best offer for below request(s).
                          </v-col>
                          <v-col v-else class="col-8">
                            <h2 class="text-uppercase">This form/request already been {{ formObj.status }}.</h2>
                          </v-col>
                          <v-col class="col-4 no-printing">
                            <h3>Attachment(s)</h3>
                          
                            <ul v-if="formObj.images && formObj.images.length > 0">
                                <li v-for="(img,idx) in formObj.images" :key="img.id"> 
                                  <a :href="`/file/quotations/${img.path}`" target="_blank"> {{ img.title }} </a> 
                                </li>
                            </ul>
                          </v-col>
                        </v-row>

                        <v-row class="mt-0">
                          <v-col class="col-12">
                            <v-simple-table class="bordered">
                              <template v-slot:default>
                                <thead>
                                  <tr>
                                    <th width="5%">S/N</th>
                                    <th width="20%">DESCRIPTION</th>
                                    <th width="10%">QTY</th>
                                    <th width="10%">UOM</th>
                                    <th width="30%">Brand/Packing</th>
                                    <th width="10%" class="text-right">Unit Cost</th>
                                    <th width="10%" class="text-right">Total Cost</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr v-for="(item, index) in tableForm" :key="item.id" class="mt-2">
                                    <td>{{ index + 1 }}</td>
                                    <td> {{ item.description }} </td>
                                    <td> {{ item.qty }} </td>
                                    <td> {{ item.uom }} </td>
                                    <td>
                                      <v-textarea :disabled="formObj.status == 'closed' || formObj.status == 'cancelled'"
                                        class="no-print" v-model="item.brand" outlined dense rows="3" label="Description*"
                                        hide-details></v-textarea>
                                      <div class="for-printing">{{ item.brand }}</div>
                                    </td>
                                    <td>
                                      <v-text-field
                                        :disabled="formObj.status == 'closed' || formObj.status == 'cancelled'"
                                        class="no-print" dense outlined hide-details type="number"
                                        @change="onChangePrice(index)" v-model="item.unit_price"></v-text-field>
                                      <div class="for-printing text-right">{{ item.unit_price }}</div>
                                    </td>
                                    <td class="text-right">{{ item.total_amount }} </td>
                                  </tr>
                                  <tr>
                                    <th colspan="6" class="text-right">DISCOUNT</th>
                                    <th>
                                      <v-text-field
                                        :disabled="formObj.status == 'closed' || formObj.status == 'cancelled'"
                                        class="no-print" dense outlined type="number" hide-details
                                        @change="onChangeDiscount" v-model="formSupplierObj.discount"></v-text-field>
                                      <div class="for-printing text-right">{{ formSupplierObj.discount }}</div>
                                    </th>
                                  </tr>
                                  <tr>
                                    <th colspan="6" class="text-right">NET AMOUNT</th>
                                    <th class="text-right"> {{
                                      Number(formSupplierObj.net_amount).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g,
                                        ",") }}</th>
                                  </tr>
                                </tbody>
                              </template>
                            </v-simple-table>
                          </v-col>
                        </v-row>

                        <v-row v-if="formObj.status !== 'closed' && formObj.status !== 'cancelled'">
                          <v-col col="12" class="col-6 no-print">
                            <vue-dropzone ref="myVueDropzone" class="open-uploader" id="customdropzone" required
                              :options="dropzoneOptions" :useCustomSlot="preview" addRemoveLinks: true
                              v-on:vdropzone-file-added="addedFunction" v-on:vdropzone-files-added="addedFunction"
                              v-on:vdropzone-sending="sendingFunction" v-on:vdropzone-drop="dropFunction"
                              v-on:vdropzone-removed-file="removedFunction"
                              v-on:vdropzone-success-multiple="uploadSuccessFuntion"
                              v-on:vdropzone-processingFunction-multiple="processingFunction"
                              v-on:vdropzone-thumbnail="thumbnail" v-on:vdropzone-error-multiple="uploadErrorFunction">
                              <div class="dropzone-custom-content">
                                <h3 class="dropzone-custom-title">Drag 'n' drop some files here, or click to select
                                  files</h3>
                                <div class="subtitle">max of 3 files only. (.jpg, .jpeg, .png, .jfif & .pdf)</div>

                              </div>
                            </vue-dropzone>
                          </v-col>
                          <v-col col="12" class="col-6 no-print">
                            <h3>ATTACHMENT(s)</h3>
                            <div v-if="formObj.quotation_total_amount && formObj.quotation_total_amount.length > 0">
                              <div v-if="formObj.quotation_total_amount[0].images">
                                <div v-for="(file, index) in formObj.quotation_total_amount[0].images" :key="file.index">
                                  <a :href="`/file/quotations/${file.path}`" target="_blank" rel="noopener noreferrer">{{
                                    file.title }}</a>
                                </div>
                              </div>
                            </div>
                          </v-col>
                        </v-row>

                        <v-row class="pb-5 no-print" v-if="formObj.status !== 'closed' && formObj.status !== 'cancelled'">
                          <v-col col="12" md="12">
                            <v-btn class="primary" :disabled="disabled" :loading="loadingSubmit" small
                              @click="processingFunction">Submit</v-btn>
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
import vueDropzone from "vue2-dropzone";
import "vue2-dropzone/dist/vue2Dropzone.min.css";
export default {
  name: "DataForm",
  components: {
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
      pageLoading: true,
      editRedirect: this.redirectedit,
      cardTitle: this.headertitle,
      supplierObj: [],
      formObj: {},
      formSupplierObj: { net_amount: 0, discount: 0 },
      // ui  
      sbOptions: {},
      disabled: false,

      loading: this.objectdata ? true : false,
      loadingSubmit: false,

      // table form
      tableForm: [{ brand: '', qty: '', uom: '', unit_price: '', total_amount: '' }],
      preview: true,
      dropzoneOptions: {
        url: '/supplier/quotation/save',
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

          this.formObj = Object.assign({}, val.item);
          this.tableForm = this.formObj.items;
          if (this.formObj.quotations && this.formObj.quotations.length > 0) {
            let quotation = this.formObj.quotations;
            this.tableForm.map((o, i) => {
              o.specification = o.description;

              o.brand = quotation[i] ? quotation[i].description : '';
              if (quotation[i] && quotation[i].total_amount) {
                o.unit_price = quotation[i].unit_price;
                o.total_amount = quotation[i].total_amount;
              } else {
                o.total_amount = 0;
              }
            });

            this.formSupplierObj = {
              net_amount: this.formObj.quotation_total_amount && this.formObj.quotation_total_amount.length > 0 ? this.formObj.quotation_total_amount[0].net_amount : 0,
              discount: this.formObj.quotation_total_amount && this.formObj.quotation_total_amount.length > 0 ? this.formObj.quotation_total_amount[0].discount : 0
            }
          }
          console.log(this.tableForm);
        }
        this.loading = false;

      },
      deep: true,
    },
  },
  methods: {
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
      let supplierID = this.formObj.suppliers[0].id;
      let dataForm = {};
      this.formSupplierObj.supplier_id = supplierID;

      let formItems = this.tableForm.map((o, i) => {
        delete o["comparison_id"];
        delete o["description"];
        delete o["created_at"];
        delete o["updated_at"];
        delete o["uom"];
        delete o["title"];
        delete o["qty"];
        delete o["specification"];
        o.comparison_item_id = o.id;
        o.description = o.brand ? o.brand : '';
        o.supplier_id = supplierID
        delete o["brand"];
        delete o["id"];
        return o;
      });

      if (this.formObj.id) {
        let postID = this.formObj.id;
        let bdata = this.formObj;
        delete bdata["created_at"];
        delete bdata["updated_at"];
        delete bdata["user_id"];
        delete bdata["comparison_id"];
        delete bdata["company"];
        delete bdata["department"];
        delete bdata["suppliers"];
        delete bdata["items"];
        delete bdata["id"];
        dataForm = {
          netamount: this.formSupplierObj,
          id: postID,
          items: formItems,
          supplier_id: supplierID
        };
      }

      formData.append("requestObj", JSON.stringify(dataForm));
    },
    uploadSuccessFuntion(files, response) {
      this.disabled = true;
      this.loadingSubmit = false;
      this.sbOptions = {
        status: true,
        type: "success",
        text: response.message,
      };

      if (this.pagetitle == "edit") {

      } else {
        this.$refs.user_form_observer.reset();
        this.removeAllFilesFunction();
      }
    },
    uploadErrorFunction(files, err, xhr) {

      this.$refs.myVueDropzone.removeFile(files[0]);
      //this.$refs.myVueDropzone.dropzone.files.pop();
      this.loadingSubmit = false;
      this.sbOptions = {
        status: true,
        type: "error",
        text: err.message,
      };
      this.disabled = true;
      this.$emit("saved", true);
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
    // End dropzone

    onChangePrice: function (idx, rerun = false) {
      let index = idx;
      let netAmount = 0;
      this.tableForm.map((o, i) => {
        if (rerun) {
          if (o.unit_price) {
            o.total_amount = (Number(o.qty) * parseFloat(o.unit_price)).toFixed(2);
          }
        } else {
          if (i == index) {
            o.total_amount = (Number(o.qty) * parseFloat(o.unit_price)).toFixed(2);
            console.log(o.total_amount);
          }
        }
        if (!isNaN(o.total_amount)) {
          netAmount += parseFloat(o.total_amount);
        } else {
          netAmount += 0;
        }
      });

      if (this.formSupplierObj.discount > 0) {
        this.formSupplierObj.net_amount = (netAmount - parseFloat(this.formSupplierObj.discount)).toFixed(2);
      } else {
        this.formSupplierObj.net_amount = isNaN(netAmount) ? '0.00' : netAmount.toFixed(2);
      }
      this.disabled = false;
    },

    onChangeDiscount: function () {
      if (this.formSupplierObj.discount > 0) {
        this.formSupplierObj.net_amount = this.formSupplierObj.net_amount - this.formSupplierObj.discount;
      } else {
        this.onChangePrice(null, true);
      }
      this.disabled = false;
    },

    submit: function () {

      this.loadingSubmit = true;

      this.sbOptions = {
        status: true,
        type: "info",
        text: "Submitting...",
      };
      let supplierID = this.formObj.suppliers[0].id;
      let dataForm = {};
      this.formSupplierObj.supplier_id = supplierID;

      let formItems = this.tableForm.map((o, i) => {
        delete o["comparison_id"];
        delete o["description"];
        delete o["created_at"];
        delete o["updated_at"];
        delete o["uom"];
        delete o["title"];
        delete o["qty"];
        delete o["specification"];
        o.comparison_item_id = o.id;
        o.description = o.brand ? o.brand : '';
        o.supplier_id = supplierID
        delete o["brand"];
        delete o["id"];
        return o;
      });

      if (this.formObj.id) {
        let postID = this.formObj.id;
        let bdata = this.formObj;
        delete bdata["created_at"];
        delete bdata["updated_at"];
        delete bdata["user_id"];
        delete bdata["comparison_id"];
        delete bdata["company"];
        delete bdata["department"];
        delete bdata["suppliers"];
        delete bdata["items"];
        delete bdata["id"];
        dataForm = {
          netamount: this.formSupplierObj,
          id: postID,
          items: formItems,
          supplier_id: supplierID
        };
      }

      // Send data to save   
      axios
        .post('/supplier/quotation/save', dataForm)
        .then((response) => {

          this.disabled = true;
          this.sbOptions = {
            status: true,
            type: "success",
            text: response.data.message,
          };
          if (this.pagetitle == "edit") {

            this.$emit("saved", true);
            this.loadingSubmit = false;
          }
        })
        .catch((err) => {

          this.loading = false;
          this.loadingSubmit = false;
          this.sbOptions = {
            status: true,
            type: "error",
            text: err.response.data.message,
          };

          this.$emit("saved", true);
        });
    },
  },
  created() {
    this.pageLoading = false;
    this.loading = false;

  },
};
</script> 
<style>
.dropzone-custom-content {
  position: relative !important;
}

.row-delete {
  display: none;
}

table tr:hover .row-delete {
  display: block;
}

.v-data-table>.v-data-table__wrapper>table>tbody>tr>td {
  padding-top: 10px;
  padding-bottom: 10px;
}</style>