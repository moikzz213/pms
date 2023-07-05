<template>
    <div>
        <v-app-bar color="white" dense class="elevation-0 mt-10">
            <v-toolbar-title class="overline">Reports</v-toolbar-title>
        </v-app-bar>
        <v-container class="py-8 " v-if="pageLoading == true">
            <v-row>
                <v-col cols="12">
                    <v-skeleton-loader class="mx-auto" max-width="100%"
                        type="list-item-avatar-three-line, image, article"></v-skeleton-loader>
                </v-col>
            </v-row>
        </v-container>

        <v-container v-else class="mb-3 mx-auto reports-view" style="max-width: 1366px">
            <!-- content here -->
            <v-row class="mt-2">
                <v-col cols="12" class="py-0">

                </v-col>
                <v-col class="col-md-12 mt-1 col-sm-12">
                    <v-card class="px-5">
                        <v-row>
                            <v-col class="col-md-12 col-sm-12 d-flex">
                                <v-autocomplete :items="typeList" @change="onChangeTypes" v-model="types" dense outlined
                                    hide-details label="Type" class="mt-0 mr-3"></v-autocomplete>
                                <v-autocomplete :items="companies" @click="fetchCompany" clearable
                                    v-model="dataFilter.company_id" dense outlined hide-details label="Company"
                                    class="mt-0 mr-3" item-value="id" item-text="title"></v-autocomplete>
                                    <v-autocomplete :items="suppliers" @click="fetchSuppliers" clearable v-model="dataFilter.supplier_id"
                                    dense outlined hide-details label="Supplier" class="mt-0 mr-3" item-value="id"
                                    item-text="title"></v-autocomplete>
                                <v-autocomplete :items="processedBy" clearable v-model="dataFilter.process_by" dense
                                    outlined hide-details label="Processed By" class="mt-0 mr-3" item-value="id"
                                    item-text="name"></v-autocomplete>
                                <v-autocomplete :items="statusList" clearable v-model="dataFilter.status" dense outlined
                                    hide-details label="Status" class="mt-0  mr-3"></v-autocomplete>

                                <v-dialog ref="start" v-model="startDate" :close-on-content-click="false" width="290px">
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-text-field class="mr-1" v-model="startDateInput" label="From" dense
                                            hide-details readonly outlined v-bind="attrs" v-on="on"></v-text-field>
                                    </template>
                                    <v-date-picker v-model="startDateInput" @input="startDate = false" scrollable>
                                    </v-date-picker>
                                </v-dialog>

                                <v-dialog v-model="endDate" :close-on-content-click="false" width="290px">
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-text-field class="ml-1" v-model="endDateInput" label="To" dense hide-details
                                            readonly outlined v-bind="attrs" v-on="on"></v-text-field>
                                    </template>
                                    <v-date-picker v-model="endDateInput" @input="endDate = false" scrollable>
                                    </v-date-picker>
                                </v-dialog>
                                <v-btn text dense small @click="searchData"><v-icon>mdi-magnify</v-icon></v-btn>
                            </v-col>
                        </v-row>
                    </v-card>
                </v-col>

                <v-col class="col-md-12 col-sm-12">
                    <v-card> 
                        <div class="pl-4 pt-4 pb-2 d-flex">
                            <div> Showing maximum records of 50 only. Download to view all data.  </div>
                            <v-spacer></v-spacer>
                            <v-btn color="success" class="mr-5" :disabled="!downloading" small @click="downloadExcel" ><v-icon class="mr-2 dark" dark>mdi-microsoft-excel</v-icon></v-btn> 
                        </div>
                        <v-divider></v-divider>
                        <v-simple-table class="fixed-height"  fixed-header>
                            <template v-slot:default>
                                <thead v-if="currentHeaders && currentHeaders.length > 0">
                                    <tr>
                                        <th v-for="item in currentHeaders" :key="item.id">
                                            {{ item }}
                                        </th>
                                    </tr>
                                </thead>
                                <tbody v-if="items && Object.keys(items).length > 0">
                                    <tr v-for="item in items" :key="item.id" :class="item.cstatus">
                                        <template v-if="types == 'PRF'"> 
                                            <td>{{ item.prf_no }}</td>
                                            <td>{{ formatMonthOnly(item.created_at) }}</td>
                                            <td>{{ formatDateHelper(item.created_at) }}</td>
                                            <td>{{ item.company.title }}</td> 
                                            <td>{{ item.details && item.details != '-' ? item.details.replace(/(<([^>]+)>)/gi, " / ") : 
                                            item.items[3] ? item.items[2].description + " // "+ item.items[3].description : 
                                            item.items[2] ? item.items[1].description + " // "+ item.items[2].description :
                                            item.items[1] ? item.items[0].description + " // "+ item.items[1].description : item.items[0].description }}</td>
                                            <td>{{ item.process_by ? item.process_by.name : '' }}</td>
                                            <td>{{ item.profile ? item.profile.name : '' }}</td>
                                            <td>{{ item.location.title }}</td>
                                            <td>{{ item.due_terms }}</td>  
                                            <td>{{ item.due_date }}</td>
                                            <td class="text-uppercase">{{ item.status }}</td>
                                        </template>
                                        <template v-else-if="types == 'LPO'">
                                            <td>{{ formatDateHelper(item.lpo.requests.created_at) }}</td>
                                            <td>{{ item.lpo.requests.prf_no }}</td>
                                            <td>{{ formatMonthOnly(item.lpo.created_at) }}</td>
                                            <td>{{ formatDateHelper(item.lpo.created_at) }}</td>
                                            <td>{{ item.lpo.lpo_no }}</td>
                                            <td>{{ item.item }}</td>
                                            <td>{{ item.specification ? item.specification.replace(/(<([^>]+)>)/gi, " / ") : '' }}</td>
                                            <td>{{ item.lpo.department ? item.lpo.department.title : '' }}</td>
                                            <td>{{ item.category ? item.category.title : '' }}</td>
                                            <td>{{ item.qty }}</td>
                                            <td>{{ item.unit_price }}</td>
                                            <td></td>
                                            <td>{{ (item.qty * item.unit_price).toFixed(2) }}</td>
                                            <td>{{ item.lpo.supplier ? item.lpo.supplier.title : '' }}</td>
                                            <td>{{ item.lpo.requests ? item.lpo.requests.location.title : '' }}</td> 
                                            <td>{{ item.lpo.company }}</td> 
                                            <td>{{ item.lpo.requests ? item.lpo.requests.profile.name : '' }}</td>
                                            <td>{{ item.lpo.requests ? item.lpo.requests.profile.designation : '' }}</td> 
                                            <td class="text-uppercase">{{ item.lpo.status }}</td> 
                                        </template>
                                        <template v-else>
                                            <td>{{ formatDateHelper(item.paf.created_at) }}</td>
                                            <td>{{ item.paf.paf_no }}</td>
                                            <td>{{ formatMonthOnly(item.paf.created_at) }}</td>
                                            <td>{{ item.lpo ? formatDateHelper(item.lpo.created_at) : item.requests ? formatDateHelper(item.requests.created_at) :''  }}</td>
                                            <td>{{ item.lpo ? item.lpo.lpo_no : item.requests ? item.requests.prf_no : '' }}</td>
                                            <td>{{ item.invoice_date ? formatDateHelper(item.invoice_date) : '' }}</td>
                                            <td>{{ item.supplier_invoice_num  }}</td>
                                            <td>{{ item.amount > 0 ? (item.amount).toFixed(2) : item.amount }}</td>
                                            <td>{{ item.description ? item.description.replace(/(<([^>]+)>)/gi, " / ") : ''  }}</td>
                                            <td>{{ item.lpo ? item.lpo.department.title : item.requests ? item.requests.company.title : '' }}</td>  
                                            <td>{{ item.qty }}</td>
                                            <td>{{ item.unit_price }}</td>
                                            <td>{{ item.vat }}</td>
                                            <td>{{ item.total_amount }}</td>
                                            <td>{{ item.supplier ? item.supplier.title : '' }}</td>
                                            <td>{{ item.location }}</td> 
                                            <td>{{ item.requests && item.requests.company ? item.requests.company.title : '' }}</td> 
                                            <td>{{ item.paf.process_by ? item.paf.process_by.name : '' }}</td>
                                            <td>{{ item.paf.process_by ? item.paf.process_by.designation : '' }}</td> 
                                            <td class="text-uppercase">{{ item.paf.status }}</td> 
                                        </template>
                                    </tr> 
                                </tbody>
                            </template>
                        </v-simple-table>
                    </v-card>
                </v-col>
            </v-row>
            <v-row>
                <v-col class="col-12">
                    <v-card>
                        <v-card-text>
                            <div class="d-flex mb-2">
                                <v-btn :loading="loadingFilter"  small color="primary" @click="onFilterCount('first')" class="mr-2">FILTER BY</v-btn>
                                <v-autocomplete :items="yearList" v-model="firstFilter" hide-details dense outlined label="Year" class="col-12 col-md-1"></v-autocomplete>
                            </div>
                            <v-divider></v-divider>
                            <v-simple-table dense>
                                <template v-slot:default>
                                <thead>
                                    <tr>
                                       <th>NAME</th>
                                       <th>OPEN</th>
                                       <th>PROCESSING</th>
                                       <th>HOLD</th>
                                       <th>CANCELLED</th>
                                       <th>CLOSED</th>
                                    </tr>
                                </thead>
                                <tbody v-if="filterSearch && filterSearch.length > 0"> 
                                    <tr v-for="item in filterSearch" :key="item.id">
                                        <td>{{ item.name }}</td>
                                        <td>{{ item.pending }}</td>
                                        <td>{{ item.onprocess }}</td>
                                        <td>{{ item.onhold }}</td>
                                        <td>{{ item.cancelled }}</td>
                                        <td>{{ item.closed }}</td>
                                    </tr>
                                </tbody> 
                                </template>
                            </v-simple-table>
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>

            <v-row>
                <v-col class="col-12">
                    <v-card>
                        <v-card-text>
                            <div class="d-flex mb-2">
                                <v-btn :loading="loadingFilter" @click="onFilterCount('second')"  small color="primary" class="mr-2">FILTER BY</v-btn>
                                <v-autocomplete :items="yearList" v-model="secondFilter" hide-details dense outlined label="Year" class="col-12 col-md-1"></v-autocomplete>
                            </div>
                            <v-divider></v-divider>
                            <v-simple-table dense>
                                <template v-slot:default>
                                <thead>
                                    <tr>
                                       <th>MONTH</th>
                                        <th v-for="item in processedBy" :key="item.id">
                                            {{ item.name }}
                                        </th>
                                    </tr>
                                </thead>
                                <tbody v-if="filterSearchSecond && filterSearchSecond.length > 0"> 
                                    <tr v-for="item in filterSearchSecond" :key="item.id">
                                        <td>{{ item.month }}</td>
                                        <td v-for="(job, idx) in item.data" :key="job.id">
                                             
                                                    {{ job.count == 0 ? '-' : job.count }}
                                                
                                        </td>
                                    </tr>
                                </tbody> 
                                </template>
                            </v-simple-table>
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>

            <v-row>
                <v-col class="col-12">
                    <v-card>
                        <v-card-text>
                            <div class="d-flex mb-2">
                                <v-btn :loading="loadingFilter" @click="onFilterCount('third')" small color="primary" class="mr-2">FILTER BY</v-btn>
                                <v-autocomplete :items="yearList" v-model="thirdFilter" hide-details dense outlined label="Year" class="col-12 col-md-1"></v-autocomplete>
                                <v-autocomplete :items="monthList" item-value="id" item-text="title" v-model="months" hide-details dense outlined label="Month" class="col-12 col-md-1 mx-2"></v-autocomplete>
                                <v-autocomplete :items="deptList" @change="onChangeDepartments" return-object item-value="id" item-text="title" multiple v-model="departments" hide-details dense outlined label="Department"></v-autocomplete>
                            </div>
                            <v-divider></v-divider>
                            <v-simple-table dense>
                                <template v-slot:default>
                                <thead>
                                    <tr>
                                       <th>ENTITY</th>
                                       <th v-for="item in displayDepartments" :key="item.id">
                                        {{ item.title }}
                                        </th>                                       
                                    </tr>
                                </thead>
                                <tbody v-if="filterSearchThird && filterSearchThird.length > 0"> 
                                    <tr v-for="item in filterSearchThird" :key="item.id">
                                        <td>{{ item.company }}</td> 
                                        <td v-for="cols in displayDepartments" :key="cols.id">
                                            <div v-if="item.data && item.data.length > 0">
                                                    <div v-for="tdz in item.data" :key="tdz.id">
                                                            <div v-if="cols.id == tdz.department">
                                                                {{  Number(tdz.sum).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") }}</div>
                                                    </div>
                                            </div>
                                            <div v-else>-</div>
                                        </td>   
                                    </tr>
                                </tbody> 
                                </template>
                            </v-simple-table>
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
        <dialog-loader :loader-options="loaderOptions"></dialog-loader>
        
    </div>
</template>
  
<script>
 
 import * as XLSX from "xlsx/xlsx.mjs";
export default {
components: {
    XLSX
  },
    data() {
        return {
            typeList: ['PRF', 'LPO', 'PAF'],
            types: 'PRF',
            startDateInput: this.startDateLessADays(),
            startDate: false,
            endDateInput: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
            endDate: false,
            headers: {
                PRF: ['RQST NO', 'MONTH', 'RQST DATE', 'BUSINESS UNIT', 'DESC', 'PROCESSED BY', 'REQUESTED BY', 'BRANCH', 'DUE TERMS', 'DUE DATE', 'STATUS'],
                LPO: ['RQST DATE', 'RQST NO', 'MONTH', 'LPO DATE', 'LPO NO', 'ITEM', 'DESC', 'CATEGORY', 'SUB CAT', 'QTY', 'UNIT PRICE', 'VAT 5%', 'TOTAL', 'SUPPLIER',
                    'BRANCH', 'BUSINESS UNIT', 'EMP NAME', 'DESIGNATION', 'STATUS'],
                PAF: ['PAF DATE', 'PAF NO', 'MONTH', 'LPO DATE', 'LPO NO', 'INV DATE', 'INV NO', 'INV AMNT', 'ITEM', 'CATEGORY', 'QTY', 'UNIT PRICE', 'VAT 5%', 'TOTAL',
                    'SUPPLIER', 'BRANCH', 'BUSINESS UNIT', 'EMP NAME', 'DESIGNATION', 'STATUS']
            },
            currentHeaders: [],
            pageLoading: true,
            downloadData: [], 
            dataFilter: {}, 
            loaderOptions: {},
          
            statusList: ['onprocess', 'onhold', 'cancelled', 'closed'], 
            items: [],
            processedBy: [],
            companies: [],
            suppliers: [],
            filterLoaded: { suppliers: false, comp: false, procteam: false },
            downloading: false,
            yearList: [],
            firstFilter: new Date().getFullYear(),
            secondFilter: new Date().getFullYear(),
            thirdFilter: new Date().getFullYear(),
            filterSearch: [],
            filterSearchSecond: [],
            filterSearchThird: [],
            departments: [],
            displayDepartments: [],
            deptList: [],
            months: new Date().getMonth()+1,
            monthList: [
                {id: 1, title: 'Jan'},
                {id: 2, title: 'Feb'},
                {id: 3, title: 'Mar'},
                {id: 4, title: 'Apr'},
                {id: 5, title: 'May'},
                {id: 6, title: 'Jun'},
                {id: 7, title: 'Jul'},
                {id: 8, title: 'Aug'},
                {id: 9, title: 'Sept'},
                {id: 10, title: 'Oct'},
                {id: 11, title: 'Nov'},
                {id: 12, title: 'Dec'},
            ],
            loadingFilter: false,
        };
    },

    methods: { 
        onChangeDepartments: function(){
            this.displayDepartments = this.departments; 
        },
        onFilterCount: function(v){
            this.filterSearch = [];
            let controller = '';
            this.loadingFilter = true;
            let search = {};
            if(v == 'first'){
                controller = '/d/admin/report/statuses/counts';
                search = { year: this.firstFilter };
            }else if(v == 'second'){
                controller = '/d/admin/report/monthly/counts';
                search = { year: this.secondFilter };
            }else{

                controller = '/d/admin/report/business-report';
                if(this.displayDepartments && this.displayDepartments.length > 0){
                    let depts = [];
                    this.displayDepartments.map((o,i) => {
                        depts[i] = o.id;
                    });
                    search = {year: this.thirdFilter, month: this.months, department: depts};
                }else{
                    return false;
                }
            }
         
            axios.post(controller, search).then((response) => { 
                console.log(response.data);
                if(v == 'first'){
                    this.filterSearch = response.data;
                }else if(v == 'second'){
                    this.filterSearchSecond = response.data;
                }else{
                    this.filterSearchThird = response.data;
                }

                this.loadingFilter = false;
            });
        },
        downloadExcel: function(){
            this.downloading = false;
            const worksheet = XLSX.utils.json_to_sheet(this.downloadData);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

            XLSX.writeFile(workbook, "Report.xlsx");  
        },  
        onChangeTypes: function () {
            this.items = [];
            this.downloading = false;
            if (this.types == 'PRF') {
                this.currentHeaders = this.headers.PRF;
            } else if (this.types == 'LPO') {
                this.currentHeaders = this.headers.LPO;
            } else {
                this.currentHeaders = this.headers.PAF;
            } 
        }, 

        searchData: async function () {
            this.loaderOptions = {
                status: true,
                text: "Please wait...",
            };
            this.items = [];
            let dateFilter = {};
            dateFilter.from = new Date(this.startDateInput);
            dateFilter.to = new Date(this.endDateInput);

            let controller = '';
            if (this.types == 'PRF') {
                controller = '/d/admin/generate/report/prf';
            } else if (this.types == 'LPO') {
                controller = '/d/admin/generate/report/lpo';
            } else {
                controller = '/d/admin/generate/report/paf';
            }

            let dataForm = { data: this.dataFilter, daterange: dateFilter };
            axios.post(controller, dataForm)
            .then((response) => {
                let dataItems = [];
                let allDataItems = [];
                let currentDate = new Date();
                if(response.data && response.data.length > 0){
                    this.downloading = true;
                    response.data.map((o,i) =>{
                        let flagged = "";
                        let newDetails = '';
                        o.due_terms = 7; 
                        let date = new Date(o.created_at); 
                        let udate = new Date(o.updated_at);
                        let ddate = new Date(
                            date.setTime(date.getTime() + 7 * 86400000)
                        );
                        if (
                                (currentDate > ddate && o.status !== "closed") ||
                                udate > ddate
                            ) {
                                flagged = "flagged";
                            }
                        o.cstatus = flagged;
                        o.due_date = ddate.toLocaleDateString();
                        if (i < 50) {
                            dataItems[i] = o;
                        }
                        if(o.items && o.items.length > 0){
                            o.items.map((oo,ii) => {
                                newDetails += oo.description;
                                newDetails += " // ";
                            });
                        }
                        
                        if(this.types == 'PRF'){
                            allDataItems[i] = {
                                    PRFNo: o.prf_no,
                                    Month: this.formatMonthOnly(o.created_at),
                                    RQSTDATE: new Date(o.created_at).toLocaleDateString(),
                                    Company: o.company ? o.company.title : "",
                                    Description: o.details && o.details != '-' ? o.details.replace(/(<([^>]+)>)/gi, " / ") : newDetails,
                                    ProcessBy: o.process_by ? o.process_by.name : "",
                                    RequestedBy: o.profile.name,
                                    Location: o.location ? o.location.title : "",
                                    DueTerm: o.due_terms,
                                    DueDate: o.due_date,
                                    Flagged: flagged,
                                    Status: o.status,
                                };
                        }else if(this.types == 'LPO'){
                            allDataItems[i] =  {
                                RequestDate: new Date( o.lpo.requests.created_at ).toLocaleDateString(),
                                PRFNo: o.lpo.requests.prf_no ,
                                Month: this.formatMonthOnly(o.lpo.created_at),
                                LPODate: new Date(o.lpo.created_at).toLocaleDateString(),
                                LPONo: o.lpo.lpo_no,
                                Item: o.item,
                                Specification: o.specification ? o.specification.replace(/(<([^>]+)>)/gi, " / ") : '',
                                Department: o.lpo.department ? o.lpo.department.title : "",
                                Category: o.category ? o.category.title : "",
                                Qty: o.qty,
                                UnitPrice: o.unit_price, 
                                Total: o.qty * o.unit_price,
                                Supplier: o.lpo.supplier ? o.lpo.supplier.title : "",
                                Location: o.lpo.requests
                                    ? o.lpo.requests.location.title
                                    : "",
                                Company: o.lpo.company,
                                ProcessedBy: o.lpo.process_by.name,
                                RequestBy: o.lpo.requests
                                    ? o.lpo.requests.profile.name
                                    : "",
                                Designation: o.lpo.requests.profile
                                    ? o.lpo.requests.profile.designation
                                    : "",
                                Status: o.lpo.status,
                                Reason: o.lpo.reasons
                            }
                        }else{
                            allDataItems[i] =  {
                                PAFDate: new Date(o.created_at).toLocaleDateString(),
                                PAFNo: o.paf.paf_no,
                                Month: this.formatMonthOnly(o.paf.created_at),
                                LPODate: o.lpo
                                    ? new Date(o.lpo.created_at).toLocaleDateString()
                                    : o.requests
                                    ? new Date(o.requests.created_at).toLocaleDateString()
                                    : "",
                                LPONo: o.lpo
                                    ? o.lpo.lpo_no
                                    : o.requests
                                    ? o.requests.prf_no
                                    : "",
                                InvDate: o.invoice_date,
                                InvNo: o.supplier_invoice_num,
                                InvAmnt: o.total_amount,
                                Item: o.description ? o.description.replace(/(<([^>]+)>)/gi, " / ") : '',
                                Department: o.lpo
                                    ? o.lpo.department.title
                                    : "",
                                Qty: o.qty,
                                UnitPrice: o.unit_price,
                                VAT: o.vat,
                                Total: o.total_amount,
                                Supplier: o.supplier ? o.supplier.title : "",
                                Location: o.location,
                                Company: o.requests ? o.requests.company.title : o.lpo ? o.lpo.company : '',
                                ProcessBy: o.paf.process_by.name,
                                Designation: o.paf.process_by.designation,
                                Flagged: flagged,
                                status: o.paf.status,
                                Reason: o.paf.reasons
                            }
                        } 
                         
                    });
                    this.items = dataItems; 
                    this.downloadData = allDataItems; 
                }
                this.loaderOptions.status = false;
            });
        },

        fetchCompany: async function () {
            if (!this.filterLoaded.comp) {
                this.filterLoaded.comp = true;
                await axios
                    .get("/d/admin/fetch/non-paginate/companies")
                    .then((response) => {
                        this.companies = Object.assign([], response.data);
                    });
            }
        },
        fetchSuppliers: async function () {
            if (!this.filterLoaded.suppliers) {
                this.filterLoaded.suppliers = true;
                await axios
                    .get("/d/admin/fetch/non-paginate/suppliers")
                    .then((response) => {

                        this.suppliers = Object.assign([], response.data);
                    });
            }
        },
        fetchProcTeam: async function () {
            
                await axios
                    .get("/d/admin/profile/procurements/list")
                    .then((response) => {
                        let nData = Object.assign([], response.data);
                        if (nData && nData.length > 0) {
                            let getProfile = [];
                            nData.map((o, i) => {
                                //getProfile[i] = o.profile;
                                let first = o.profile.name.split(" ");
                                getProfile[i] = {
                                    id: o.id,
                                    user_id: o.user_id,
                                    name: first[0],
                                };
                            });

                            getProfile.sort((a, b) => a.id - b.id);
                            this.processedBy = getProfile;
                        }
                         
                    });
            
        },
        fetchDepartments: async function(){
            await axios.get('/d/admin/fetch/non-paginate/departments').then((response) =>{
                this.deptList = response.data;
            });
        }
    },
    created() {
        let currentYear = new Date().getFullYear();
        let year1 = currentYear - 1;
        let year2 = currentYear - 2; 

        this.yearList = [currentYear,year1,year2]
        this.currentHeaders = this.headers.PRF;
        this.fetchProcTeam().then(() => {
            this.fetchDepartments().then(() => {
            setTimeout(() => {
                this.pageLoading = false;
            }, 500);
            });
        });
    },

};
</script>
<style>
.flagged { background-color: #626262; color: #fff;}
.reports-view table thead th {
    font-size: 10px !important; 
} 
.reports-view table tbody td {
    font-size: 9px !important;
    vertical-align: top;
}
.reports-view .fixed-height .v-data-table__wrapper{ max-height: 550px;}
</style>