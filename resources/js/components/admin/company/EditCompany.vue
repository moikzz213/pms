<template>
  <div>
    <company-form
      :objectdata="objectData"
      :pagetitle="'edit'"
      @saved="savedResponse"
    ></company-form>
  </div>
</template>

<script>
import CompanyForm from "./CompanyForm.vue";
export default {
  components: { CompanyForm },
  data() {
    return { 
      objectData: {},
    };
  },
  methods: { 
    async getData() {
      await axios
        .get("/d/admin/company/get/" + this.$route.params.id)
        .then((response) => {
          this.objectData = Object.assign({}, response.data); 
          if(this.objectData.id === undefined){
            this.$router.push({ name: "Companies" });
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