<template>
  <div>
    <data-form
      :objectdata="objectData"  
      :pagetitle="'edit'"    
      :newurl="'/d/admin/local-purchase-order/save'"
      :headertitle="'Local Purchase Order (LPO)'"
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
        .get("/d/admin/local-purchase-order/fetch-single/" + this.$route.params.id)
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