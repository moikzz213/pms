<template>
    <div>
      <v-app-bar color="white" dense class="elevation-0 mt-10 no-print">
        <v-toolbar-title class="overline"> COMPARISON SHEET PAGE</v-toolbar-title>
      </v-app-bar>
      <v-container class="py-8" v-if="pageLoading == true">
        <v-row>
          <v-col cols="12">
            <v-skeleton-loader class="mx-auto" max-width="100%"
              type="list-item-avatar-three-line, image, article"></v-skeleton-loader>
          </v-col>
        </v-row>
      </v-container>
      <v-container style="width:100%;max-width: 2400px;" class="py-2 print-container" v-else> 
          <!-- View / Printing -->
        <v-card flat  class="mx-auto" > 
          <v-card-title class="no-print bordered"> 
              <v-btn x-small color="secondary" class="mx-2" @click="viewQuotationComparison">BACK</v-btn>
          </v-card-title>
          <v-card-text>
            <v-row class="padding-0">
              <div class="col-12 col-md-12 padding-0">
                  <v-form ref="form">
                    <v-row>
                      <v-col md="12" sm="12">
                        <v-card   elevation="0">
                          <v-card-text> 
                            <v-row>
                              <!-- Left side column -->
                              <v-col class="col-4 pr-10 mt-5">
                                <v-row> 
                                  <v-col class="my-auto col-4 col-md-4 col-sm-4 py-0"> COMPANY </v-col>
                                  <v-col class="my-auto col-8 col-md-8 col-sm-8 py-0"> {{ formObj.company ? formObj.company.title : '' }} </v-col>
  
                                  <v-col class="my-auto col-4 col-md-4 col-sm-4 py-0"> CATEGORY </v-col>
                                  <v-col class="my-auto col-8 col-md-8 col-sm-8 py-0">
                                    {{ formObj.department ? formObj.department.title : '' }}
                                  </v-col>
                                  <v-col class="my-auto col-4 col-md-4 col-sm-4 py-0"> DATE </v-col>
                                  <v-col class="my-auto col-8 col-md-8 col-sm-8 py-0">
                                    {{ formatDateHelper(formObj.created_at) }}
                                  </v-col>
                                </v-row>
                              </v-col>
                              <v-col class="col-4 pr-10 mt-5">
                                    <h2 class="text-center">COMPARISON SHEET</h2>
                                    <h3 class="text-center">{{formObj.title}} </h3>
                              </v-col>
                              <v-col class="col-4 pr-10 mt-5"></v-col>
                            </v-row>  
  
                            <v-row class="padding-0">
                              <v-col class="col-12 padding-0">
                                <table border="1" cellspacing="0" cellpadding="0" class="pb-0 td-vertical-top">
                                    <thead>
                                        <tr>
                                          <th rowspan="2" width="35">S/N</th>
                                          <th rowspan="2" width="200">DESCRIPTION</th>
                                          <th rowspan="2">CATEGORY</th>
                                          <th rowspan="2">QTY</th>
                                          <th rowspan="2">UOM</th>
                                          <th rowspan="2" colspan="2">PREVIOUS STORE</th>
                                          <th colspan="3" class="text-center" v-for="item in validSuppliers" :key="item.id">
                                              {{ item.title }}
                                          </th>
                                        </tr>
                                      <tr>
                                        <!-- with rowspan above -->
                                        <th v-for="(item,index) in supplierCount" :key="item">
                                            {{ headers[index] }}
                                        </th>
                                      </tr>
                                    </thead>
                                    <tbody v-if="tableForm && tableForm.length > 0">
                                        <tr v-for="(item, index) in tableForm" :key="item.id">
                                            <td class="text-center">{{ index+1 }}</td>
                                            <td>{{ item.description }}</td>
                                            <td class="text-center">{{ item.category ?  item.category.title: '' }}</td>
                                            <td class="text-center">{{ item.qty }}</td>
                                            <td class="text-center">{{ item.uom }}</td>
                                            <td class="text-center">{{ item.previous_amount }}</td>
                                            <td class="text-center">{{ item.previous_amount ? (item.qty * item.previous_amount).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : '' }}</td>
                                            <template v-for="(sp,dx) in validSuppliers" >
                                              <td width="150"> {{ sp.quotations && sp.quotations.length > 0 && sp.quotations[index] && item.id == sp.quotations[index].comparison_item_id ? sp.quotations[index].description : ''}} </td>
                                              <td class="text-right"> {{ sp.quotations && sp.quotations.length > 0 && sp.quotations[index] && item.id == sp.quotations[index].comparison_item_id ? sp.quotations[index].unit_price : ''}} </td>
                                              <td class="text-right"> {{ sp.quotations && sp.quotations.length > 0 && sp.quotations[index] && item.id == sp.quotations[index].comparison_item_id ? sp.quotations[index].total_amount : ''}} </td>
                                            </template>
                                        </tr>
                                    </tbody>
                                    <tfoot>
                                      <tr>
                                        <td colspan="7"> SUBTOTAL </td>
                                        <td colspan="3" class="text-right" v-for="item in validSuppliers" :key="item.id"> 
                                          {{ item.netamount && item.netamount.length > 0 ? Number(item.netamount[0].sub_total).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : '-' }}
                                        </td>
                                      </tr>
                                      <tr>
                                        <td colspan="7"> DISCOUNT </td>
                                        <td colspan="3" class="text-right" v-for="item in validSuppliers" :key="item.id"> 
                                          {{ item.netamount && item.netamount.length > 0 && item.netamount[0].discount && item.netamount[0].discount > 0 ? 
                                          Number(item.netamount[0].discount).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : '-' }}
                                        </td>
                                      </tr>
                                      <tr>
                                        <td colspan="7"> TOTAL AFTER DISCOUNT </td>
                                        <td colspan="3" class="text-right" v-for="item in validSuppliers" :key="item.id"> 
                                          {{ item.netamount && item.netamount.length > 0 && item.netamount[0].discount && 
                                          item.netamount[0].discount > 0 ? 
                                          Number(item.netamount[0].net_amount).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : '-' }}
                                        </td>
                                      </tr>
                                      <tr>
                                        <td colspan="7"> VAT 5% </td>
                                        <td colspan="3" class="text-right" v-for="item in validSuppliers" :key="item.id"> 
                                          {{ item.netamount && item.netamount.length > 0 ?Number(item.netamount[0].vat).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : '-' }}
                                        </td>
                                      </tr>
                                      <tr>
                                        <td colspan="7"> TOTAL AMOUNT </td>
                                        <td colspan="3" class="text-right" v-for="item in validSuppliers" :key="item.id"> 
                                          {{ item.netamount && item.netamount.length > 0 ? Number(item.netamount[0].total_amount).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : '-' }}
                                        </td>
                                      </tr>
                                      <tr>
                                        <td colspan="7"> REMARKS </td>
                                        <td colspan="3" class="text-center" v-for="item in validSuppliers" :key="item.id"> 
                                          <v-text-field  v-if="formObj.status !== 'closed' && formObj.status !== 'cancelled'" dense outlined hide-details v-model="item.comparisons.remarks" @change="hasChange" class="no-print"></v-text-field>
                                          <div :class="formObj.status !== 'closed' && formObj.status !== 'cancelled' ? 'for-printing' : ''">{{ item.comparisons.remarks }}</div>
                                        </td>
                                      </tr>
                                      <tr>
                                        <td colspan="7"> PROJECTS TEAM EVALUATION </td>
                                        <td v-if="validSuppliers && validSuppliers.length > 0" :colspan="validSuppliers.length * 3"> 
                                       
                                          <v-text-field v-if="formObj.status !== 'closed' && formObj.status !== 'cancelled'" dense outlined hide-details v-model="evaluation" class="no-print" @change="hasChange"> </v-text-field>
                                          <div :class="formObj.status !== 'closed' && formObj.status !== 'cancelled' ? 'for-printing' : ''">{{ evaluation }}</div>
                                        </td>
                                      </tr>
                                      <tr>
                                        <td colspan="7"> POSITION (L1 = LOWEST 1) </td>
                                        <td colspan="3" class="text-center" v-for="(item, dx) in validSuppliers" :key="item.id"> 
                                            <div v-for="(itm, idx) in lowestLabel" :key="itm.id" class="font-weight-bold py-0 my-0">
                                                {{ item.id == itm.id ? `L${idx+1}` : ''}}
                                            </div>
                                        </td>
                                      </tr>
                                      <tr>
                                        <td colspan="7"> DIFFERENCE FROM L1 </td>
                                        <td colspan="3" class="text-center" v-for="item in validSuppliers" :key="item.id"> 
                                          <div v-for="(itm, idx) in lowestLabel" :key="itm.id" class="font-weight-bold my-0 py-0">
                                                {{ item.id == itm.id ?  Number(itm.diff).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ''}}
                                            </div>
                                        </td>
                                      </tr>
                                      <tr>
                                        <td colspan="7"> REMARKS </td>
                                        <td colspan="3" class="text-center" v-for="item in validSuppliers" :key="item.id"> 
                                          <v-text-field v-if="formObj.status !== 'closed' && formObj.status !== 'cancelled'" dense outlined hide-details v-model="item.comparisons.remarks_optional" class="no-print" @change="hasChange"></v-text-field>
                                          <div :class="formObj.status !== 'closed' && formObj.status !== 'cancelled' ? 'for-printing' : ''">{{ item.comparisons.remarks_optional }}</div>
                                        </td>
                                      </tr>
                                      <tr>
                                        <td colspan="7"> RECOMMENDATIONS </td>
                                        <td colspan="3" class="text-center" v-for="item in validSuppliers" :key="item.id"> 
                                          <v-text-field v-if="formObj.status !== 'closed' && formObj.status !== 'cancelled'" dense outlined hide-details v-model="item.comparisons.recommendation" class="no-print" @change="hasChange"></v-text-field>
                                          <div :class="formObj.status !== 'closed' && formObj.status !== 'cancelled' ? 'for-printing' : ''">{{ item.comparisons.recommendation }}</div>
                                        </td>
                                      </tr>
                                      <tr>
                                        <td colspan="7"> DELIVERY </td>
                                        <td colspan="3" class="text-center" v-for="item in validSuppliers" :key="item.id"> 
                                          <v-text-field v-if="formObj.status !== 'closed' && formObj.status !== 'cancelled'" dense outlined hide-details v-model="item.comparisons.delivery" class="no-print" @change="hasChange"></v-text-field>
                                          <div :class="formObj.status !== 'closed' && formObj.status !== 'cancelled' ? 'for-printing' : ''">{{ item.comparisons.delivery }}</div>
                                        </td>
                                      </tr>
                                      <tr>
                                        <td colspan="7"> PAYMENT TERM </td>
                                        <td colspan="3" class="text-center" v-for="item in validSuppliers" :key="item.id"> 
                                          <v-text-field v-if="formObj.status !== 'closed' && formObj.status !== 'cancelled'" dense outlined hide-details v-model="item.comparisons.payment_term" class="no-print" @change="hasChange"></v-text-field>
                                          <div :class="formObj.status !== 'closed' && formObj.status !== 'cancelled' ? 'for-printing' : ''">{{ item.comparisons.payment_term }}</div>
                                        </td>
                                      </tr>
                                      <tr class="no-print">
                                        <td colspan="7"> ATTACHMENT(S) </td>
                                        <td colspan="3" class="text-center" v-for="item in validSuppliers" :key="item.id"> 
                                          <div v-if="item.netamount && item.netamount.length > 0 && item.netamount[0].images && item.netamount[0].images.length > 0">
                                              <div v-for="img in item.netamount[0].images" :key="img.id">
                                                <a :href="`/file/quotations/${img.path}`" target="_blank" rel="noopener noreferrer"> {{ img.title }}</a>
                                              </div>
                                          </div> 
                                        </td>
                                      </tr>
                                      <tr class="no-print">
                                        <td colspan="7">   </td>
                                        <td colspan="3" class="text-center" v-for="item in validSuppliers" :key="item.id"> 
                                          <v-checkbox
                                          
                                          @change="onChangeSelected"
                                          class="col-12 mx-auto pb-1"
                                          dense
                                          hide-details
                                          v-model="selected"
                                          label="SELECT QUOTATION" 
                                          :value="item.netamount[0].id"
                                        ></v-checkbox>
                                        </td>
                                      </tr>
                                    </tfoot>
                                 </table>
                              </v-col>
                            </v-row> 

                          <v-row class="padding-0 mt-1">
                          <v-col class="padding-0">
                            <v-row>
                              <div style="width:144px; margin:0 0 0 10px;" v-for="approval in approvers" :key="approval.id">
                                <div style=" height:70px;  border:1px solid #000;"></div>
                                <div class="text-center mt-2">
                                  <h4 class="text-capitalize py-0 my-0">{{ approval.approval_type.replace("_", " ") }}</h4>
                                  <h4 class="text-capitalize py-0 my-0">{{ approval.profile ? approval.profile.name : '' }}</h4>
                                  <h4 class="py-0 my-0">{{ approval.profile ? approval.profile.designation : '' }}</h4>
                                </div>
                              </div>
                            </v-row>
                          </v-col>
                        </v-row>
                            <v-row class="pb-8 no-print" v-if="formObj.status != 'closed' && formObj.status != 'cancelled'">
                              <v-col>
                                <v-btn dense color="primary"  :loading="loadingSubmit" :disabled="disabled" @click="submit">UPDATE</v-btn>
                              </v-col>
                            </v-row>
                          </v-card-text>
                        </v-card>
                      </v-col>
                    </v-row>
                  </v-form>
               
              </div>
            </v-row>
          </v-card-text>
        </v-card>
  
      </v-container>
      <snack-bar :snackbar-options="sbOptions" class="no-print"></snack-bar>
  
    </div>
  </template>
  <script> 
  export default {
    name: "DataForm",
  
   
    data() {
      return {
        disabled: true,
        isTrue: true,
        isFalse: false,
        selected: '',
        tableForm: [],
        formObj: {},
        pageLoading: true,
        loadingSubmit: false,
        headers: [],
        supplierCount: 0,
        validSuppliers: [],
        evaluation: '',
        lowestLabel: '',
        sbOptions: {},
        originalData: '',
        approvers: [],
      };
    },
 
    methods: {
      hasChange: function(){
        this.disabled = false;
      },
      onChangeSelected: function(e){
        this.selected = '';
        this.selected = e; 
        
        this.disabled = false;
      },
        viewQuotationComparison: function(){
          this.$router.push({
            name: "EditComparison",
            params: { id: this.$route.params.id },
          });
        },

        submit: function(){
        
          let bdata = '';
          this.loadingSubmit = true;

          this.sbOptions = {
            status: true,
            type: "info",
            text: "Submitting...",
          };
          bdata = this.validSuppliers.map((o,i) => {
            delete o["address"];
            delete o["code"];
            delete o["contact_no"];
            delete o["contact_person"];
            delete o["created_at"];
            delete o["email"];
            delete o["id"];
            
            delete o["pivot"];
            delete o["quotations"];
            delete o["tax_no"];
            delete o["title"];
            delete o["updated_at"];
            o.id = o.comparisons.id;
            o.delivery = o.comparisons.delivery;
            o.payment_term = o.comparisons.payment_term;
            o.recommendation = o.comparisons.recommendation;
            o.remarks = o.comparisons.remarks;
            o.remarks_optional = o.comparisons.remarks_optional; 
           
            return o;
          });

          let formData = {
            id: this.$route.params.id,
            eval: this.evaluation,
            items: bdata,
            selected: this.selected
          }  

          axios.post('/d/admin/comparison/quotation-save',formData).then((response) => {
            console.log(response.data);
            this.sbOptions = {
              status: true,
              type: "success",
              text: response.data.message,
            };

            setTimeout(() => {
              this.loadingSubmit = false;
               this.disabled = true;
                this.fetchComparison();
              }, 1000);
          }); 
         
        },

        fetchComparison: async function(){
            await axios.get('/d/admin/comparisons/viewing/'+this.$route.params.id).then((response) => {
                let res = response.data.item;
               
                this.tableForm = res.items;
                let supp = res.suppliers; 
                this.formObj = res;

                let count = 0 ;
                let labelLowest = [];
                let orig = [];
                this.evaluation = res.evaluation;
                supp.map((o,i) =>{
                  if(o.quotations && o.quotations.length > 0 && o.netamount[0].status !== 'removed'){
                    this.headers.push('Brand/Packing','Unit Cost', 'Total Cost');
                    if(o.netamount && o.netamount.length > 0){
                      let vat = parseFloat(o.netamount[0].net_amount) * 0.05;
                      o.netamount[0].vat = vat;
                      o.netamount[0].sub_total = parseFloat(o.netamount[0].net_amount) + parseFloat(o.netamount[0].discount);
                      o.netamount[0].total_amount = parseFloat(o.netamount[0].net_amount) + vat;
                      o.comparisons = o.netamount[0];
                      labelLowest[count] = {id: o.id, title: o.title, value:parseFloat(o.netamount[0].net_amount) + vat};
                    
                      if(o.netamount[0].status == 'selected'){
                        this.selected = o.netamount[0].id; 
                      }
                    }
                    orig[count] = o;
                    count++;
                  } 
                });

                this.validSuppliers = orig;
                this.lowestLabel = labelLowest;
             
                this.lowestLabel.sort(function(a, b) {
                  return a.value - b.value;
                });
                if(this.lowestLabel && this.lowestLabel.length > 0){
                  let getLowestValue = this.lowestLabel[0].value;

                  this.lowestLabel.map((o,i) =>{
                    if(i == 0){
                      o.diff = 0;
                    }else{
                      o.diff = parseFloat(o.value) - parseFloat(getLowestValue);
                    }
                  });
                  
                }

                this.approvers = res.comparison_approvals;
                this.originalData = orig; 
                this.supplierCount = orig.length * 3;  
            });
        }
  
    },
    created() {  
      this.fetchComparison().then(() => {
            this.pageLoading = false; 
      }); 
    },
  };
  </script> 
<style scoped>
table th{ font-size:10px !important;}
table td {font-size: 10px !important; vertical-align: middle;}
</style>