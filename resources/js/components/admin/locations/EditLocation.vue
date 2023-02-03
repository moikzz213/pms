<template>
  <div>
    <location-form
      :objectdata="objectData"
      :pagetitle="'edit'"
      @saved="savedResponse"
    ></location-form>
  </div>
</template>

<script>
import LocationForm from "./LocationForm.vue";

export default {
  components: { LocationForm },
  data() {
    return { 
      objectData: {},
    };
  },
  methods: { 
    async getData() {
      await axios
        .get("/d/admin/locations/fetch/" + this.$route.params.id)
        .then((response) => {
          this.objectData = Object.assign({}, response.data); 
        })
        .catch((err) => {});
    },
    savedResponse(value) { 
      if (value == true) {
        this.getData();
      }
    },
  },
  mounted() {
    this.getData();
  },
};
</script>

<style>
</style>
