<template>
  <div style="width: 100%">
    <div class="col-12" style="min-height: 400px; position: relative">
      <v-sheet
        v-if="loading == true"
        color="rgba(25, 118, 210,.2)"
        class="d-flex align-center justify-center"
        style="
          height: 100%;
          width: 100%;
          position: absolute;
          top: 0;
          left: 0;
          right: auto;
          bottom: auto;
          z-index: 10;
        "
      >
        <v-progress-circular
          indeterminate
          color="primary"
        ></v-progress-circular>
      </v-sheet>
      <vue-dropzone
        class="file-upload"
        ref="myVueDropzone"
        id="dropzone"
        :options="dropzoneOptions"
        :duplicateCheck="true"
        :include-styling="false"
        :useCustomSlot="preview"
        v-on:vdropzone-file-added="addedFunction"
        v-on:vdropzone-files-added="addedFunction"
        v-on:vdropzone-sending="sendingFunction"
        v-on:vdropzone-drop="dropFunction"
        v-on:vdropzone-success-multiple="uploadSuccessFuntion"
        v-on:vdropzone-removed-file="removedFunction"
        v-on:vdropzone-processingFunction-multiple="processingFunction"
        v-on:vdropzone-error-multiple="uploadErrorFunction"
        v-on:vdropzone-duplicate-file="duplicateFileFunction"
      >
        <div v-if="preview == true" class="dropzone-custom-content">
          <div class="overline">Drop your files here</div>
          <v-btn small color class="open-uploader">Upload</v-btn>
        </div>
      </vue-dropzone>
    </div>
    <div
      class="col-12 mt-3 px-3 d-flex align-center"
      style="border-top: 1px solid #cccccc"
    >
      <v-spacer></v-spacer>
      <v-btn
        color="grey"
        text
        :disabled="loading"
        @click="removeAllFilesFunction"
        >clear</v-btn
      >
      <v-btn
        class="ml-3"
        color="primary"
        :disabled="loading"
        @click="uploadFunction"
        >Upload</v-btn
      >
    </div>
    <snack-bar :snackbar-options="sbOptions"></snack-bar>
  </div>
</template>

<script>
import vue2Dropzone from "vue2-dropzone";
import "vue2-dropzone/dist/vue2Dropzone.min.css";
export default {
  components: {
    vueDropzone: vue2Dropzone,
  },
  data() {
    return {
      sbOptions: {
        status: false,
        type: "",
        text: "",
      },
      loading: false,
      preview: true,
      dropzoneOptions: {
        url: "/d/admin/file/upload",
        thumbnailWidth: 40,
        thumbnailHeight: 40,
        uploadMultiple: true,
        autoProcessQueue: false,
        maxFiles: 5,
        parallelUploads: 5,
        maxFilesize: 3,
        timeout: 180000,
        acceptedFiles: ".jpeg,.jpg,.png, .pdf, .webp, .svg",
        previewTemplate: this.dropzoneTemplate(),
        // clickable: ".open-uploader",
        headers: {
          "x-csrf-token": document
            .querySelector('meta[name="csrf-token"]')
            .getAttribute("content"),
        },
      },
    };
  },
  methods: {
    dropzoneTemplate() {
      return `<div class="dz-preview dz-file-preview d-flex pa-2 blue lighten-5">
                <img data-dz-thumbnail />
                <div class="dz-details d-flex align-center justify-start">
                  <div class="px-1 caption">
                    <div class="dz-filename" data-dz-name></div>
                     <div class="dz-size px-1 caption" data-dz-size></div>
                    <div class="error--text" data-dz-errormessage></div>
                  </div>
                  <div class="dz-progress d-flex align-center justify-center caption">
                    <span class="dz-upload" data-dz-uploadprogress></span>
                  </div>
                </div>
                <v-spacer></v-spacer>
                <button
                  data-dz-remove
                  type="button"
                  class="ml-auto v-btn v-btn--flat v-btn--icon v-btn--round theme--light v-size--x-small error--text"
                >
                  <span class="v-btn__content">
                    <i
                      aria-hidden="true"
                      class="v-icon notranslate mdi mdi-trash-can-outline theme--light"
                      style="font-size: 12px;"
                    ></i>
                  </span>
                </button>
              </div>`;
    },
    uploadFunction() {
      this.loading = true;
      this.$refs.myVueDropzone.processQueue();
    },
    processingFunction() {
      this.sbOptions = {
        snackbar: false,
        type: "",
        text: "",
      };
      this.loading = true;
    },
    duplicateFileFunction(e) {
      console.log(
        "Duplicated file will not be inserted in upload queue: " + e.name
      );
    },
    dropFunction(e) {
      e.preventDefault();
      // console.log(e);
    },
    addedFunction(file) {
      // console.log(file);
    },
    removeAllFilesFunction() {
      this.$refs.myVueDropzone.removeAllFiles();
      this.preview = true;
    },
    removedFunction(file, xhr, formData) {
      // console.log(formData);
    },
    sendingFunction(file, xhr, formData) {
        if ( 
          this.$route.name === 'NewUser' || this.$route.name === 'EditUser'
        ) {
          formData.append("type", 'employee'); 
          formData.append("user_id", this.$route.params.id); 
        } else {
            formData.append("type", 'post'); 
        } 
    },
    uploadSuccessFuntion(files, response) { 
      this.sbOptions = {
        status: true,
        type: "success",
        text: response.message,
      };
      this.loading = false;
      this.removeAllFilesFunction();
      this.$emit("uploaded", response);
    },
    uploadErrorFunction(files, message, xhr) {
      this.loading = false;
      this.sbOptions = {
        status: true,
        type: "error",
        text: "Error uploading file(s)",
      };
    },
  },
};
</script>

<style lang="scss">
.loading-sheet {
  position: absolute;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
  bottom: auto;
  right: auto;
}
.file-upload {
  min-height: 200px;
  max-height: 100%;
  width: 100%;
  .dz-message {
    border: 1px dashed #333333;
    background-color: #eeeeee;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    min-height: 200px;
  }
  .dz-preview {
    width: calc(25% - 16px);
    min-width: calc(25% - 16px);
    border-radius: 0;
    margin: 8px;
    min-height: 60px;
    float: left;
    .dz-details {
      .dz-filename {
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
      }
      img {
        width: 30px;
        height: auto;
      }
    }
    &.dz-error.dz-complete {
      background-color: #ffebee !important;
    }
  }
}
.drop-wrapper {
  background-color: #fdfdfd;
  .drop-msg {
    position: absolute;
    top: auto;
    left: 0;
    right: 0;
    bottom: 20px;
    width: 100%;
    text-align: center;
  }
  .textfield {
    width: 100%;
    border-top: 1px solid #f1f1f1;
    background-color: #ffffff;
  }
}
</style>
