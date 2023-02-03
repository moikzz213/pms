<template>
  <div>
    <v-card>
      <v-card-text>
        
        <div v-if="imageSelected && imageSelected.length > 1">
          <div width="100%" class="d-flex flex-wrap justify-space-between">
            <div
              class="image-flex-item"
              v-for="img in imageSelected"
              :key="img.id"
            >
              <v-img
                style="border-radius: 4px"
                :lazy-src="`${$baseUrl + '/images/placeholder-image.png'}`"
                :aspect-ratio="1"
                :src="`${$baseUrl + theFolder + img.path}`"
              >
                <template v-slot:placeholder>
                  <v-row
                    class="fill-height ma-0"
                    align="center"
                    justify="center"
                  >
                    <v-progress-circular
                      indeterminate
                      color="grey lighten-5"
                    ></v-progress-circular>
                  </v-row>
                </template>
              </v-img>
            </div>
          </div>
        </div>
        <v-img
          v-else
          style="border-radius: 4px"
          :lazy-src="`${$baseUrl + '/images/placeholder-image.png'}`"
          max-height="200"
          contain 
          :aspect-ratio="1"
          :src="`${
            imageSelected &&
            imageSelected.length > 0 &&
            imageSelected[0].hasOwnProperty('id')
              ? $baseUrl + theFolder + imageSelected[0].path
              : $baseUrl + '/images/placeholder-image.png'
          }`"
        >
          <template v-slot:placeholder>
            <v-row class="fill-height ma-0" align="center" justify="center">
              <v-progress-circular
                indeterminate
                color="grey lighten-5"
              ></v-progress-circular>
            </v-row>
          </template>
        </v-img>
        <v-divider></v-divider>
        <div
          class="d-flex"
          style="
            width: 100%;
            position: absolute;
            bottom: 0;
            top: auto;
            right: auto;
            left: 0;
          "
        >
          <v-btn
            v-show="
              imageSelected &&
              imageSelected.length > 0 &&
              imageSelected[0].hasOwnProperty('id')
                ? true
                : false
            "
            width="50%"
            color="rgba(245, 245, 245, .75)"
            class="flex-grow-1 elevation-0 rounded-0"
            @click="removeImage('thumbnail')"
            >Remove</v-btn
          >
          <v-btn
            width="50%"
            color="rgba(245, 245, 245, .75)"
            class="flex-grow-1 elevation-0 rounded-0"
            @click="addImage('thumbnail')"
            >{{
              imageSelected &&
              imageSelected.length > 0 &&
              imageSelected[0].hasOwnProperty("id")
                ? "Replace"
                : "Upload"
            }}</v-btn
          >
        </div>
      </v-card-text>
    </v-card>

    <v-dialog
      v-model="studioSettings.dialog"
      persistent
      width="1000"
      style="min-height: 400px"
    >
      <v-card>
        <Studio :studio-options="studioSettings" :types="types" :folder="theFolder" @responded="studioResponse" />
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import Studio from "./Studio";

export default {
  name: "Images",
  components: {
    Studio,
  },
  props: {
    selectedImage: {
      type: Array,
      default: null,
    },
    types: {
      type: String,
      default: null,
    },
    folder: {
      type: String,
      default: "/file/"
    }
  },

  data() {
    return {
      imageSelected: [],
      studioSettings: {
        dialog: false,
        multiSelect: false,
      },
      theFolder: this.folder,
    };
  },
  watch: {
    selectedImage: {
      handler(val, oldVal) {
        if (val) {
          let imgSelected = Object.assign([], val);
          this.imageSelected = imgSelected;
        }
      },
      deep: true,
    },
  },
  methods: {
    studioResponse: function (v) {
      this.studioSettings.dialog = v.dialog;
      this.imageSelected = v.images != null ? Object.assign([], v.images) : [];
      this.$emit("selected", this.imageSelected);
    },

    removeImage: function () {
      this.imageSelected = [];
      this.$emit("selected", []);
    },
    addImage: function () {
      this.studioSettings.dialog = true;
    },
  },
  created(){
    console.log("iploadimage", this.types);
  }
};
</script> 