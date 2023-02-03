<template>
  <div>
    <v-app-bar color="white" dense class="elevation-1" height="75">
      <v-toolbar-title class="overline mt-12">GENERAL SETTINGS</v-toolbar-title>
    </v-app-bar>
    <v-container class="my-2 mx-auto" style="max-width: 1300px">
      <ValidationObserver ref="user_form_observer">
        <v-form ref="form">
          <v-row>
            <div class="col-12 col-md-5" v-if="import_user_access">
              <v-row>
                <v-col md="12">
                  <v-card :loading="loading">
                    <v-card-text>
                      <v-row>
                        <v-col md="12">
                          <h3 class="text-center">EMPLOYEE IMPORT SECTION</h3>
                          <h4 class="text-center">UPLOAD .csv FILE ONLY!</h4>
                        </v-col>
                        <v-col md="12">
                          <v-file-input
                            id="inputFile"
                            accept="text/csv"
                            label="Import .csv file"
                            outlined
                            dense
                            :success="hasImported"
                            hide-details
                            :disabled="loading"
                          ></v-file-input>
                          <small class="float-right">
                            <a href="/others/format-import-employee.csv"
                              >Download CSV Format</a
                            ></small
                          >
                        </v-col>
                      </v-row>
                      <v-card-actions class="pb-0">
                        <v-btn
                          color="primary"
                          x-small
                          @click="importData"
                          :loading="loading"
                          :disabled="hasImported"
                          class="mx-auto"
                        >
                          {{ "Import Now" }}
                        </v-btn>
                      </v-card-actions>
                    </v-card-text>
                  </v-card>
                </v-col>
                <v-col md="12">
                  <v-card v-if="duplicateData.length > 0">
                    <v-card-text>
                      <h5>
                        Duplicate Employee Code! <br />kindly remove the record
                        from CSV then Import again.
                      </h5>
                      {{ duplicateData }}
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
            </div>
            
          </v-row>
        </v-form>
      </ValidationObserver>
    </v-container>
    <!-- actions and dialogs -->
    <snack-bar :snackbar-options="sbOptions"></snack-bar>
    <dialog-loader :loader-options="loaderOptions"></dialog-loader>
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

  data() {
    return {
      auth: this.$store.state.authUser.userObject,
      loaderOptions: {},
      dataObj: {},
      curStatus: "Pending",
      // ui
      sbOptions: {},
      loading: false,
      chunkData: [],
      totalChunk: 1,
      currentUpload: 0,
      redirect: 'Users',
      duplicateData: [],
      controller: '',
      hasImported: false,
      import_user_access: true,
      import_cashless_access: true,
    };
  },

  methods: {
    chunkify(a, n, balanced) {
      if (n < 2) return [a];

      var len = a.length,
        out = [],
        i = 0,
        size;

      if (len % n === 0) {
        size = Math.floor(len / n);
        while (i < len) {
          out.push(a.slice(i, (i += size)));
        }
      } else if (balanced) {
        while (i < len) {
          size = Math.ceil((len - i) / n--);
          out.push(a.slice(i, (i += size)));
        }
      } else {
        n--;
        size = Math.floor(len / n);
        if (len % size === 0) size--;
        while (i < size * n) {
          out.push(a.slice(i, (i += size)));
        }
        out.push(a.slice(size * n));
      }

      return out;
    },
    importData() {
      this.controller = "/d/admin/import/bulk/save";
      this.loading = true;
      let ext = document
        .getElementById("inputFile")
        .value.split(".")
        .pop()
        .toLowerCase();
      if (ext !== "csv") {
        alert("Please upload a csv file");
        this.loading = false;
        return;
      }
      this.$papa.parse(document.getElementById("inputFile").files[0], {
        header: true,
        worker: true,
        complete: this.parseComplete,
      });
    },

    importCashlessData: function(){
      this.redirect = 'Cashless';
      this.loading = true;
      this.controller = "/d/admin/import/bulk/cashless";
      let ext = document
        .getElementById("cashlessFile")
        .value.split(".")
        .pop()
        .toLowerCase();
      if (ext !== "csv") {
        alert("Please upload a csv file");
        this.loading = false;
        return;
      }
      this.$papa.parse(document.getElementById("cashlessFile").files[0], {
        header: true,
        worker: true,
        complete: this.parseComplete,
      });
    },
    parseComplete(results, file) {
      // Remove 1st row header
      //   delete results.data[0];
      this.curStatus = "Processing";
      // Filter Empty Rows
      let resultsArray = results.data.filter(function (el) {
        let firstKey = Object.keys(el)[0].toString(); // get the first property and check
        return el != null && el[firstKey] != "";
      }); 
      
      let totChunk = 10;

      if (resultsArray.length > 5000) {
        this.chunkData = this.chunkify(resultsArray, totChunk, true);
        this.totalChunk = totChunk;
      } else if (resultsArray.length > 2000) {
        totChunk = 5;
        this.chunkData = this.chunkify(resultsArray, totChunk, true);
        this.totalChunk = totChunk;
      } else if (resultsArray.length > 800) {
        totChunk = 3;
        this.chunkData = this.chunkify(resultsArray, totChunk, true);
        this.totalChunk = totChunk;
      } else {
        this.chunkData[0] = resultsArray;
      }

      this.saveSubmittedData(0);
    },

    saveSubmittedData(chunkCount) {
      this.loading = true;
      if (chunkCount < this.chunkData.length) {
        // Set Data
        let data = {
          import_data: JSON.stringify(this.chunkData[chunkCount]),
          type: this.types,
        };

        // Send Data
        axios
          .post(this.controller, data)
          .then((response) => {
            this.currentUpload = chunkCount;
            setTimeout(() => {
              this.saveSubmittedData(chunkCount);
            }, 500);

            if (chunkCount == this.chunkData.length) {
              this.$refs.user_form_observer.reset();
              this.sbOptions = {
                status: true,
                type: "success",
                text: "Data has been successfully imported.",
              };

              this.$nextTick(() => {
                setTimeout(() => {
                  this.loading = false;
                  this.$router.push({
                    name: this.redirect,
                  });
                }, 800);
              });
              this.hasImported = true;
            }
          })
          .catch((error) => {
             console.log(error.response.data);
            this.duplicateData = error.response.data.existed_data;
            this.curStatus = "Error";
            this.loading = false;
            this.sbOptions = {
              status: true,
              type: "error",
              text: error.response.data.message,
            };
          });
      } else {
        this.loading = false;
        this.curStatus = "Pending";
        this.currentUpload = 0;
        this.totalChunk = 1;
      }

      chunkCount++;
    },

    returnAccess: function(slug) {
        let hasAccess = false;
        this.auth.access.map((o, i) => {
            if (slug == o.slug) {
                hasAccess = true;
            }
        });
        return hasAccess;
    },
    validateAccess: function(slug) {
        let hasAccess = false;
        if ( this.auth.status == "active" && this.auth.role == "superadmin") {
            hasAccess = true;
        } else {
            hasAccess = this.returnAccess(slug);
        }
        return hasAccess;
    }
  },
  created(){ 
    this.import_user_access = this.validateAccess("users");
    this.import_cashless_access = this.validateAccess("cashless");
  }
};
</script>
