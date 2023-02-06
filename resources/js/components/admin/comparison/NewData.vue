<template>
  <div>
    <data-form
      :posttype="'post'"
      :redirectedit="'EditComparison'"
      :newurl="'/d/admin/comparisons/save'"
      :headertitle="'New Comparison'"
    ></data-form>
  </div>
</template>

<script>
import dataForm from "./DataForm";
export default {
  components: { dataForm },
  data() {
    return {
      //   pagetitle: 'Create New' ,
    };
  },
};
</script>

<style>
</style>
