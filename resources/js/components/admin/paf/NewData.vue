<template>
  <div>
    <data-form
      :posttype="'post'"
      :redirectedit="'EditPaf'"
      :newurl="'/d/admin/payment-approval-form/save'"
      :headertitle="'Create New Payment Approval Form (PAF)'"
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