<template>
  <div>
    <data-form
      :objectdata="objectData"
      :newurl="'/d/admin/comparisons/save'"
      :pagetitle="'edit'"  
      :redirectname="'comparisons'"
      :redirectedit="'EditComparison'" 
      :headertitle="'Comparison'"
      @saved="savedResponse"
    ></data-form>
  </div>
</template>

<script>
import DataForm from "./DataForm.vue";

export default {
  components: { DataForm },
  data() {
    return {
      objectData: {},
    };
  },
  methods: {
    getData() {
      axios
        .get("/d/admin/comparisons/fetch-single/" + this.$route.params.id)
        .then((response) => {
          this.objectData = Object.assign({}, response.data);
        })
        .catch((err) => {});
    },
    savedResponse() {
      this.getData();
    },
  },
  mounted() {
    this.getData();
  },
};
</script>