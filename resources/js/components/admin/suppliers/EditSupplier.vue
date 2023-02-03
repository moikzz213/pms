<template>
  <div>
    <supplier-form
      :objectdata="objectData"
      :pagetitle="'edit'"
      @saved="savedResponse"
    ></supplier-form>
  </div>
</template>

<script>
import SupplierForm from "./SupplierForm.vue";
export default {
  components: { SupplierForm },
  data() {
    return { 
      objectData: {},
    };
  },
  methods: { 
    async getData() {
      await axios
        .get("/d/admin/suppliers/get/" + this.$route.params.id)
        .then((response) => {
          this.objectData = Object.assign({}, response.data); 
          if(this.objectData.id === undefined){
            this.$router.push({ name: "Suppliers" });
          }
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