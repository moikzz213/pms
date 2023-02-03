<template>
  <v-card>
    <v-card-title>
      <h3 class="text-uppercase">Media Files</h3>
      <v-spacer></v-spacer>
      <v-btn fab x-small class="elevation-2 error" @click="closeStudio">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-card-title>
    <v-card-text>
      <v-tabs color="primary" left>
        <v-tab>Uploader</v-tab>
        <v-tab
          @click="
            () => {
              checkAndFetchFiles('tab');
            }
          "
          >Media Files</v-tab
        >
        <v-tab-item transition="fade" reverse-transition="fade">
          <v-container fluid style="background-color: #f9f9f9">
            <v-row>
              <upload-zone
                :upload-file-type="uploadTypeData"
                @uploaded="uploadZoneResponse"
              />
            </v-row>
          </v-container>
        </v-tab-item>
        <v-tab-item transition="fade" reverse-transition="fade">
          <v-container
            fluid
            style="background-color: #f9f9f9; min-height: 420px"
            class="d-flex flex-column"
          >
            <v-row>
              <v-col
                class="pa-2"
                v-for="file in files"
                :key="file.id"
                cols="6"
                sm="3"
                md="2"
              >
                <v-card
                  @click="selectImage(file)"
                  :class="`bordered-file ${
                    isActive(file) == true ? 'selected-file' : ''
                  } ga-studio-file-card`"
                >
                  <div
                    v-if="file.mime == 'application/pdf'"
                    class="ga-studio-file-card-item"
                    style="z-index: -1"
                  >
                    <div class="ga-scale">
                      <embed
                        :src="`${
                          $baseUrl + '/file/' + file.path
                        }#toolbar=0&navpanes=0&scrollbar=0&view=Fit`"
                        width="100%"
                        :type="file.mime"
                      />
                    </div>
                  </div>
                  <div v-else class="ga-studio-file-card-item">
                    <v-img
                      class="grey lighten-2"
                      :src="`${$baseUrl + '/file/' + file.path}`"
                      aspect-ratio="1"
                    ></v-img>
                    <!-- :lazy-src="`${
                        $baseUrl + '/images/placeholder-image.png'
                      }`" -->
                  </div>
                </v-card>
                 
                <div class="caption">{{ file.title.substring(0, 18) }}</div>
              </v-col>
            </v-row>
            <v-row>
              <v-col class="text-center">
                <v-btn
                  v-if="loaded == false"
                  color="primary overlined"
                  :loading="loading"
                  @click="loadMoreImage"
                  >Load More Image</v-btn
                >
                <div v-else class="transparent overline">
                  All files have been loaded
                </div>
              </v-col>
            </v-row>
            <v-row>
              <v-col class="text-right" style="border-top: 1px solid #cccccc">
                <v-btn class="primary" @click="useImage">select</v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-tab-item>
      </v-tabs>
    </v-card-text>
  </v-card>
</template>

<script>
import UploadZone from "./UploadZone";
export default {
  props: {
    studioOptions: {
      type: Object,
      default: null,
    },
    queryObject: {
      type: Object,
      default: null,
    },
  },
  components: { UploadZone },
  data() {
    return {
      uploadTypeData: this.queryObject ? this.queryObject.upload_type : 6,
      studioResponse: {
        dialog: false,
        images: null,
      },
      selectedImages: [],
      loaded: false,
      loading: false,
      hasClicked: false,
      files: [],
      page: 1,
      multiSelect: this.studioOptions.multiSelect
        ? this.studioOptions.multiSelect
        : false,
    };
  },
  methods: {
    isActive(f) {
      return this.selectedImages.includes(f) ? true : false;
    },
    selectImage(file) {
      if (this.multiSelect == false) {
        // check if multiSelect
        this.selectedImages = []; // reset if not multiSelect
      }
      if (this.selectedImages.includes(file)) {
        // Remove object if already exist
        this.selectedImages = this.selectedImages.filter(
          (obj) => JSON.stringify(obj) !== JSON.stringify(file)
        );
      } else {
        // Push object if does not exist
        this.selectedImages.push(file);
      }
    },
    useImage() {
      this.studioResponse.images = this.selectedImages;
      this.$emit("responded", this.studioResponse);
    },
    closeStudio() {
      this.$emit("responded", this.studioResponse);
    },
    uploadZoneResponse(v) {
      this.page = 1;
      this.files = [];
      this.hasClicked = false;
    },
    checkAndFetchFiles(from) {
      if (from === "tab" && this.hasClicked === false) {
        this.getAllFiles().then(() => {
          this.hasClicked = true;
        });
      }
      if (from === "loadmore") {
        this.getAllFiles();
      }
    },
    async getAllFiles() {
      this.loading = true;
      let controller = "/d/admin/fetch/all/logos";
      await axios
        .get(controller+"?page=" + this.page)
        .then((response) => {
          response.data.data.forEach((i) => this.files.push(i));
          this.loaded = response.data.data.length < 12 ? true : false;
          this.loading = false;
          console.log(this.files);
        })
        .catch((error) => {
          this.loading = false;
          console.log("Error Fetching Files");
          console.log(error);
        });
    },
    loadMoreImage() {
      this.page = this.page + 1;
      this.checkAndFetchFiles("loadmore");
    },
  },
  created() {
    console.log(this.studioOptions);
  },
};
</script>
