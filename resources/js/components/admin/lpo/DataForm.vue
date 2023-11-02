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
    <v-container class="py-2 print-container" v-else>

      <!-- Editable Form -->
      <v-card flat maxWidth="1200" class="mx-auto" v-if="formEditable">

        <v-card-title class="no-print bordered">
          <div v-if='pagetitle == "edit"'>
            <v-btn x-small color="primary" class="mx-2" @click="funcEditForm(false)">CANCEL</v-btn>
          </div>
          <small>Suppliers & Company details can be added / updated at Settings section</small>
        </v-card-title>
        <v-card-text>
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
                                <v-col class="my-auto col-4 col-md-4 col-sm-4"> TO </v-col>
                                <v-col class="my-auto col-8 col-md-8 col-sm-8">
                                  <ValidationProvider v-slot="{ errors }" rules="required" name="Supplier">
                                    <v-autocomplete :items="supplierList" @click="fetchSuppliers"
                                      @change="selectedSupplier" autofocus return-object v-model="ObjSupplier"
                                      item-value="id" item-text="title" outlined dense hide-details label="Supplier*"
                                      :error-messages="errors">
                                    </v-autocomplete>
                                  </ValidationProvider>

                                </v-col>
                                <v-col class="my-auto col-4 col-md-4 col-sm-4"> ADDRESS </v-col>
                                <v-col class="my-auto col-8 col-md-8 col-sm-8">
                                  <v-text-field v-model="supplier.address" outlined dense hide-details disabled
                                    label="ADDRESS"></v-text-field>
                                </v-col>
                                <v-col class="my-auto col-4 col-md-4 col-sm-4"> TAX NO. </v-col>
                                <v-col class="my-auto col-8 col-md-8 col-sm-8">
                                  <v-text-field v-model="supplier.tax_no" outlined dense hide-details disabled
                                    label="TAX NO."></v-text-field>
                                </v-col>
                                <v-col class="my-auto col-4 col-md-4 col-sm-4"> CONTACT NO.
                                </v-col>
                                <v-col class="my-auto col-8 col-md-8 col-sm-8">
                                  <v-text-field v-model="supplier.contact_no" outlined dense hide-details disabled
                                    label="CONTACT NO."></v-text-field>
                                </v-col>
                                <v-col class="my-auto col-4 col-md-4 col-sm-4"> LOCATION </v-col>
                                <v-col class="my-auto col-8 col-md-8 col-sm-8">
                                  <v-text-field v-model="ObjPrf.location" outlined dense hide-details disabled
                                    label="LOCATION"></v-text-field>
                                </v-col>
                                <v-col class="my-auto col-4 col-md-4 col-sm-4"> EMAIL </v-col>
                                <v-col class="my-auto col-8 col-md-8 col-sm-8">
                                  <v-text-field v-model="supplier.email" outlined dense hide-details disabled
                                    label="EMAIL"></v-text-field>
                                </v-col>
                              </v-row>
                            </v-col>

                            <!-- Right side column -->
                            <v-col class="col-6 pr-10">
                              <v-row>
                                <v-col class="my-auto col-4 col-md-4 col-sm-4"> LPO NO. </v-col>
                                <v-col class="my-auto col-8 col-md-8 col-sm-8">
                                  <v-text-field outlined dense hide-details disabled v-model="formObj.lpo_no"
                                    placeholder="AUTO GENERATED"></v-text-field>
                                </v-col>

                                <v-col class="my-auto col-4 col-md-4 col-sm-4"> LPO DATE </v-col>
                                <v-col class="my-auto col-8 col-md-8 col-sm-8">
                                  {{ formObj.created_at ? formatDateHelper(formObj.created_at) : formatDateHelper() }}
                                </v-col>

                                <v-col class="my-auto col-4 col-md-4 col-sm-4"> SUPPLIER REF# </v-col>
                                <v-col class="my-auto col-8 col-md-8 col-sm-8">
                                  <v-text-field v-model="formObj.supplier_ref_num" outlined dense hide-details
                                    label="REFERENCE NO."></v-text-field>
                                </v-col>

                                <v-col class="my-auto col-4 col-md-4 col-sm-4"> COMPANY </v-col>
                                <v-col class="my-auto col-8 col-md-8 col-sm-8">
                                  <v-text-field outlined dense hide-details disabled v-model="formObj.company"
                                    label="COMPANY"></v-text-field>
                                </v-col>

                                <v-col class="my-auto col-4 col-md-4 col-sm-4"> PRF NO. * </v-col>
                                <v-col class="my-auto col-5 col-md-5 col-sm-5">
                                  <ValidationProvider v-slot="{ errors }" rules="required" name="Request Number">
                                    <v-autocomplete :items="prfList" v-model="ObjPrf" @change="selectedPRF"
                                      return-object item-value="id" item-text="prf_no" :error-messages="errors" outlined
                                      dense hide-details label="PRF NO*"></v-autocomplete>
                                  </ValidationProvider>
                                </v-col>
                                <v-col class="my-auto col-3 col-md-3 col-sm-3">
                                  <v-text-field v-model="formObj.prf_extension" outlined dense hide-details
                                    label="PRF EXT.(OPTIONAL)"></v-text-field>
                                </v-col>

                                <v-col class="my-auto col-4 col-md-4 col-sm-4"> TOTAL AMOUNT </v-col>
                                <v-col class="my-auto col-8 col-md-8 col-sm-8">
                                  <v-text-field outlined dense hide-details disabled v-model="totalAmountLabel"
                                    label="TOTAL AMOUNT"></v-text-field>
                                </v-col>
                              </v-row>
                            </v-col>
                          </v-row>
                          <v-row>
                            <v-col class="col-12"> <v-divider></v-divider></v-col>
                          </v-row>
ssssss
                          <v-row class="page-break">
                            <v-col class="col-12">
                              <div class="d-flex">
                                <v-btn dense color="secondary" class="mx-2 my-auto" small
                                  @click="addItem('item')">ADD</v-btn>
                                <v-autocomplete outlined dense v-model="formObj.currency" :items="currencyList"
                                  class="mx-2 col-3 col-md-2" hide-details label="Currency" item-value="value"
                                  item-text="title"></v-autocomplete>
                                <v-text-field type="number" @change="onChangeVat" v-model="defaultVat" outlined dense
                                  label="% VAT" hide-details class="mx-2 col-3 col-md-1"></v-text-field>
                                <ValidationProvider v-slot="{ errors }" rules="required" name="Department"
                                  class="mx-2 col-3 col-md-3 pa-0">
                                  <v-autocomplete :error-messages="errors" :items="departmentList"
                                    @click="fetchDepartment" v-model="formObj.department_id" item-value="id"
                                    item-text="title" outlined dense label="Department" hide-details></v-autocomplete>
                                </ValidationProvider>
                              </div>
                            </v-col>
                          </v-row>

                          <v-row class="page-break">
                            <v-col class="col-12">
                              <v-simple-table>
                                <template v-slot:default>
                                  <thead>
                                    <tr>
                                      <th width="15%">CATEGORY</th>
                                      <th width="15%">ITEM</th>
                                      <th width="20%">SPECIFICATION</th>
                                      <th width="10%">QTY</th>
                                      <th width="10%">UOM</th>
                                      <th width="13%">UNIT PRICE</th>
                                      <th width="12%">AMOUNT</th>
                                      <th width="5%"></th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr v-for="(item, index) in tableForm" :key="item.id" class="mt-2">
                                      <td><v-autocomplete :items="categoryList" item-value="id" item-text="title"
                                          v-model="item.category_id" outlined dense label="CATEGORY"
                                          hide-details></v-autocomplete></td>
                                      <td>
                                        <ValidationProvider v-slot="{ errors }" rules="required" name="ITEM">
                                          <v-text-field :error-messages="errors" v-model="item.item" outlined dense
                                            label="ITEM*" hide-details></v-text-field>
                                        </ValidationProvider>
                                      </td>
                                      <td><v-textarea v-model="item.specification" outlined dense rows="2"
                                          label="SPECIFICATION*" hide-details></v-textarea></td>
                                      <td>
                                        <ValidationProvider v-slot="{ errors }" rules="required" name="Qty">
                                          <v-text-field @change="onChangeItem(index)" :error-messages="errors"
                                            v-model="item.qty" type="number" outlined dense label="QTY*"
                                            hide-details></v-text-field>
                                        </ValidationProvider>
                                      </td>
                                      <td><v-text-field v-model="item.uom" outlined dense label="UOM"
                                          hide-details></v-text-field></td>
                                      <td>
                                        <ValidationProvider v-slot="{ errors }" rules="required" name="Unit Price">
                                          <v-text-field @change="onChangeItem(index)" :error-messages="errors"
                                            v-model="item.unit_price" type="number" outlined dense label="UNIT PRICE*"
                                            hide-details></v-text-field>
                                        </ValidationProvider>
                                      </td>
                                      <td><v-text-field v-model="item.total_amount" outlined dense hide-details
                                          disabled></v-text-field></td>
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
                          <v-row class="page-break">
                            <v-col class="col-12 col-md-8">
                              <v-textarea rows="8" class="col-11" v-model="formObj.remarks_general" outlined
                                hide-details label="Remarks"></v-textarea>
                            </v-col>
                            <v-col class="col-12 col-md-4">
                              <div class="d-flex mb-4">
                                <v-checkbox label="Licenses?" @change="funcLicense" dense class="ma-0 pt-0"
                                  v-model="formObj.is_license" hide-details></v-checkbox>
                                <span class="my-auto red--text ml-2"> Be sure to uncheck if not for Licenses!</span>
                              </div>

                              <v-row>
                                <v-col class="col-4 py-1">Total</v-col>
                                <v-col class="col-8 py-1"><v-text-field v-model="formObj.total_amount" outlined
                                    hide-details dense disabled label="Total"></v-text-field></v-col>

                                <v-col class="col-4 py-1" v-if="isLicense"><v-text-field outlined hide-details dense
                                    v-model="formObj.license_title_label_1"
                                    label="Ex. From Oct 2021"></v-text-field></v-col>
                                <v-col class="col-8 py-1" v-if="isLicense"><v-text-field type="number" outlined
                                    @change="onChangeLicenseValue" v-model="formObj.license_title_value_1" hide-details
                                    dense></v-text-field></v-col>

                                <v-col class="col-4 py-1" v-if="isLicense"><v-text-field outlined hide-details dense
                                    label="Ex. Total Until Aug 2022"
                                    v-model="formObj.license_title_label_2"></v-text-field></v-col>
                                <v-col class="col-8 py-1" v-if="isLicense"><v-text-field outlined hide-details dense
                                    v-model="formObj.license_title_value_2" placeholder="Auto"
                                    disabled></v-text-field></v-col>

                                <v-col class="col-4 py-1">Discount</v-col>
                                <v-col class="col-8 py-1"><v-text-field type="number" @change="onChangeDiscount"
                                    v-model="ObjDiscount" label="Discount" outlined hide-details
                                    dense></v-text-field></v-col>

                                <v-col class="col-4 py-1">5% VAT</v-col>
                                <v-col class="col-8 py-1"><v-text-field @change="onChangeAmountVat"
                                    v-model="formObj.vat" type="number" outlined hide-details
                                    dense></v-text-field></v-col>

                                <v-col class="col-4 py-1">Net Amount</v-col>
                                <v-col class="col-8 py-1"><v-text-field v-model="formObj.net_amount" outlined
                                    hide-details dense disabled placeholder="Auto"></v-text-field></v-col>
                              </v-row>
                            </v-col>
                          </v-row>

                          <v-row class="page-break">
                            <v-col class="col-4 bordered">
                              <h4>PAYMENT TERMS*</h4>
                              <ValidationProvider v-slot="{ errors }" rules="required" name="Payment Terms">
                                <v-radio-group :error-messages="errors" v-model="formObj.payment_terms">
                                  <v-radio v-for="(pt, idx) in paymentTerms" :key="idx" :label="pt.text"
                                    :value="pt.id"></v-radio>
                                </v-radio-group>
                              </ValidationProvider>
                            </v-col>
                            <v-col class="col-4 bordered">
                              <h4>PAYMENT MODE*</h4>
                              <ValidationProvider v-slot="{ errors }" rules="required" name="Payment Mode">
                                <v-radio-group :error-messages="errors" v-model="formObj.payment_mode">
                                  <v-radio v-for="(pm, idx) in paymentMode" :key="idx" :label="pm.text"
                                    :value="pm.id"></v-radio>
                                </v-radio-group>
                              </ValidationProvider>
                            </v-col>
                            <v-col class="col-4 bordered">
                              <h4>DELIVERY TERMS</h4>
                              <v-textarea v-model="formObj.delivery_terms" class="mt-2" rows="5" outlined
                                hide-details></v-textarea>
                            </v-col>
                          </v-row>

                          <v-row class="py-3 page-break">
                            <v-col class="col-12 col-md-6 bordered">
                              <v-row class="pb-3">
                                <v-col class="col-12">
                                  <h3>BILLING DETAILS*</h3>
                                  <v-divider></v-divider>
                                </v-col>

                                <v-col class="col-4 py-1">COMPANY</v-col>
                                <v-col class="col-8 py-1">
                                  <ValidationProvider v-slot="{ errors }" rules="required" name="Business Unit">
                                    <v-autocomplete @change="businessChange('billing')" v-model="ObjBilling"
                                      :items="companyList" return-object dense outlined item-value="id"
                                      item-text="title" label="Business Unit*" hide-details></v-autocomplete>
                                  </ValidationProvider>
                                </v-col>
                                <v-col class="col-4 py-1">TAX NO.</v-col>
                                <v-col class="col-8 py-1"><v-text-field v-model="ObjBilling.tax_no" placeholder="auto"
                                    dense outlined hide-details disabled></v-text-field></v-col>
                                <v-col class="col-4 py-1">CONTACT PERSON</v-col>
                                <v-col class="col-8 py-1"><v-text-field v-model="ObjBilling.contact_person"
                                    placeholder="auto" dense outlined hide-details disabled></v-text-field></v-col>
                                <v-col class="col-4 py-1">ADDRESS</v-col>
                                <v-col class="col-8 py-1"><v-text-field v-model="ObjBilling.address" placeholder="auto"
                                    dense outlined hide-details disabled></v-text-field></v-col>
                                <v-col class="col-4 py-1">CONTACT NO.</v-col>
                                <v-col class="col-8 py-1"><v-text-field v-model="ObjBilling.contact_no"
                                    placeholder="auto" dense outlined hide-details disabled></v-text-field></v-col>
                                <v-col class="col-4 py-1">EMAIL</v-col>
                                <v-col class="col-8 py-1"><v-text-field v-model="ObjBilling.email" placeholder="auto"
                                    dense outlined hide-details disabled></v-text-field></v-col>
                              </v-row>
                            </v-col>
                            <v-col class="col-12 col-md-6 bordered">
                              <v-row class="pb-3">
                                <v-col class="col-12">
                                  <h3>SHIPPING DETAILS*</h3>
                                  <v-divider></v-divider>
                                </v-col>
                                <v-col class="col-4 py-1">COMPANY</v-col>
                                <v-col class="col-8 py-1">
                                  <ValidationProvider v-slot="{ errors }" rules="required" name="Business Unit">
                                    <v-autocomplete @change="businessChange('shipping')" v-model="ObjShipping"
                                      :items="companyList" dense outlined return-object item-value="id"
                                      item-text="title" label="Business Unit*" hide-details></v-autocomplete>
                                  </ValidationProvider>
                                </v-col>
                                <v-col class="col-4 py-1">TAX NO.</v-col>
                                <v-col class="col-8 py-1"><v-text-field v-model="ObjShipping.tax_no" placeholder="auto"
                                    dense outlined hide-details disabled></v-text-field></v-col>
                                <v-col class="col-4 py-1">CONTACT PERSON</v-col>
                                <v-col class="col-8 py-1">
                                  <ValidationProvider v-slot="{ errors }" rules="required" name="Contact Person">
                                    <v-autocomplete :error-messages="errors" @click="fetchActiverUsers"
                                      @change="selectedContactPerson" return-object :items="approverList"
                                      v-model="ObjContactPerson" item-value="user_id" item-text="name" label="Contact Person"
                                      dense outlined hide-details></v-autocomplete>
                                  </ValidationProvider>
                                </v-col>
                                <v-col class="col-4 py-1">ADDRESS</v-col>
                                <v-col class="col-8 py-1"><v-text-field v-model="ObjShipping.address" placeholder="auto"
                                    dense outlined hide-details disabled></v-text-field></v-col>
                                <v-col class="col-4 py-1">CONTACT NO.</v-col>
                                <v-col class="col-8 py-1"><v-text-field v-model="ObjShipping.contact_no"
                                    placeholder="auto" dense outlined hide-details disabled></v-text-field></v-col>
                                <v-col class="col-4 py-1">EMAIL</v-col>
                                <v-col class="col-8 py-1"><v-text-field v-model="ObjContactPerson.email"
                                    placeholder="auto" dense outlined hide-details disabled></v-text-field></v-col>
                              </v-row>
                            </v-col>
                          </v-row>

                          <v-row class="page-break">
                            <v-col class="col-2 py-1 my-auto">REMARKS</v-col>
                            <v-col class="col-10 py-1"><v-text-field v-model="formObj.remarks_optional" outlined dense
                                hide-details></v-text-field></v-col>
                            <v-col class="col-2 py-1 my-auto">FINANCE REMARKS</v-col>
                            <v-col class="col-10 py-1"></v-col>
                            <v-col class="col-2 py-1 my-auto">* PAYMENT TERMS</v-col>
                            <v-col class="col-10 py-1"><v-text-field v-model="formObj.remarks_payment_terms" outlined
                                dense hide-details></v-text-field></v-col>

                            <v-col class="col-12"> <v-divider></v-divider> </v-col>
                          </v-row>

                          <v-row class="page-break">
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
                                            :items="approverList" v-model="item.user_id" item-value="user_id"
                                            item-text="name" outlined dense label="Approval*"
                                            hide-details></v-autocomplete>
                                        </ValidationProvider>
                                      </td>

                                      <td>
                                        <div v-if="index > 0" class="row-delete" @click="removeItem(index, 'approver')"><v-icon
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
      <v-card flat maxWidth="1200" class="mx-auto pb-5" v-else>
        <v-card-title class="no-print bordered">
          <strong class="text-uppercase">STATUS: {{ formObj.status }}</strong>

          <v-btn x-small color="error" class="mx-2" @click="cancelledLPO = true"
            v-if="formObj.status != 'cancelled' && formObj.status != 'closed'">CANCEL LPO</v-btn>
          <v-btn x-small color="warning" class="mx-2" @click="changeStatus('onhold')"
            v-if="formObj.status != 'onhold'">ONHOLD</v-btn>
          <v-btn x-small color="info" class="mx-2" @click="changeStatus('onprocess')"
            v-if="formObj.status != 'onprocess'">ONPROCESS</v-btn>
          <v-btn x-small color="success" class="mx-2" @click="changeStatus('closed')"
            v-if="formObj.status != 'closed'  && formObj.status != 'cancelled'">CLOSED</v-btn>
          <v-btn x-small color="primary" class="mx-2" v-if="formObj.status != 'closed' && formObj.status != 'cancelled' " @click="funcEditForm(true)">EDIT LPO</v-btn>
        <v-col class="col-12 col-md-12 ma-0 px-0 pt-1 pb-0" v-if="formObj.status == 'cancelled'">
          <v-divider></v-divider>
          <small>REASON: {{ formObj.reasons }}</small></v-col>
        </v-card-title>

        <v-card-text class="padding-0">
          <v-row class="mt-5 padding-0 ">
            <div class="col-3 ">
              <img class="logo"
                :src="`/file/${formObj.requests && formObj.requests.company.images.length > 0 ? formObj.requests.company.images[0].path : 'GAG.png'}`"
                aspect-ratio="1" style="margin-top:-20px;">
            </div>
            <div class="col-8 company-title">
              <h1 class="mb-3">{{ formObj.company }}</h1>
              <h2>LOCAL PURCHASE ORDER (LPO)</h2>
            </div>
            <v-col class="col-6   padding-0"  >
              <table border="1" cellspacing="0" cellpadding="0" class="pb-0">
                <tr>
                  <th class="text-left pl-2">TO</th>
                  <th class="text-left pl-2">{{ formObj.supplier ? formObj.supplier.title : '' }}</th>
                </tr>
                <tr>
                  <th class="text-left pl-2">ADDRESS</th>
                  <th class="text-left pl-2">{{ formObj.supplier ? formObj.supplier.address : '' }}</th>
                </tr>
                <tr>
                  <th class="text-left pl-2">TAX NO.</th>
                  <th class="text-left pl-2">{{ formObj.supplier ? formObj.supplier.tax_no : '' }}</th>
                </tr>
                <tr>
                  <th class="text-left pl-2">CONTACT NO.</th>
                  <th class="text-left pl-2">{{ formObj.supplier ? formObj.supplier.contact_no : '' }}</th>
                </tr>
                <tr>
                  <th class="text-left pl-2">STORE NAME</th>
                  <th class="text-left pl-2">{{ formObj.location ? formObj.location.title : '' }}</th>
                </tr>
                <tr>
                  <th class="text-left pl-2">EMAIL</th>
                  <th class="text-left pl-2">{{ formObj.supplier ? formObj.supplier.email : '' }}</th>
                </tr>
              </table>
            </v-col>
            <v-col class="col-6  padding-0" >
              <table border="1" cellspacing="0"   cellpadding="0" class="pb-0">
                <tr>
                  <th class="text-left pl-2">LPO</th>
                  <th class="text-left pl-2">{{ formObj.lpo_no }}</th>
                </tr>
                <tr>
                  <th class="text-left pl-2">LPO DATE</th>
                  <th class="text-left pl-2">{{ formatDateHelper(formObj.created_at) }}</th>
                </tr>
                <tr>
                  <th class="text-left pl-2">SUPPLIER REFERENCE #</th>
                  <th class="text-left pl-2">{{ formObj.supplier_ref_num }}</th>
                </tr>
                <tr>
                  <th class="text-left pl-2">DEPARTMENT</th>
                  <th class="text-left pl-2">{{ formObj.company }}</th>
                </tr>
                <tr>
                  <th class="text-left pl-2">PRF NO.</th>
                  <th class="text-left pl-2">{{ formObj.requests ? formObj.requests.prf_no : '' }}<span
                      v-if="formObj.prf_extension">-{{ formObj.prf_extension }}</span></th>
                </tr>
                <tr>
                  <th class="text-left pl-2">TOTAL AMOUNT</th>
                  <th class="text-right pr-2">{{
                    Number(formObj.net_amount) ?
                    Number(formObj.net_amount).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : '0.00'
                  }}</th>
                </tr>
              </table>
            </v-col>
          </v-row>
          <v-row class="padding-0 mt-1">
            <v-col class="padding-0">
              <table border="1" cellspacing="0" cellpadding="0" class="pb-0 td-vertical-top">
                <thead>
                  <tr>
                    <th width="5%">S/N</th>
                    <th width="15%">ITEM</th>
                    <th width="40%">SPECIFICATIONS</th>
                    <th width="5%">QTY</th>
                    <th width="5%">UOM</th>
                    <th width="15%">UNIT PRICE</th>
                    <th width="15%" class="text-uppercase">AMOUNT IN {{ formObj.currency }}</th>
                  </tr>
                </thead>
                <tbody v-if="formObj.lpo_items">
                  <tr v-for="(item, index) in formObj.lpo_items" :key="item.id">
                    <td class="text-center align">{{ index+ 1 }}</td>
                    <td class="text-center">{{ item.item }}</td>
                    <td class="text-left pl-2">
                      <pre>{{ item.specification ? item.specification.trim() : '' }}</pre>
                    </td>
                    <td class="text-center">{{ item.qty }}</td>
                    <td class="text-center">{{ item.uom }}</td>
                    <td class="text-right">{{ item.unit_price }}</td>
                    <td class="text-right">{{
                      Number(item.unit_price *
                        item.qty).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }}</td>
                  </tr>
                </tbody>
              </table>
            </v-col>
          </v-row>

          <v-row class="padding-0 mt-1">
            <v-col class="padding-0">
              <table border="1" cellspacing="0" cellpadding="0" class="pb-0 td-vertical-top">
                <tr>
                  <td width="70%"><pre>{{ formObj.remarks_general }}</pre></td>
                  <td width="30%" class="pa-0 ma-0 border-0">
                    <table border="1" cellspacing="0" cellpadding="0" class="pb-0">
                      <tr>
                        <td class="text-right">TOTAL</td>
                        <td class="text-right">{{
                          Number(formObj.total_amount).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                        }}</td>
                      </tr>
                      <tr v-if="formObj.is_license">
                        <td class="text-right">{{ formObj.license_title_label_1 }}</td>
                        <td class="text-right">{{ formObj.license_title_value_1 }}</td>
                      </tr>
                      <tr v-if="formObj.is_license">
                        <td class="text-right">{{ formObj.license_title_label_2 }}</td>
                        <td class="text-right">{{ formObj.license_title_value_2 }}</td>
                      </tr>
                      <tr>
                        <td class="text-right">DISCOUNT</td>
                        <td class="text-right">{{
                          Number(formObj.discount).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                        }}</td>
                      </tr>
                      <tr>
                        <td class="text-right">{{ formObj.vat_custom }}% VAT </td>
                        <td class="text-right">{{
                          Number(formObj.vat).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                        }}</td>
                      </tr>
                      <tr>
                        <td class="text-right text-uppercase">NET AMOUNT ({{ formObj.currency }})</td>
                        <td class="text-right">{{
                          Number(formObj.net_amount) ?
                          Number(formObj.net_amount).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") :
                          '0.00'
                        }}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </v-col>
          </v-row>

          <v-row class="padding-0 mt-1">
            <v-col class="padding-0">
              <table border="1" cellspacing="0" cellpadding="0" class="pb-0 td-vertical-top">
                <tr>
                  <td class="pa-3">
                    <h4 class="mb-2">PAYMENT TERMS</h4>
                    <div v-for="(pt, idx) in paymentTerms" :key="idx">
                      <v-icon color="primary">
                        {{ pt.id == formObj.payment_terms ? 'mdi-checkbox-marked' : 'mdi-checkbox-blank-outline' }}
                      </v-icon>
                      {{ pt.text }}
                    </div>
                  </td>
                  <td class="pa-3">
                    <h4 class="mb-1">PAYMENT MODE</h4>
                    <div v-for="(pt, idx) in paymentMode" :key="idx">
                      <v-icon color="primary">
                        {{ pt.id == formObj.payment_mode ? 'mdi-checkbox-marked' : 'mdi-checkbox-blank-outline' }}
                      </v-icon>
                      {{ pt.text }}
                    </div>

                  </td>
                  <td class="pa-3">
                    <h4 class="mb-2">DELIVERY TERMS</h4>
                    {{ formObj.delivery_terms }}
                  </td>
                </tr>
              </table>
            </v-col>
          </v-row>
          <v-row class="padding-0 mt-1">
            <v-col class="col-6  padding-0">
              <table border="1" cellspacing="0" cellpadding="0" class="pb-0">
                <tr>
                  <td colspan="2" class="text-left pl-2">BILLING DETAILS:</td>
                </tr>
                <tr>
                  <th class="text-left pl-2">COMPANY</th>
                  <th class="text-left pl-2">{{ formObj.billing ? formObj.billing.title : '' }}</th>
                </tr>
                <tr>
                  <th class="text-left pl-2">TAX NO.</th>
                  <th class="text-left pl-2">{{ formObj.billing ? formObj.billing.tax_no : '' }}</th>
                </tr>
                <tr>
                  <th class="text-left pl-2">CONTACT PERSON</th>
                  <th class="text-left pl-2">{{ formObj.billing ? formObj.billing.contact_no : '' }}</th>
                </tr>
                <tr>
                  <th class="text-left pl-2">ADDRESS</th>
                  <th class="text-left pl-2">{{ formObj.billing ? formObj.billing.address : '' }}</th>
                </tr>
                <tr>
                  <th class="text-left pl-2">CONTACT NO.</th>
                  <th class="text-left pl-2">{{ formObj.billing ? formObj.billing.contact_no : '' }}</th>
                </tr>
                <tr>
                  <th class="text-left pl-2">EMAIL</th>
                  <th class="text-left pl-2">{{ formObj.billing ? formObj.billing.email : '' }}</th>
                </tr>
              </table>
            </v-col>
            <v-col class="col-6  padding-0">
              <table border="1" cellspacing="0" cellpadding="0" class="pb-0">
                <tr>
                  <td colspan="2" class="text-left pl-2">SHIPPING DETAILS:</td>
                </tr>
                <tr>
                  <th class="text-left pl-2">COMPANY</th>
                  <th class="text-left pl-2">{{ formObj.billing ? formObj.billing.title : '' }}</th>
                </tr>
                <tr>
                  <th class="text-left pl-2">TAX NO.</th>
                  <th class="text-left pl-2">{{ formObj.billing ? formObj.billing.tax_no : '' }}</th>
                </tr>
                <tr>
                  <th class="text-left pl-2">CONTACT PERSON</th>
                  <th class="text-left pl-2">{{
                    formObj.contact_person && formObj.contact_person.profile ? formObj.contact_person.profile.name : ''
                  }}</th>
                </tr>
                <tr>
                  <th class="text-left pl-2">ADDRESS</th>
                  <th class="text-left pl-2">{{ formObj.billing ? formObj.billing.address : '' }}</th>
                </tr>
                <tr>
                  <th class="text-left pl-2">CONTACT NO.</th>
                  <th class="text-left pl-2">{{ formObj.billing ? formObj.billing.contact_no : '' }}</th>
                </tr>
                <tr>
                  <th class="text-left pl-2">EMAIL</th>
                  <th class="text-left pl-2">{{ formObj.contact_person ? formObj.contact_person.email : '' }}</th>
                </tr>
              </table>
            </v-col>
          </v-row>
          <v-row class="padding-0 mt-1">
            <v-col class="padding-0">
              <table border="1" cellspacing="0" cellpadding="2" class="pb-0">
                <tr>
                  <td width="13.5%" class="px-2">REMARKS:</td>
                  <td class="px-2">{{ formObj.remarks_optional }}</td>
                </tr>
                <tr>
                  <td class="px-2">FINANCE REMARKS:</td>
                  <td></td>
                </tr>
                <tr>
                  <td class="px-2">* PAYMENT TERMS:</td>
                  <td class="px-2">{{ formObj.remarks_payment_terms }}</td>
                </tr>
              </table>
            </v-col>
          </v-row>
          <v-row class="padding-0 mt-1" style="width:100%;">
            <v-col class="padding-0 ml-1">
              <v-row>
                <div style="width:15.5%; margin:0 0 0 10px;" v-for="approval in formObj.lpo_approvals" :key="approval.id">
                  <div style=" height:70px;  border:1px solid #000;"></div>
                  <div class="text-center mt-2">
                    <h4 class="text-capitalize py-0 my-0">{{ approval.approval_type ? approval.approval_type.replace("_", " ") : '-' }}</h4>
                    <h4 class="text-capitalize py-0 my-0">{{ approval.users ? approval.users.profile.name : '' }}</h4>
                    <h4 class="py-0 my-0">{{ approval.users ? approval.users.profile.designation : '' }}</h4>
                  </div>
                </div>
              </v-row>
            </v-col>
          </v-row>
        </v-card-text>

        <v-dialog v-model="cancelledLPO" persistent max-width="290">
          <v-card>
            <v-card-title class="text-h5 pt-4">
              What is your reason?
            </v-card-title>
            <v-card-text class="pb-2 ">
              <v-text-field outlined dense v-model="reasons" hide-details label="Reason?"></v-text-field>
            </v-card-text>
            <v-card-actions class="pb-6 px-6">
              <v-btn color="primary" :loading="loadingSubmit" small @click="cancelledLPO = false">
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
      cancelledLPO: false,
      auth: this.$store.state.authUser.userObject,
      actionSave: this.pagetitle,
      URLadd: this.newurl,
      editRedirect: this.redirectedit,
      cardTitle: this.headertitle,
      reasons: null, 
      currencyList: [], 
      categoryList: [], 
      prfList: [],
      supplier: {},
      totalAmountLabel: 0.00,
      formObj: {
        currency: 'aed', is_license: 0, company_id: 0, contact_person: 0,
        supplier_ref_num: null, remarks_general: '', department_id: null,
        discount: 0.00, net_amount: 0.00, vat: 0.00,
        vat_custom: 5, license_title_label_1: null, license_title_label_2: null,
        license_title_value_1: null, license_title_value_2: null, delivery_terms: null,
        prf_extension: null, status: 'onprocess', remarks_optional: null,
        remarks_finance: null, remarks_payment_terms: null, total_amount: 0.00, payment_mode: null,
        payment_terms: null
      },
      ObjPrf: '',
      ObjSupplier: '',
      ObjBilling: '',
      ObjShipping: '',
      ObjContactPerson: '',
      ObjDiscount: 0.00,
      defaultVat: 5,
      ObjCodes: {},
      // ui  
      sbOptions: {},

      confOptions: {},
      loading: this.objectdata ? true : false,
      loadingSubmit: false,

      // table form
      tableForm: [{ category_id: null, item: '', specification: '', qty: '', uom: '', unit_price: '', total_amount: 0 }],
      approvers: [{ user_id: this.$store.state.authUser.userObject.id, approval_type: 'prepared_by' }],
      approverRowCount: 2,
      approvalType: [{ id: 'requested_by', text: 'Requested By' }, { id: 'reviewed_by', text: 'Reviewed By' }, { id: 'verified_by', text: 'Verified By' }, { id: 'approved_by', text: 'Approved By' }],
      isLicense: false,
      paymentTerms: [{ id: 1, text: 'Credit' }, { id: 2, text: 'Payment upon delivery' }, { id: 3, text: 'Advance' }],
      paymentMode: [{ id: 1, text: 'Cheque/Bank Transfers' }, { id: 2, text: 'Credit Card' }, { id: 3, text: 'Cash' }],
      filterLoaded: { supplier: false, approver: false, dept: false },
    };
  },
  watch: {
    objectdata: {
      handler(val, oldVal) {
        if (val != oldVal) {
          this.formEditable = false;
          this.formObj = Object.assign({}, val.item);
          this.isLicense = val.item.is_license;
          this.totalAmountLabel = val.item.net_amount;
          this.ObjSupplier = val.item.supplier;
          this.supplier = {
            address: val.item.supplier.address,
            tax_no: val.item.supplier.tax_no,
            contact_no: val.item.supplier.contact_no,
            email: val.item.supplier.email
          };

          this.ObjPrf = val.item.requests;
          this.ObjPrf.location = val.item.location.title;
          this.ObjDiscount = val.item.discount;
          this.tableForm = val.item.lpo_items;

          this.tableForm.map((o, i) => {
            o.total_amount = o.qty * o.unit_price;
          });

          this.approvers = val.item.lpo_approvals;

          this.ObjBilling = val.item.billing;
          this.ObjShipping = val.item.billing;
          this.ObjContactPerson = val.item.contact_person;
        }

        this.loading = false;
      },
      deep: true,
    },
  },
  computed: {
    companyList() {
      return this.$store.state.companies.companyList;
    },

    approverList() {
      return this.$store.state.profiles.profileList;
    },
    supplierList() {
      return this.$store.state.suppliers.supplierList;
    },
    departmentList() {
      return this.$store.state.departments.departmentList;
    },
  },
  methods: {
    onChangeItem: function (idx, isDiscount = false) {
      let index = idx;
      let totalAmount = 0;
      let dsCnt = isDiscount;
      this.tableForm.map((o, i) => {
        if (dsCnt) {
          o.total_amount = o.qty * o.unit_price;
        } else {
          if (i == index) {
            o.total_amount = o.qty * o.unit_price;
          }
        }
        totalAmount += o.total_amount;
      });
      let nTotal = parseFloat(totalAmount);
      this.formObj.total_amount = nTotal.toFixed(2);
      if (this.isLicense) {
        this.onChangeLicenseValue();
      } else {
        this.calculateFunction(totalAmount);
      }
    },

    onChangeAmountVat: function () {
      let nTotal = 0;
      if (this.isLicense) {
        nTotal = parseFloat(this.formObj.license_title_value_2);
      } else {
        nTotal = parseFloat(this.formObj.total_amount);
      }
      if (!this.formObj.vat || this.formObj.vat == null || this.formObj.vat == '') {
        this.formObj.vat = 0;
      }
      this.formObj.net_amount = (nTotal + parseFloat(this.formObj.vat) - parseFloat(this.ObjDiscount)).toFixed(2);
      this.totalAmountLabel = this.formObj.net_amount;
    },

    onChangeLicenseValue: function () {
      let nTotal = parseFloat(this.formObj.total_amount);
      this.formObj.license_title_value_2 = nTotal * parseFloat(this.formObj.license_title_value_1);

      this.calculateFunction(this.formObj.license_title_value_2);
    },

    calculateFunction: function (totalAmount) {
      let nVat = parseFloat(this.defaultVat) / 100;
      let nTotal = parseFloat(totalAmount);

      let vat = (nTotal - parseFloat(this.ObjDiscount)) * nVat;
      this.formObj.vat = vat < 0 ? 0.00 : vat.toFixed(2);
      let netAmount = (nTotal + vat - parseFloat(this.ObjDiscount)).toFixed(2);
      this.formObj.net_amount = netAmount < 0 ? 0.00 : netAmount;
      this.totalAmountLabel = netAmount < 0 ? 0.00 : netAmount;
    },

    onChangeDiscount: function () {
      if (!this.ObjDiscount || this.ObjDiscount == null || this.ObjDiscount == '') {
        this.ObjDiscount = 0;
      }

      this.onChangeItem(0, true);
    },

    businessChange: function (v) {
      if (v == 'billing') {
        this.formObj.billing_details_id = this.ObjBilling.id;
      } else {
        this.formObj.shipping_details_id = this.ObjShipping.id;
      }
    },

    onChangeVat: function () {
      this.formObj.vat_custom = this.defaultVat;
      this.onChangeItem(0, true);
    },

    funcLicense: function (e) {
      this.isLicense = e;
      if (!e) {
        this.formObj.license_title_value_1 = null;
        this.formObj.license_title_value_2 = null;
        this.formObj.license_title_label_1 = null;
        this.formObj.license_title_label_2 = null;
        this.onChangeItem(0, true);
      }
    },

    addItem: function (v) {
      if (v == 'item') {
        this.tableForm.push({ category_id: null, item: '', specification: '', qty: '', uom: '', unit_price: '' });
      } else {
        this.approvers.push({ user_id: null, approval_type: '' });
      }
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
        .post('/d/admin/local-purchase-order/update-status', dataForm)
        .then((response) => {
          this.sbOptions = {
            status: true,
            type: "success",
            text: response.data.message,
          };
          this.loadingSubmit = false;
          this.cancelledLPO = false;
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
        delete o["local_purchase_order_id"];
        delete o["created_at"];
        delete o["updated_at"];
        delete o["total_amount"];
        return o;
      });

      let formApprover = this.approvers.map((o, i) => {
        delete o["id"];
        delete o["local_purchase_order_id"];
        delete o["created_at"];
        delete o["updated_at"];
        delete o["orders"];
        delete o["users"];
        return o;
      });

      let dataForm = {
        data: this.formObj,
        items: formItems,
        approvers: formApprover,
        code: this.ObjCodes
      };

      this.formObj.discount = this.ObjDiscount;

      if (this.formObj.id) {
        let postID = this.formObj.id;
        this.formObj.contact_person = this.formObj.contact_person.id;
        let bdata = this.formObj;
        delete bdata["created_at"];
        delete bdata["updated_at"];
        delete bdata["user_id"];
        delete bdata["lpo_no"];
        delete bdata["requests"];
        delete bdata["supplier"];
        delete bdata["location"];
        delete bdata["lpo_approvals"];
        delete bdata["lpo_items"];
        delete bdata["id"];
        delete bdata["process_by"];
        delete bdata["billing"];
        dataForm = {
          data: bdata,
          id: postID,
          items: this.tableForm,
          approvers: this.approvers
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

    selectedSupplier: function () {

      this.supplier = {
        address: this.ObjSupplier.address,
        tax_no: this.ObjSupplier.tax_no,
        contact_no: this.ObjSupplier.contact_no,
        email: this.ObjSupplier.email
      }
      this.formObj.supplier_id = this.ObjSupplier.id

      this.ObjCodes.supplier_code = this.ObjSupplier.code;
    },
    selectedPRF: function () {

      this.formObj.request_id = this.ObjPrf.id;
      this.ObjCodes.comp_code = this.ObjPrf.company ? this.ObjPrf.company.code : '';

      this.formObj.company_id = this.ObjPrf.company_id;
      this.formObj.billing_details_id = this.ObjPrf.company_id;
      this.formObj.shipping_details_id = this.ObjPrf.company_id;
      this.formObj.location_id = this.ObjPrf.location_id;
      this.ObjPrf.location = this.ObjPrf.location ? this.ObjPrf.location.title : '';

      this.formObj.company = this.ObjPrf.company ? this.ObjPrf.company.title : '';


      this.ObjBilling = this.ObjPrf.company;
      this.ObjBilling.tax_no = this.ObjPrf.company ? this.ObjPrf.company.tax_no : '';
      this.ObjBilling.contact_person = this.ObjPrf.company ? this.ObjPrf.company.contact_person : '';
      this.ObjBilling.address = this.ObjPrf.company ? this.ObjPrf.company.address : '';
      this.ObjBilling.contact_no = this.ObjPrf.company ? this.ObjPrf.company.contact_no : '';
      this.ObjBilling.email = this.ObjPrf.company ? this.ObjPrf.company.email : '';

      this.ObjShipping = this.ObjPrf.company;
      this.ObjShipping.tax_no = this.ObjPrf.company ? this.ObjPrf.company.tax_no : '';
      this.ObjShipping.address = this.ObjPrf.company ? this.ObjPrf.company.address : '';
      this.ObjShipping.contact_no = this.ObjPrf.company ? this.ObjPrf.company.contact_no : '';

    },
    selectedContactPerson: function () {

      this.ObjContactPerson.email = this.ObjContactPerson.user ? this.ObjContactPerson.user.email : '';
      this.formObj.contact_person = this.ObjContactPerson.user_id;
    },
    fetchPRF: async function () {
      await axios.get('/d/admin/request/fetch-onprocess/pendings').then((response) => {
        this.prfList = response.data;
      });
    },
    fetchCurrency: async function () {
      await axios.get('/d/admin/fetch/currency/list').then((response) => {
        this.currencyList = response.data;
      })
    },
    fetchCompanies: async function () {
      if(this.companyList.length == 0){
        this.$store.dispatch("fetchCompanyList"); 
      }
    },
    fetchSuppliers: async function () {
      if(this.supplierList.length == 0){
        this.$store.dispatch("fetchSupplierList"); 
      }
    },
    fetchDepartment: async function () {
      if(this.departmentList.length == 0){
        this.$store.dispatch("fetchDepartmentList"); 
      }
    },
    fetchCategories: async function () {
      await axios.get('/d/admin/categories/fetch/non-paginate').then((response) => {
        this.categoryList = response.data;
      });
    },
    fetchActiverUsers: async function () {
      if(this.approverList.length == 0){
        this.$store.dispatch("fetchProfileList"); 
      }
    },
  },
  created() {
   
    if (this.pagetitle == 'edit') {
      this.formEditable = false;

    }
    this.fetchCompanies().then(() => {
      this.fetchPRF().then(() => {
        this.fetchCategories().then(() => {
          this.fetchCurrency(); 
          // if(this.$route.params && this.$route.params.request_id){ 
          //   this.ObjPrf = this.$route.params.request_id;
          // }
          this.pageLoading = false;
        });
      });
    });

  },
};
</script> 
<style scoped>
  .theme--light.v-card>.v-card__subtitle, .theme--light.v-card>.v-card__text, th,td,div,h2,h3,h4,h5,h6,pre { color: #000 !important}
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
.page-break{ page-break-after: always; }

 
  table{ width:99.7% !important;}
 
</style>