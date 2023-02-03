<template>
  <div>
    <v-app-bar color="white" dense class="elevation-1" height="75">
      <v-toolbar-title class="overline mt-12">GENERAL SETTINGS</v-toolbar-title>
    </v-app-bar>
    <v-container class="my-2 mx-auto" style="max-width: 1300px">
      <v-form ref="form" v-if="import_cashless_access">
        <v-row>
          <div class="col-12 col-md-9">
            <v-card :loading="loading">
              <v-card-text>
               <v-row>
                  <div class="col-2">Wallet Guidelines</div>
                  <div class="col-10">
                    <ckeditor
                      :editor="editor"
                      v-model="walletGuideline"
                      :config="editorConfig"
                    ></ckeditor>
                  </div>
               </v-row>
              </v-card-text>
            </v-card>
          </div>

          <div class="col-3">
            <v-card>
              <v-card-text>
                <v-card-actions>
                  <v-btn class="ml-2 primary" :loading="loading" @click="submit"
                    >Save</v-btn
                  >
                </v-card-actions>
              </v-card-text>
            </v-card>
          </div>
        </v-row>
      </v-form>
    </v-container>
    <!-- actions and dialogs -->
    <snack-bar :snackbar-options="sbOptions"></snack-bar>
    <dialog-loader :loader-options="loaderOptions"></dialog-loader>
  </div>
</template>
<script>
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
 
export default {
  data() {
    return {
      auth: this.$store.state.authUser.userObject,
      loaderOptions: {},
      dataObj: {},
      // ui
      sbOptions: {},
      import_cashless_access: false,
      loading: false,
      editor: ClassicEditor,
      walletGuideline: "",
      editorConfig: {
        
        placeholder: "Guidelines for Cashless in Canteen",
         
        alignment: {
            options: [ 'left','center', 'right' ]
        },
      },
    };
  },

  methods: {
    submit() {
      this.loading = true;

      let validateContent = this.walletGuideline;
        validateContent = validateContent.replace(
          "<p>[source]",
          '<video width="100%" controlsList="nodownload" controls>'+
          '<source type="video/mp4" src="'
        ); 
    
        validateContent = validateContent.replace(
          "[/source]</p>",
          '">There is a video here</source></video>'
        );
        this.dataObj = {
          wallet_guideline: validateContent
        };

        let dataForm = { data: this.dataObj };
        
        axios
        .post('/d/admin/post/general/setting', dataForm)
        .then((response) => {
          this.sbOptions = {
            status: true,
            type: "success",
            text: "Data has been saved",
          }; 
          
          setTimeout(() => {
            this.loading = false; 
          }, 800);
            
        
        })
        .catch((err) => {
          this.loading = false;
          this.sbOptions = {
            status: true,
            type: "error",
            text: "Error saving data. kindly refresh the page.",
          };
        });
    },

    validateAccess: function (slug) {
      let hasAccess = false;
      if (this.auth.status == "active" && this.auth.role == "superadmin") {
        hasAccess = true;
      }
      return hasAccess;
    },

    fetchSettings: async function(){
      await axios.get('/d/admin/fetch/general/settings').then((response) =>{
       if(response.data && response.data.length > 0){
          this.dataObj = response.data;
          this.dataObj.map((o,i) =>{
            this.walletGuideline = o.meta_key == "wallet_guideline" ? o.meta_value : ''
          });
       }
      });
    }
  },
  created() {
    this.import_cashless_access = this.validateAccess("cashless");
    if(this.import_cashless_access){ 
      this.fetchSettings();
    }
  },
};
</script>
