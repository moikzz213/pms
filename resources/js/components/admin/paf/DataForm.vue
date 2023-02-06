<template>
  <div>
    <v-app-bar color="white" dense class="elevation-0 mt-10 no-print">
      <v-toolbar-title class="overline"> {{ cardTitle }}</v-toolbar-title>
    </v-app-bar>
    <v-container class="py-8" v-if="pageLoading == true">
      <v-row>
        <v-col cols="12">
          <v-skeleton-loader class="mx-auto" max-width="100%"
            type="list-item-avatar-three-line, image, article"></v-skeleton-loader>
        </v-col>
      </v-row>
    </v-container>
    <v-container class="py-2 print-container " v-else>

      <!-- Editable Form -->
      <v-card flat maxWidth="1200" class="mx-auto paf-editable-page" v-if="formEditable">

        <v-card-title>
          <div v-if='pagetitle == "edit"'>
            <v-btn x-small color="primary" class="mx-2" @click="funcEditForm(false)">CANCEL</v-btn>
          </div>
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col class="no-print bordered">
              <div class="small">RELATION: <span class="red--text"> IF THERE IS LPO, SELECT LPO. OTHERWISE SELECT
                  PRF.</span> </div>
              <div class="small">PRF/LPO NO: <span class="red--text">ONLY ONPROCESS STATUS WILL BE SHOWN ON DROPDOWN
                  SELECTION!</span></div>
            </v-col>
          </v-row>
          <v-row>
            <div class="col-12 col-md-12">
              <ValidationObserver ref="user_form_observer" v-slot="{ valid }">
                <v-form ref="form">
                  <v-row>
                    <v-col md="12" sm="12">
                      <v-card :loading="loading" elevation="0">
                        <v-card-text>

                          <v-row>
                            <!-- Left side column -->
                            <v-col class="col-6 pr-10">
                              <v-row>
                                <v-col class="my-auto col-4 col-md-4 col-sm-4 py-1"> SELECT RELATION (LPO/PRF)* </v-col>
                                <v-col class="my-auto col-8 col-md-8 col-sm-8 py-1">
                                  <ValidationProvider v-slot="{ errors }" rules="required" name="LPO/PRF">
                                    <v-autocomplete :items="isLPOPRF" @change="selectedTypes" autofocus
                                      v-model="formObj.relation" item-value="id" item-text="title" outlined dense
                                      hide-details label="LPO/PRF*" :error-messages="errors">
                                    </v-autocomplete>
                                  </ValidationProvider>

                                </v-col>
                                <v-col class="my-auto col-4 col-md-4 col-sm-4 py-1"> PAF NO. </v-col>
                                <v-col class="my-auto col-8 col-md-8 col-sm-8 py-1">
                                  <v-text-field v-model="formObj.paf_no" outlined dense hide-details disabled
                                    label="AUTO GENERATE"></v-text-field>
                                </v-col>
                                <v-col class="my-auto col-4 col-md-4 col-sm-4 py-1"> REQUESTED BY </v-col>
                                <v-col class="my-auto col-8 col-md-8 col-sm-8 py-1">
                                  <v-text-field v-model="formObj.requestor" outlined dense hide-details
                                    disabled></v-text-field>
                                </v-col>
                                <v-col class="my-auto col-4 col-md-4 col-sm-4 py-1"> DEPARTMENT NAME
                                </v-col>
                                <v-col class="my-auto col-8 col-md-8 col-sm-8 py-1">
                                  <v-text-field v-model="formObj.department_name" outlined dense hide-details
                                    disabled></v-text-field>
                                </v-col>
                                <v-col class="my-auto col-4 col-md-4 col-sm-4 py-1"> PURCHASE LIMIT </v-col>
                                <v-col class="my-auto col-8 col-md-8 col-sm-8 py-1">
                                  <v-text-field type="number" v-model="formObj.purchase_limit" outlined dense
                                    hide-details></v-text-field>
                                </v-col>
                                <v-col class="my-auto col-4 col-md-4 col-sm-4 py-1"> DOCUMENT NO. (FOR ACCOUNTS)
                                </v-col>
                                <v-col class="my-auto col-8 col-md-8 col-sm-8 py-1">
                                  <v-text-field v-model="formObj.document_no_1" outlined dense
                                    hide-details></v-text-field>
                                </v-col>

                                <v-col class="my-auto col-4 col-md-4 col-sm-4 py-1"> SUPPLIER NAME* </v-col>
                                <v-col class="my-auto col-8 col-md-8 col-sm-8 py-1">
                                  <ValidationProvider v-slot="{ errors }" rules="required" name="Supplier">
                                    <v-autocomplete :items="supplierList" @click="fetchSuppliers" multiple return-object
                                      v-model="ObjSupplier" item-value="id" item-text="title" outlined dense
                                      hide-details label="Supplier*" :error-messages="errors">
                                    </v-autocomplete>
                                  </ValidationProvider>

                                </v-col>
                              </v-row>
                            </v-col>

                            <!-- Right side column -->
                            <v-col class="col-6 pr-10">
                              <v-row>
                                <v-col class="my-auto col-4 col-md-4 col-sm-4 py-1"> {{
                                  formObj.relation == 'prf' ? 'PRF NO.' : 'LPO NO.' }} </v-col>
                                <v-col class="my-auto col-8 col-md-8 col-sm-8 py-1">
                                  <ValidationProvider v-if="formObj.relation == 'prf'" v-slot="{ errors }"
                                    rules="required" name="PRF">
                                    <v-autocomplete :items="prfList" multiple v-model="ObjPrf"
                                      @change="selectedPRFLPO('prf')" return-object item-value="id" item-text="prf_no"
                                      :error-messages="errors" outlined dense hide-details
                                      label="PRF NO*"></v-autocomplete>
                                  </ValidationProvider>
                                  <ValidationProvider v-else v-slot="{ errors }" rules="required" name="LPO">
                                    <v-autocomplete :items="LpoList" multiple v-model="ObjLPO"
                                      @change="selectedPRFLPO('lpo')" return-object item-value="id" item-text="lpo_no"
                                      :error-messages="errors" outlined dense hide-details
                                      label="LPO NO*"></v-autocomplete>
                                  </ValidationProvider>
                                </v-col>

                                <v-col class="my-auto col-4 col-md-4 col-sm-4 py-1"> PAF DATE </v-col>
                                <v-col class="my-auto col-8 col-md-8 col-sm-8 py-1">
                                  {{ formObj.created_at ? formatDateHelper(formObj.created_at) : formatDateHelper() }}
                                </v-col>

                                <v-col class="my-auto col-4 col-md-4 col-sm-4 py-1"> DEPARTMENT HEAD NAME* </v-col>
                                <v-col class="my-auto col-8 col-md-8 col-sm-8 py-1">
                                  <v-text-field v-model="formObj.department_head" outlined dense
                                    hide-details></v-text-field>
                                </v-col>

                                <v-col class="my-auto col-4 col-md-4 col-sm-4 py-1"> MODE OF PAYMENT* </v-col>
                                <v-col class="my-auto col-8 col-md-8 col-sm-8 py-1">
                                  <ValidationProvider v-slot="{ errors }" rules="required" name="MODE OF PAYMENT">
                                    <v-text-field outlined dense hide-details v-model="formObj.mode_of_payment"
                                      label="MODE OF PAYMENT*" :error-messages="errors"></v-text-field>
                                  </ValidationProvider>
                                </v-col>

                                <v-col class="my-auto col-4 col-md-4 col-sm-4 py-1"> CASH/CREDIT CARD LIMIT </v-col>
                                <v-col class="my-auto col-8 col-md-8 col-sm-8 py-1">
                                  <v-text-field type="number" outlined dense hide-details
                                    v-model="formObj.cash_card_limit"></v-text-field>
                                </v-col>
                                <v-col class="my-auto col-4 col-md-4 col-sm-4 py-1"> DOCUMENT NO. (FOR ACCOUNTS)
                                </v-col>
                                <v-col class="my-auto col-8 col-md-8 col-sm-8 py-1">
                                  <v-text-field outlined dense hide-details
                                    v-model="formObj.document_no_2"></v-text-field>
                                </v-col>
                              </v-row>
                            </v-col>
                          </v-row>
                          <v-row>
                            <v-col class="col-12"> <v-divider></v-divider></v-col>
                          </v-row>

                          <v-row>
                            <v-col class="col-12">
                              <div class="d-flex">
                                <v-btn dense color="secondary" class="mx-2 my-auto" small
                                  @click="addItem('item')">ADD</v-btn>
                                <v-autocomplete outlined dense v-model="formObj.currency" :items="currencyList"
                                  class="mx-2 col-3 col-md-2" hide-details label="Currency" item-value="value"
                                  item-text="title"></v-autocomplete>
                                <v-text-field type="number" @change="onChangeVat" v-model="defaultVat" outlined dense
                                  label="% VAT" hide-details class="mx-2 col-3 col-md-1"></v-text-field>

                              </div>
                            </v-col>
                          </v-row>
                          <!-- Table items -->
                          <v-row>
                            <v-col class="col-12 overflow-table" style="overflow:auto;">
                              <v-simple-table>
                                <template v-slot:default>
                                  <thead>
                                    <tr>
                                      <th>LPO/PRF</th>
                                      <th>LOCATION</th>
                                      <th>SUPPLIER*</th>
                                      <th>SUPPLIER INVOICE#</th>
                                      <th>DESCRIPTION</th>
                                      <th>S/N*</th>
                                      <th>INVOICE DATE</th>
                                      <th>QTY</th>
                                      <th>UNIT PRICE</th>
                                      <th>TOTAL AMOUNT</th>
                                      <th>{{ formObj.vat_custom }}% VAT</th>
                                      <th>TOTAL AMOUNT ({{ formObj.currency }})</th>
                                      <th width="1%"></th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr v-for="(item, index) in tableForm" :key="item.id" class="mt-2">
                                      <td>
                                        <ValidationProvider rules="required" name="LPO/PRF">
                                          <v-autocomplete item-value="id"
                                            :item-text="`${formObj.relation == 'prf' ? 'prf_no' : 'lpo_no'}`"
                                            :items="ObjItemId" v-model="item.local_purchase_order_id" outlined dense
                                            label="LPO/PRF*" hide-details></v-autocomplete>
                                        </ValidationProvider>
                                      </td>
                                      <td>
                                        <v-text-field v-model="item.location" outlined dense label="LOCATION"
                                          hide-details></v-text-field>
                                      </td>
                                      <td>

                                      <v-autocomplete item-value="id" item-text="title" :items="ObjSupplier"
                                          v-model="item.supplier_id" outlined dense label="Supplier*"
                                          hide-details></v-autocomplete> 
                                      </td>
                                      <td>
                                        <v-text-field v-model="item.supplier_invoice_num" outlined dense label="INV.NO."
                                          hide-details></v-text-field>
                                      </td>
                                      <td>
                                        <ValidationProvider rules="required" name="Description">
                                          <v-textarea v-model="item.description" outlined dense rows="2"
                                            label="DESCRIPTION*" hide-details></v-textarea>
                                        </ValidationProvider>
                                      </td>
                                      <td>
                                        <v-text-field v-model="item.serial_number" outlined dense label="S/N"
                                          hide-details></v-text-field>
                                      </td>
                                      <td width="50">
                                        <v-text-field type="date" v-model="item.invoice_date" outlined dense
                                          label="DATE" hide-details></v-text-field>
                                      </td>
                                      <td>
                                        <v-text-field type="number" @change="onChangeItem(index)" v-model="item.qty"
                                          outlined dense label="QTY" hide-details></v-text-field>
                                      </td>
                                      <td>
                                        <v-text-field type="number" @change="onChangeItem(index)"
                                          v-model="item.unit_price" outlined dense label="UNIT PRICE"
                                          hide-details></v-text-field>
                                      </td>
                                      <td class="text-center">
                                        {{ isNaN(item.amount) ? '' : item.amount }}
                                      </td>
                                      <td>
                                        <v-text-field v-model="item.vat" @change="onChangeItem(index, true)" outlined
                                          dense hide-details></v-text-field>
                                      </td>
                                      <td class="text-center">
                                        {{ isNaN(item.total_amount) ? '' : item.total_amount  }}
                                      </td>
                                      <td>
                                        <div class="row-delete" @click="removeItem(index, 'item')"><v-icon color="red"
                                            v-if="tableForm.length > 1">mdi-trash-can</v-icon> </div>
                                      </td>
                                    </tr>
                                  </tbody>
                                </template>
                              </v-simple-table>
                            </v-col> 
                          </v-row>
                          <v-row>
                            <v-col class="col-12 col-md-8">
                              <v-textarea rows="8" class="col-11" v-model="formObj.remarks_general" outlined
                                hide-details label="Remarks"></v-textarea>
                            </v-col>
                            <v-col class="col-12 col-md-4">
                              <div class="d-flex mb-4">
                                <v-checkbox label="Advance Payment?" @change="funcSpecialData" dense class="ma-0 pt-0"
                                  v-model="formObj.is_advance_payment" hide-details></v-checkbox>

                              </div>
                              <v-row>
                                <v-col class="col-4 py-1 my-auto">Total</v-col>
                                <v-col class="col-8 py-1"><v-text-field v-model="formObj.total_amount" outlined
                                    hide-details dense disabled label="Total"></v-text-field></v-col>

                                <v-col class="col-4 py-1">
                                  <v-text-field v-model="formObj.discount_title" outlined hide-details dense
                                    label="Title" class="mb-2"></v-text-field>
                                  <v-text-field v-model="calcSign" class="mt-1" outlined hide-details dense
                                    label="SIGN"></v-text-field>
                                </v-col>
                                <v-col class="col-8 py-1"><v-text-field type="number" @change="onChangeDiscount"
                                    v-model="formObj.discount" outlined hide-details dense></v-text-field></v-col>

                                <v-col class="col-4 py-1 my-auto">Total VAT</v-col>
                                <v-col class="col-8 py-1"><v-text-field v-model="formObj.total_vat" type="number"
                                    outlined hide-details @change="onChangeAmountVat" dense></v-text-field></v-col>

                                <v-col class="col-4 py-1 my-auto text-uppercase"
                                  v-if="formObj.currency != 'aed'">{{ formObj.currency }} TO AED</v-col>
                                <v-col class="col-8 py-1" v-if="formObj.currency != 'aed'">
                                  <v-text-field type="number" v-model="formObj.currency_rate" outlined
                                    @change="onChangeCurrencyRate" hide-details dense></v-text-field></v-col>

                                <v-col class="col-4 py-1 my-auto">
                                  <v-text-field v-model="formObj.netamount_title" outlined hide-details dense
                                    placeholder="Auto"></v-text-field>
                                </v-col>
                                <v-col class="col-8 py-1"><v-text-field v-model="formObj.net_amount" outlined
                                    hide-details dense disabled placeholder="Auto"></v-text-field></v-col>


                                <v-col class="col-4 py-1" v-if="formObj.is_advance_payment">
                                  <v-text-field v-model="formObj.special_title_label_1" outlined hide-details dense
                                    label="Title" class="mb-2"></v-text-field> 
                                </v-col>
                                <v-col class="col-8 py-1" v-if="formObj.is_advance_payment">
                                  <v-text-field type="number" @change="onAdvancePayment"  
                                  v-model="advanceAmountPayment"
                                      outlined hide-details dense></v-text-field> 

                                     <div class="hidden" hidden> {{ formObj.special_title_value_1 }}</div>
                                </v-col>
                              </v-row>
                            </v-col>
                          </v-row>

                          <v-row>
                            <v-col class="col-2 py-1 my-auto">AMOUNT IN WORDS</v-col>
                            <v-col class="col-10 py-1"><v-text-field v-model="formObj.amount_in_words" outlined dense
                                hide-details></v-text-field></v-col>
                            <v-col class="col-2 py-1 my-auto">APPROVALS LIMIT FOR PAYMENT</v-col>
                            <v-col class="col-10 py-1"><v-text-field v-model="formObj.approval_limit_payment" outlined
                                dense hide-details></v-text-field></v-col>
                            <v-col class="col-2 py-1 my-auto">COMMENTS</v-col>
                            <v-col class="col-10 py-1"><v-text-field v-model="formObj.remarks_finance" outlined dense
                                hide-details></v-text-field></v-col>

                            <v-col class="col-12"> <v-divider></v-divider> </v-col>
                          </v-row>

                          <v-row>
                            <v-col class="col-12 d-flex">
                              <v-btn small color="secondary" class="mr-4" @click="addItem('approvers')">ADD</v-btn>
                              <h3 class="my-auto"> APPROVAL SETUP</h3>
                            </v-col>
                            <v-col class="col-12 pt-0">
                              <v-simple-table>
                                <template v-slot:default>
                                  <thead>
                                    <tr>
                                      <th width="5%">#</th>
                                      <th width="45%">TITLE</th>
                                      <th width="45%">NAME</th>
                                      <th width="5%"></th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr v-for="(item, index) in approvers" :key="item.id" class="mt-2">
                                      <td>{{ index+ 1 }}</td>
                                      <td>
                                        <div v-if="index == 0">
                                          Prepared By
                                        </div>
                                        <ValidationProvider v-else v-slot="{ errors }" rules="required"
                                          name="Approval Type">
                                          <v-autocomplete :error-messages="errors" :items="approvalType" item-value="id"
                                            item-text="text" v-model="item.approval_type" outlined dense
                                            label="Approval Type*" hide-details></v-autocomplete>
                                        </ValidationProvider>
                                      </td>

                                      <td>
                                        <div v-if="index == 0">
                                          {{ auth.profile.name }}
                                        </div>
                                        <ValidationProvider v-else v-slot="{ errors }" rules="required" name="Approver">
                                          <v-autocomplete :error-messages="errors" @click="fetchActiverUsers"
                                            :items="approverList" v-model="item.user_id" item-value="id"
                                            item-text="name" outlined dense label="Approval*"
                                            hide-details></v-autocomplete>
                                        </ValidationProvider>
                                      </td>

                                      <td>
                                        <div class="row-delete" @click="removeItem(index, 'approver')"><v-icon
                                            color="red" v-if="approvers.length > 1">mdi-trash-can</v-icon> </div>
                                      </td>
                                    </tr>
                                  </tbody>
                                </template>
                              </v-simple-table>
                            </v-col>
                          </v-row>
                          <v-row class="pb-5">
                            <v-col col="12" md="12">
                              <v-btn class="primary" :loading="loadingSubmit" :disabled="!valid" small
                                @click="submit">Submit</v-btn>

                            </v-col>
                          </v-row>
                        </v-card-text>
                      </v-card>
                    </v-col>
                  </v-row>
                </v-form>
              </ValidationObserver>
            </div>
          </v-row>
        </v-card-text>
      </v-card>

            <!-- Viewing / Printing Mode -->
      <v-card flat width="1200" class="mx-auto pb-5 paf-table paf-page" v-else>
        <v-card-title class="no-print bordered">
          <strong class="text-uppercase">STATUS: {{ formObj.status }}</strong>

          <v-btn x-small color="error" class="mx-2" @click="cancelledPAF = true"
            v-if="formObj.status != 'cancelled' && formObj.status != 'closed'">CANCEL PAF</v-btn>
          <v-btn x-small color="warning" class="mx-2" @click="changeStatus('onhold')"
            v-if="formObj.status != 'onhold'">ONHOLD</v-btn>
          <v-btn x-small color="info" class="mx-2" @click="changeStatus('onprocess')"
            v-if="formObj.status != 'onprocess'">ONPROCESS</v-btn>
          <v-btn x-small color="success" class="mx-2" @click="changeStatus('closed')"
            v-if="formObj.status != 'closed'  && formObj.status != 'cancelled'">CLOSED</v-btn>
          <v-btn x-small color="primary" class="mx-2" v-if="formObj.status != 'closed' && formObj.status != 'cancelled' " @click="funcEditForm(true)">EDIT PAF</v-btn>
        </v-card-title>

        <v-card-text class="padding-0">
          <v-row class="mt-5 padding-0 ">
            <div class="col-6 d-flex padding-0 ">
              <img 
                :src="`/file/${formObj.company && formObj.company.images.length > 0 ? formObj.company.images[0].path : 'GAG.png'}`"
                aspect-ratio="1" style="margin-top:-20px; width:180px;">
                <h4 class="ml-3 my-auto">{{ formObj.company ? formObj.company.title : '' }}</h4>
            </div>
            <v-spacer></v-spacer>
            <div class="col-4 padding-0 mt-auto mb-2"> 
              <h4 class="text-right">PAYMENT APPROVAL FORM (PAF)</h4>
              <table border="1" cellspacing="0" cellpadding="0" class="pb-0">
                <tr>
                  <td width="50%" class="pl-2">PAF NO.</td>
                  <td  class="pl-2">{{ formObj.paf_no }}</td>
                </tr>
                <tr>
                  <td  class="pl-2">VOUCHER DATE</td>
                  <td  class="pl-2">{{ formatDateHelper(formObj.created_at) }}</td>
                </tr>
              </table>
            </div>
            <v-col class="col-6 table-50 padding-0">
              <table border="1" cellspacing="0" cellpadding="0" class="pb-0">
                <tr>
                  <th class="text-left pl-2" width="45%">REQUESTED BY</th>
                  <th class="text-left pl-2">{{ formObj.process_by ? formObj.process_by.name : '' }}</th>
                </tr>
                <tr>
                  <th class="text-left pl-2">DEPARTMENT NAME</th>
                  <th class="text-left pl-2">{{ formObj.department_name }}</th>
                </tr>
                <tr>
                  <th class="text-left pl-2">PURCHASE LIMIT</th>
                  <th class="text-left pl-2">{{ formObj.purchase_limit && formObj.purchase_limit > 0 ? formObj.purchase_limit : '' }}</th>
                </tr>
                <tr>
                  <th class="text-left pl-2">DOCUMENT NO. (FOR ACCOUNTS)</th>
                  <th class="text-left pl-2">{{ formObj.document_no_1}}</th>
                </tr> 
              </table>
            </v-col>
            <v-col class="col-6 table-50 padding-0">
              <table border="1" cellspacing="0" cellpadding="0" class="pb-0">
                <tr>
                  <th class="text-left pl-2" width="45%">DEPARTMENT HEAD NAME</th>
                  <th class="text-left pl-2">{{ formObj.department_head }}</th>
                </tr>
                <tr>
                  <th class="text-left pl-2">MODE OF PAYMENT</th>
                  <th class="text-left pl-2">{{ formObj.mode_of_payment }}</th>
                </tr>
                <tr>
                  <th class="text-left pl-2">CASH/CARD LIMIT</th>
                  <th class="text-left pl-2">{{ formObj.cash_card_limit && formObj.cash_card_limit > 0 ? formObj.cash_card_limit : '' }}</th>
                </tr>
                <tr>
                  <th class="text-left pl-2">DOCUMENT NO (FOR ACCOUNTS)</th>
                  <th class="text-left pl-2">{{ formObj.document_no_2 }}</th>
                </tr> 
              </table>
            </v-col>
          </v-row>
          <v-row class="padding-0 mt-1">
            <v-col class="padding-0">
              <table border="1" cellspacing="0" cellpadding="0" class="pb-0 td-vertical-top th-vertical-top">
                <thead>
                  <tr>
                    <th width="5%">SR #</th>
                    <th width="10%">SUPPLIER<br/>NAME</th>
                    <th width="10%">LOCATION</th>
                    <th width="10%">SUPPLIER <br/>INV.NO.</th> 
                    <th width="15%">DESCRIPTION</th>
                    <th width="10%">INVOICE <br/>DATE</th>
                    <th width="5%">QTY</th> 
                    <th width="10%">UNIT <br/>PRICE</th>
                    <th width="10%">TOTAL <br/>AMOUNT</th>
                    <th width="5%">VAT {{ formObj.vat_custom }}%</th>
                    <th width="10%" class="text-uppercase">TOTAL <br/>AMOUNT ({{ formObj.currency }})</th>
                  </tr>
                </thead>
                <tbody v-if="formObj.paf_items">
                  <tr v-for="(item, index) in formObj.paf_items" :key="item.id">
                    <td class="text-center">{{ index+ 1 }}</td>
                    <td class="text-center" v-if="index == 0" :rowspan="formObj.supplier_count > 1 ? '' : formObj.paf_items.length">{{ item.supplier ? item.supplier.title: '' }}</td>
                    <td class="text-center" v-else-if="formObj.supplier_count > 1" >{{ item.supplier ? item.supplier.title: '' }}</td>
                    <td class="text-center">{{ item.location }} </td>
                    <td class="text-center">{{ item.supplier_invoice_num }} </td>
                    <td class="text-left"><pre>{{ item.description ? item.description.trim() : '' }}</pre></td>
                    <td class="text-center">{{ item.invoice_date ? formatDateHelper(item.invoice_date) : '' }}</td>
                    <td class="text-center">{{ item.qty }}</td>
                    <td class="text-center">{{ item.unit_price }}</td>
                    <td class="text-right">{{ Number(item.amount).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") }}</td>
                    <td class="text-center">{{ item.vat == 0.00 || item.vat == 0 ? '' : item.vat }}</td>
                    <td class="text-right">
                      {{
                        Number(item.total_amount).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                      }}
                    </td>
                  </tr> 
                  <tr>
                      <td colspan="6" rowspan="5"><pre>{{ formObj.remarks_general }}</pre></td>
                      <th class="text-right pr-2" colspan="2">SUB TOTAL</th>
                      <td class="text-right">{{ Number(viewSubTotal).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") }}</td>
                      <td class="text-right"></td>
                      <td class="text-right">{{ Number(formObj.total_amount).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") }}</td>
                  </tr>
                  <tr>
                    <th class="text-right pr-2" colspan="2">{{formObj.discount_title}}</th>
                      <td colspan="2" rowspan="4"></td> 
                      <td class="text-right">{{ Number(formObj.discount).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") }}</td> 
                  </tr>
                  <tr>
                    <th class="text-right pr-2" colspan="2">TOTAL VAT ({{ formObj.vat_custom }}%)</th> 
                    <td class="text-right">{{ Number(formObj.total_vat).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") }}</td> 
                  </tr>
                  <tr>
                    <th class="text-right pr-2 text-uppercase" colspan="2">{{ formObj.netamount_title}} ({{ formObj.currency }})</th> 
                    <td class="text-right">{{ Number(formObj.net_amount).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") }}</td> 
                  </tr>
                  <tr v-if="formObj.is_advance_payment">
                    <th class="text-right pr-2" colspan="2">{{ formObj.special_title_label_1 }}</th> 
                    <td class="text-right">{{ Number(formObj.special_title_value_1).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") }}</td> 
                  </tr>
                </tbody>
              </table>
            </v-col>
          </v-row> 
 
          <v-row class="padding-0 mt-1">
            <v-col class="padding-0">
              <table border="1" cellspacing="0" cellpadding="0" class="pb-0">
                <tr>
                  <td width="20%" class="px-2">AMOUNT IN WORDS</td>
                  <td class="px-2 text-capitalize">{{ formObj.amount_in_words }}</td>
                </tr>
                <tr>
                  <td class="px-2">APPROVALS LIMIT FOR PAYMENT</td>
                  <td class="px-2">{{ formObj.approval_limit_payment }}</td>
                </tr>
                <tr>
                  <td class="px-2">COMMENTS</td>
                  <td class="px-2">{{ formObj.remarks_finance }}</td>
                </tr>
                <tr>
                  <td class="px-2">PRF's/LPO'S</td>
                  <td class="px-2"> 
                    <div class="my-0 py-0" v-if="formObj.lpos && formObj.lpos.length > 0">
                      <span v-for="srNum in formObj.lpos" :key="srNum.id">
                        {{ srNum.lpo_no }}
                      </span>
                    </div>
                    <div class="my-0 py-0" v-else-if="formObj.prfs && formObj.prfs.length > 0">
                      <span v-for="srNum in formObj.prfs" :key="srNum.id">
                        {{ srNum.prf_no }}
                      </span>
                    </div>
                  </td>
                </tr>
              </table>
            </v-col>
          </v-row>

          <!--  -->
          <v-row class="padding-0 mt-1">
            <v-col class="col-12 padding-0 justify-center d-flex">
              <div class="mr-5"><v-icon small class="pr-1">mdi-checkbox-blank-outline</v-icon>Budgeted according to policy</div>
              <div><v-icon small class="pr-1">mdi-checkbox-blank-outline</v-icon>Not Budgeted </div>
            </v-col>
          </v-row>
          <!--  -->
          <v-row class="padding-0 mt-1">
            <v-col class="padding-0">
              <v-row>
                <v-col class="col-2" v-for="approval in formObj.paf_approvals" :key="approval.id">
                  <div style=" height:70px;  border:1px solid #000;"></div>
                  <div class="text-center mt-2">
                    <div class="text-capitalize">{{ approval.approval_type.replace("_", " ") }}</div>
                    <div class="text-capitalize">{{ approval.users ? approval.users.profile.name : '' }}</div>
                    {{ approval.users ? approval.users.profile.designation : '' }}
                  </div>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-card-text>

        <v-dialog v-model="cancelledPAF" persistent max-width="290">
          <v-card>
            <v-card-title class="text-h5 pt-4">
              What is your reason?
            </v-card-title>
            <v-card-text class="pb-2 ">
              <v-text-field outlined dense v-model="reasons" hide-details label="Reason?"></v-text-field>
            </v-card-text>
            <v-card-actions class="pb-6 px-6">
              <v-btn color="primary" :loading="loadingSubmit" small @click="cancelledPAF = false">
                CANCEL
              </v-btn>
              <v-btn color="secondary" :loading="loadingSubmit" small @click="changeStatus('cancelled')">
                SUBMIT
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-card>

    </v-container>
    <!-- actions and dialogs -->
    <snack-bar :snackbar-options="sbOptions" class="no-print"></snack-bar>

  </div>
</template>
<script>
import {
  ValidationObserver,
  ValidationProvider,
} from "vee-validate/dist/vee-validate.full";

export default {
  name: "DataForm",
  components: {
    ValidationProvider,
    ValidationObserver,
  },
  props: {
    objectdata: {
      type: Object,
      default: null,
    },
    pagetitle: {
      type: String,
      default: "new",
    },
    newurl: {
      type: String,
      default: "",
    },
    redirectname: {
      type: String,
      default: "",
    },
    redirectedit: {
      type: String,
      default: "",
    },
    redirectnew: {
      type: String,
      default: "",
    },
    headertitle: {
      type: String,
      default: "",
    },

  },
  data() {
    return {
      pageLoading: true,
      isEditEnable: false,
      formEditable: true,
      cancelledPAF: false,
      auth: this.$store.state.authUser.userObject,
      actionSave: this.pagetitle,
      URLadd: this.newurl,
      editRedirect: this.redirectedit,
      cardTitle: this.headertitle,
      reasons: null,

      supplierList: [],
      currencyList: [],
      approverList: [],
      prfList: [],
      LpoList: [],
      isLPOPRF: [{ id: 'prf', title: "PRF" }, { id: 'lpo', title: 'LPO' }],
      viewSubTotal: 0,
      supplier: {},
       
      calcSign: "-", 
      formObj: { 
        is_advance_payment: 0,
        special_title_label_1: null,
        special_title_value_1: null,
        netamount_title: 'Net Amount',
        supplier_count: 1,
        discount: 0,
        currency_rate: 1,
        net_amount: '0.00',
        total_amount: '0.00',
        total_vat: '0.00',
        discount_title: 'Discount',
        relation: 'lpo',
        department_name: 'Procurement',
        department_head: 'Saleh Al Chalabi',
        approval_limit_payment: 'Up to AED 50,000 by Finance Manager, above AED 50,000 to AED 200,000 by Finance Director & all above by CEO & CFO Jointly.',
        currency: 'aed',
        vat_custom: 5,
      },
      advanceAmountPayment:0,
      ObjPrf: [],
      ObjLPO: [],
      ObjSupplier: [],
      ObjItemId: [],
      relationIDs: [],
      ObjShipping: '',
      ObjContactPerson: '', 
      defaultVat: 5,

      // ui  
      sbOptions: {},

      confOptions: {},
      loading: this.objectdata ? true : false,
      loadingSubmit: false,

      // table form
      tableForm: [{ location: '', serial_number: null, supplier_invoice_num: '', invoice_date: null, description: '', qty: 1, vat: 0.00, unit_price: '', amount: 0.00, total_amount: 0.00 }],
      approvers: [{ user_id: this.$store.state.authUser.userObject.id, approval_type: 'prepared_by' }],
      approverRowCount: 2,
      approvalType: [{ id: 'requested_by', text: 'Requested By' }, { id: 'reviewed_by', text: 'Reviewed By' }, { id: 'verified_by', text: 'Verified By' }, { id: 'approved_by', text: 'Approved By' }],

      paymentTerms: [{ id: 1, text: 'Credit' }, { id: 2, text: 'Payment upon delivery' }, { id: 3, text: 'Advance' }],
      paymentMode: [{ id: 1, text: 'Cheque/Bank Transfers' }, { id: 2, text: 'Credit Card' }, { id: 3, text: 'Cash' }],
      filterLoaded: { supplier: false, approver: false, dept: false, editPage: false },
      num:"zero one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen seventeen eighteen nineteen".split(" "),
      tens: "twenty thirty forty fifty sixty seventy eighty ninety".split(" "),
    };
  },
  watch: {
    objectdata: {
      handler(val, oldVal) {
        if (val != oldVal) {
          this.formEditable = false;
          this.formObj = Object.assign({}, val.item);
          this.formObj.requestor = val.item.process_by ? val.item.process_by.name : '';
          this.ObjPrf = val.item.prfs;
          this.ObjLPO = val.item.lpos;

          if(val.item.relation == 'prf'){
            this.ObjItemId = val.item.prfs;
          }else{
            this.ObjItemId = val.item.lpos;
          }

          let selectedSuppliers = [];
          val.item.paf_items.map((o,i) => {
            selectedSuppliers[i] = o.supplier;
          });
          this.ObjSupplier = selectedSuppliers;
          

          this.tableForm = val.item.paf_items; 
          this.tableForm.map((o, i) => {
            this.viewSubTotal  += o.qty * o.unit_price;
          }); 
        
          if(this.formObj.is_advance_payment){
            this.advanceAmountPayment = this.formObj.special_title_value_1;
          }
          this.approvers = val.item.paf_approvals; 
          
        }

        this.loading = false;
      },
      deep: true,
    },
  },
  methods: {
    selectedTypes: function () {
      this.ObjItemId = [];
      this.ObjLPO = [];
      this.ObjPrf = [];
      this.relationIDs = [];
    },

    onChangeItem: function (idx, isItemVat = false) {
      let index = idx;
      let totalAmount = 0;
      let totalVat = 0;

      let isVatItem = isItemVat;
      this.tableForm.map((o, i) => {
        if (isVatItem) {
          if (i == index) {
            if (!o.vat || (o.vat && o.vat < 1)) {
              o.vat = 0;
            }
            o.total_amount = (parseFloat(o.amount) + parseFloat(o.vat)).toFixed(2);
          }
        } else {
          if (i == index) {
            o.amount = (o.qty * parseFloat(o.unit_price)).toFixed(2);
            o.vat = isNaN(o.amount) ? 0 : ((parseFloat(this.formObj.vat_custom) / 100) * o.amount).toFixed(2);
            o.total_amount = (parseFloat(o.amount) + parseFloat(o.vat)).toFixed(2);
          }
        }
        totalVat += parseFloat(o.vat);
        totalAmount += parseFloat(o.total_amount);
      });
    
      if(!isNaN(totalAmount)){
        let nTotal = parseFloat(totalAmount);
        this.formObj.total_amount = nTotal.toFixed(2);
        this.formObj.total_vat = totalVat.toFixed(2);
        this.calculateFunction(totalAmount);
      }
    },

    funcSpecialData: function (e) {
      this.formObj.is_advance_payment = e;
      if (!e) {
        this.formObj.special_title_label_1 = null;
        this.formObj.special_title_value_1 = null;
        this.advanceAmountPayment = null;
        this.onChangeItem(0, true);
      }
    },

    calculateFunction: function (totalAmount, is_custom_vat = false) {

      let subTotal = parseFloat(totalAmount);
      let netAmount = 0.00;

      if (this.calcSign == "-") {
        netAmount = subTotal - parseFloat(this.formObj.discount);
      } else if (this.calcSign == "*") {
        netAmount = parseFloat(subTotal) * parseFloat(this.formObj.discount);
      } else if (this.calcSign == "/") {
        netAmount = subTotal / parseFloat(this.formObj.discount);
      } else if (this.calcSign == "+") {
        netAmount = parseFloat(subTotal) + parseFloat(this.formObj.discount);
      }

      if (is_custom_vat) {
        netAmount = netAmount + parseFloat(this.formObj.total_vat);
      }

      let calcCurrencyRate = parseFloat(this.formObj.currency_rate) * netAmount;

      this.formObj.net_amount = calcCurrencyRate < 0 ? 0.00 : parseFloat(calcCurrencyRate).toFixed(2);
      

      let valAmount = this.formObj.net_amount;
     
      if(this.formObj.is_advance_payment){
        valAmount = this.formObj.special_title_value_1;
      } 
      if(valAmount && !isNaN(valAmount)){ 
        this.amountToWords(valAmount);
      }
    },

    onAdvancePayment: function () { 
      

      let advancePaymentTotal = 0;
     
        advancePaymentTotal =  parseFloat(this.advanceAmountPayment);
      
      this.formObj.special_title_value_1 = advancePaymentTotal > 0 ? advancePaymentTotal.toFixed(2) : advancePaymentTotal;  
      
      this.amountToWords(this.formObj.special_title_value_1);
    }, 

    amountToWords: function(amount){
      let cents = amount.toString().split("."); 
      let withCents = '';
      let amountWords = this.number2words(cents[0]);
        if(cents.length > 1){
          let addZero = "";
            if(cents[1].length == 1){
                addZero = cents[1]+"0";
            }else{
                addZero = String(cents[1]);
                if(addZero.charAt(0) === '0'){ 
                    addZero.substring(1);
                } 
            } 
        
            withCents = this.number2words(Number(addZero)); 
           
            if(withCents !== 'zero'){
              withCents = " And "+withCents;
            }else{
              withCents = '';
            }
        }
        
        this.formObj.amount_in_words = this.capitalizeWords(amountWords + withCents);
    },

    capitalizeWords: function (str) {
      return str
        .toLowerCase()
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    },

    onChangeAmountVat: function () {
      this.calculateFunction(this.formObj.total_amount, true);
    },

    onChangeCurrencyRate: function () {
      if (!this.formObj.currency_rate || this.formObj.currency_rate == null || this.formObj.currency_rate == '' || this.formObj.currency_rate == 0) {
        this.formObj.currency_rate = 1;
      }
      this.calculateFunction(this.formObj.total_amount);
    },
    onChangeDiscount: function () {

      if (!this.formObj.discount || this.formObj.discount == null || this.formObj.discount == '') {
        this.formObj.discount = 0;
      }
      this.calculateFunction(this.formObj.total_amount);
    },

    onChangeVat: function () {
      this.formObj.vat_custom = this.defaultVat;
      this.onChangeItem(0, true);
    },

    addItem: function (v) {
      if (v == 'item') {
        this.tableForm.push({ location: '', serial_number: null, supplier_invoice_num: '', invoice_date: null, description: '', qty: 1, vat: 0.00, unit_price: '', amount: 0.00, total_amount: 0.00 });
      } else {
        this.approvers.push({ user_id: null, approval_type: '' });
      }
    },

    number2words: function (n){
        if (n < 20) return this.num[n];
        var digit = n%10;
        if (n < 100) return this.tens[~~(n/10)-2] + (digit? " " + this.num[digit]: " ");
        if (n < 1000) return this.num[~~(n/100)] +" hundred " + (n%100 == 0? " ": this.number2words(n%100));
        if (n < 1000000) return this.number2words(~~(n/1000)) +" thousand " + (n%1000 == 0? " ": this.number2words(n%1000));
        return this.number2words(~~(n/1000000)) + " million " + (n%1000000 != 0? " " + this.number2words(n%1000000): "");
    },

    removeItem: function (index, type) {
      if (type == 'item') {
        let rows = this.tableForm;
        rows.splice(index, 1)
        this.tableForm = [...rows];

        this.onChangeItem(0, true);
      } else {
        let rows = this.approvers;
        rows.splice(index, 1)
        this.approvers = [...rows];
      }

    },

    funcEditForm: function (v) {
      this.formEditable = v;

      if(v){
        if (!this.filterLoaded.editPage) {
          this.pageLoading = true;
          this.filterLoaded.editPage = true;
            this.fetchLPO().then(() => {
            this.fetchPRF().then(() => {
              this.fetchCurrency();
              this.pageLoading = false;
            });
          });
        }
      }

    },

    changeStatus: function (v) {
      this.loadingSubmit = true;

      this.sbOptions = {
        status: true,
        type: "info",
        text: "Submitting...",
      };

      let postID = this.formObj.id;
      let dataForm = {
        type: v,
        id: postID,
        reason: this.reasons
      };

      // Send data to save
      axios
        .post('/d/admin/payment-approval-form/update-status', dataForm)
        .then((response) => {
          this.sbOptions = {
            status: true,
            type: "success",
            text: response.data.message,
          };
          this.loadingSubmit = false;
          this.cancelledPAF = false;
          this.$emit("saved", true);

        })
        .catch((err) => {
          this.loading = false;
          this.sbOptions = {
            status: true,
            type: "error",
            text: "Error saving data",
          };
        });

    },

    submit: function () {

      this.loadingSubmit = true;

      this.sbOptions = {
        status: true,
        type: "info",
        text: "Submitting...",
      };
      let formItems = this.tableForm.map((o, i) => {
        delete o["id"]; 
        delete o["created_at"];
        delete o["updated_at"]; 
        delete o["supplier"]; 
        return o;
      });

      let formApprover = this.approvers.map((o, i) => {
        delete o["id"];
        delete o["payment_approval_form_id"];
        delete o["created_at"];
        delete o["updated_at"];
        delete o["orders"];
        delete o["users"]; 
        return o;
      });
      this.formObj.supplier_count = this.ObjSupplier.length;
      let mainData = this.formObj;
      delete mainData["requestor"]; 
        

      let dataForm = {
        data: mainData,
        items: formItems,
        approvers: formApprover,
        relations: this.relationIDs
      }; 
      
      if (this.formObj.id) {
        let postID = this.formObj.id;
        
        let bdata = this.formObj;
        delete bdata["created_at"];
        delete bdata["updated_at"];
        delete bdata["user_id"];
        delete bdata["paf_no"];
        delete bdata["requests"];
        delete bdata["supplier"];
        delete bdata["location"];
        delete bdata["paf_approvals"];
        delete bdata["paf_items"];
        delete bdata["id"];
        delete bdata["process_by"]; 
        delete bdata["requestor"]; 
        delete bdata["images"];
        delete bdata["company"];
        delete bdata["lpos"]; 
        delete bdata["prfs"];
        delete bdata["reasons"];  
        dataForm = {
          data: bdata,
          id: postID,
          items: this.tableForm,
          approvers: formApprover,
          relations: this.relationIDs
        };
      }

      // Send data to save
      axios
        .post(this.URLadd, dataForm)
        .then((response) => {
          this.sbOptions = {
            status: true,
            type: "success",
            text: response.data.message,
          };
          if (this.pagetitle == "edit") {
            this.funcEditForm(false);
            this.$emit("saved", true);
            this.loadingSubmit = false;
          } else {
            this.$nextTick(() => {
              setTimeout(() => {
                this.loadingSubmit = false;
                this.$router.push({
                  name: this.editRedirect,
                  params: { id: response.data.id },
                });
              }, 1000);
            });
          }
        })
        .catch((err) => {
          this.loading = false;
          this.sbOptions = {
            status: true,
            type: "error",
            text: "Error saving data",
          };
        });
    },
    selectedPRFLPO: function (v) {
      let relIDs = [];
      if (v == 'lpo') {
        this.ObjItemId = this.ObjLPO;
        this.formObj.company_id = this.ObjLPO[0].company_id;

        this.ObjLPO.map((o,i) => {
          relIDs.push(o.id);
        });
      } else {
        this.ObjItemId = this.ObjPrf;
        this.formObj.company_id = this.ObjPrf[0].company_id;
        this.ObjPrf.map((o,i) => {
          relIDs.push(o.id);
        });
      
      }
      this.relationIDs = relIDs;
     
    },

    fetchPRF: async function () {
      await axios.get('/d/admin/request/fetch-onprocess/pendings').then((response) => {
        this.prfList = response.data;
      });
    },

    fetchLPO: async function () {
      await axios.get('/d/admin/local-purchase-order/fetch-onprocess/pendings').then((response) => {
        this.LpoList = response.data;
      });
    },

    fetchCurrency: async function () {
      await axios.get('/d/admin/fetch/currency/list').then((response) => {
        this.currencyList = response.data;
      })
    },

    fetchSuppliers: async function () {
      if (!this.filterLoaded.supplier) {
        this.filterLoaded.supplier = true;
        await axios.get('/d/admin/fetch/non-paginate/suppliers').then((response) => {
          this.supplierList = response.data;
        });
      }
    },

    fetchActiverUsers: async function () {
      if (!this.filterLoaded.approver) {
        this.filterLoaded.approver = true;
        await axios.get('/d/profile/procurements/profile_users').then((response) => {
          this.approverList = response.data;
        });

      }
    },
  },
  created() {
     
    if (this.pagetitle == 'edit') {
      this.formEditable = false;
      this.pageLoading = false;
    } else {
      this.formObj.requestor = this.auth.profile ? this.auth.profile.name : '';
      
      this.fetchLPO().then(() => {
        this.fetchPRF().then(() => {
          this.fetchCurrency();

          if(this.$route.params && this.$route.params.request_id){
            this.formObj.relation = 'prf';
            this.ObjPrf = this.$route.params.request_id;
          }
          this.pageLoading = false;
        });
      });
    }  

  },
};
</script> 
<style>
 
.overflow-table table{ width: 1130px !important;}
.paf-editable-page th,
.paf-editable-page td {
  padding-left: 5px !important;
  padding-right: 5px !important;
}
table th, table thead th { font-size:11px !important;}
table td,.small {
  font-size: 10px !important;
}

.row-delete {
  display: none;
}

table tr:hover .row-delete {
  display: block;
}

.v-data-table>.v-data-table__wrapper>table>tbody>tr>td {
  padding-top: 10px;
  padding-bottom: 10px;
}
</style>