<template>
  <div>
    <data-form
      :posttype="'post'"
      :redirectedit="'EditRequest'"
      :newurl="'/d/admin/requests/save'"
      :headertitle="'New Request'"
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
