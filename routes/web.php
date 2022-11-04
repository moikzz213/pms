<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\CompanyController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\RequestController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\LocationController;
use App\Http\Controllers\SupplierController;
use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\LocalPurchaseOrderController;
use App\Http\Controllers\PaymentApprovalFormController;
/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/


Auth::routes([
    'register' => false, // Registration Routes...
    //'reset' => false, // Password Reset Routes...
    'verify' => false, // Email Verification Routes...
]);

Route::get('/', function () {
    return redirect('/d/dashboard');
});

/**
 * Dashboard Routes
 */
Route::group(['prefix'=>'d','as'=>'dashboard.'], function(){
    Route::get('/{slug}', function () { return view('layouts.app'); });  
    Route::get('/{slug}/{slug2}', function () { return view('layouts.app'); }); 
    Route::get('/{slug}/{slug2}/{slug3}', function () { return view('layouts.app'); }); 
    Route::get('/{slug}/{slug2}/{slug3}/{id}', function () { return view('layouts.app'); }); 
});

// Companies
Route::get('/v/companies/fetch-non-paginate', [CompanyController::class, 'fetchAll'])->name('company.fetch.all');
Route::get('/v/companies/fetch-all', [CompanyController::class, 'fetch'])->name('company.fetch.paginate');
Route::get('/v/companies/fetch/{id}', [CompanyController::class, 'show'])->name('company.show');
Route::get('/v/companies/search/{search}', [CompanyController::class, 'search'])->name('company.search');
Route::post('/v/companies/new', [CompanyController::class, 'store'])->name('company.new');
Route::post('/v/companies/update', [CompanyController::class, 'update'])->name('company.update');
Route::post('/v/companies/delete', [CompanyController::class, 'destroy'])->name('company.destroy');

// Departments
Route::get('/v/departments/fetch-non-paginate', [DepartmentController::class, 'fetchAll'])->name('department.fetch.all');
Route::get('/v/departments/fetch-all', [DepartmentController::class, 'fetch'])->name('department.fetch.paginate');
Route::get('/v/departments/fetch/{id}', [DepartmentController::class, 'show'])->name('department.show');
Route::get('/v/departments/search/{search}', [DepartmentController::class, 'search'])->name('department.search');
Route::post('/v/departments/new', [DepartmentController::class, 'store'])->name('department.new');
Route::post('/v/departments/update', [DepartmentController::class, 'update'])->name('department.update');
Route::post('/v/departments/delete', [DepartmentController::class, 'destroy'])->name('department.destroy');

// Locations
Route::get('/v/locations/fetch-non-paginate', [LocationController::class, 'fetchAll'])->name('location.fetch.all');
Route::get('/v/locations/fetch-all', [LocationController::class, 'fetch'])->name('location.fetch.paginate');
Route::get('/v/locations/fetch/{id}', [LocationController::class, 'show'])->name('location.show');
Route::get('/v/locations/search/{search}', [LocationController::class, 'search'])->name('location.search');
Route::post('/v/locations/new', [LocationController::class, 'store'])->name('location.new');
Route::post('/v/locations/update', [LocationController::class, 'update'])->name('location.update');
Route::post('/v/locations/delete', [LocationController::class, 'destroy'])->name('location.destroy');

// Categories
Route::get('/v/categories/fetch-non-paginate', [CategoryController::class, 'fetchAll'])->name('category.fetch.all');
Route::get('/v/categories/fetch-all', [CategoryController::class, 'fetch'])->name('category.fetch.paginate');
Route::get('/v/categories/fetch/{id}', [CategoryController::class, 'show'])->name('category.show');
Route::get('/v/categories/search/{search}', [CategoryController::class, 'search'])->name('category.search');
Route::post('/v/categories/new', [CategoryController::class, 'store'])->name('category.new');
Route::post('/v/categories/update', [CategoryController::class, 'update'])->name('category.update');
Route::post('/v/categories/delete', [CategoryController::class, 'destroy'])->name('category.destroy');

// Suppliers
Route::get('/v/suppliers/fetch-non-paginate', [SupplierController::class, 'fetchAll'])->name('supplier.fetch.all');
Route::get('/v/suppliers/fetch-all', [SupplierController::class, 'fetch'])->name('supplier.fetch.paginate');
Route::get('/v/suppliers/fetch/{id}', [SupplierController::class, 'show'])->name('supplier.show');
Route::get('/v/suppliers/search/{search}', [SupplierController::class, 'search'])->name('supplier.search');
Route::post('/v/suppliers/new', [SupplierController::class, 'store'])->name('supplier.new');
Route::post('/v/suppliers/update', [SupplierController::class, 'update'])->name('supplier.update');
Route::post('/v/suppliers/delete', [SupplierController::class, 'destroy'])->name('supplier.destroy');

// Users
Route::get('/v/fetch/hive-users', [UserController::class, 'fetchHiveUsers'])->name('fetch.hive.users');
Route::get('/v/users/fetch-active-users', [UserController::class, 'fetchActiveUsers'])->name('user.fetch.active.non-paginate');
Route::get('/v/users/fetch-all', [UserController::class, 'fetch'])->name('user.fetch.paginate');
Route::get('/v/users/fetch/{id}', [UserController::class, 'show'])->name('user.show');
Route::get('/v/users/search/{search}', [UserController::class, 'search'])->name('user.search');
Route::post('/v/users/new', [UserController::class, 'store'])->name('user.new');
Route::post('/v/users/profile-fetch', [UserController::class, 'profile'])->name('user.profile.show');
Route::post('/v/users/update', [UserController::class, 'update'])->name('user.update');
Route::post('/v/users/delete', [UserController::class, 'destroy'])->name('user.destroy');
Route::post('/v/users/logout/{token}', [UserController::class, 'logout'])->name('user.logout');
Route::post('/v/profile/change-password', [UserController::class, 'change_password'])->name('user.change.password');
Route::post('/v/user/reset-password', [UserController::class, 'reset_link_password'])->name('user.reset.link.password');


// Profile
Route::get('/v/profile/fetch/{id}', [ProfileController::class, 'show'])->name('profile.show');
Route::get('/v/profile/procurements/list', [ProfileController::class, 'profile_procurement'])->name('profile.procurements');
Route::get('/v/profile/procurements/profile_users', [ProfileController::class, 'profile_users'])->name('profile.procurements.profile_users');


// Request
Route::post('/v/request/update-status', [RequestController::class, 'updateStatus'])->name('request.update.status');
Route::post('/v/request/edit-data', [RequestController::class, 'editData'])->name('request.edit.data');
Route::post('/v/request/new', [RequestController::class, 'store'])->name('request.new');
Route::get('/v/request/fetch/{id}', [RequestController::class, 'show'])->name('request.show');
Route::get('/v/request/fetch-all/{token}/{orderby}', [RequestController::class, 'fetch'])->name('request.fetch.paginate');
Route::get('/v/request/search/{id}/{search}', [RequestController::class, 'search'])->name('request.search');
Route::get('/v/request/proc-search/{search}', [RequestController::class, 'procSearch'])->name('procurement.request.search');

Route::post('/v/request/filter/search', [RequestController::class, 'requestorFilterStatus'])->name('request.filter.requestor.search');
Route::get('/file/{path}',  [RequestController::class, 'showFile'])->name('file.show');
Route::get('/v/request/dashboard/{token}', [RequestController::class, 'dashboard'])->name('request.dashboard');
Route::get('/v/request/fetch-onprocess/pendings', [RequestController::class, 'fetchAllOnProcess'])->name('request.fetch.fetch-pending');

// Procurement
Route::get('/v/request/procurement/fetch-all', [RequestController::class, 'requests_procurements'])->name('request.procurement.fetch.paginate');
Route::post('/v/request/procurement/assigned', [RequestController::class, 'procurementAssigned'])->name('request.procurement.assign');
Route::post('/v/request/procurement/filter/search', [RequestController::class, 'filterSearch'])->name('request.procurement.search');

// Local Purchase Order - LPO
Route::post('/v/local-purchase-order/item-update', [LocalPurchaseOrderController::class, 'updateItem'])->name('lpo.item.update');
Route::post('/v/local-purchase-order/lpo-update', [LocalPurchaseOrderController::class, 'updateLPO'])->name('lpo.data.update'); 
Route::post('/v/local-purchase-order/update-status', [LocalPurchaseOrderController::class, 'updateStatus'])->name('lpo.update.status');
Route::post('/v/local-purchase-order/new', [LocalPurchaseOrderController::class, 'store'])->name('lpo.new');
Route::post('/v/local-purchase-order/filter/search', [LocalPurchaseOrderController::class, 'filterSearch'])->name('lpo.filter.search');
Route::get('/v/local-purchase-order/search/{search}', [LocalPurchaseOrderController::class, 'search'])->name('lpo.search');
Route::get('/v/local-purchase-order/fetch', [LocalPurchaseOrderController::class, 'fetch'])->name('lpo.fetch.items');
Route::get('/v/local-purchase-order/fetch/{id}', [LocalPurchaseOrderController::class, 'show'])->name('lpo.show');
Route::get('/v/local-purchase-order/onprocess-status/fetch', [LocalPurchaseOrderController::class, 'fetchProcessStatus'])->name('lpo.fetch.onprocess');



// Payment Approval Form - PAF
Route::post('/v/payment-approval-form/item-update', [PaymentApprovalFormController::class, 'updateItem'])->name('paf.item.update');
Route::post('/v/payment-approval-form/paf-update', [PaymentApprovalFormController::class, 'updatePAF'])->name('paf.data.update'); 
Route::post('/v/payment-approval-form/update-status', [PaymentApprovalFormController::class, 'updateStatus'])->name('paf.update.status');
Route::post('/v/payment-approval-form/new', [PaymentApprovalFormController::class, 'store'])->name('paf.new');
Route::post('/v/payment-approval-form/invoice-update', [PaymentApprovalFormController::class, 'pafClosed'])->name('paf.closed');
Route::post('/v/payment-approval-form/filter/search', [PaymentApprovalFormController::class, 'filterSearch'])->name('paf.filter.search');
Route::get('/v/payment-approval-form/search/{search}', [PaymentApprovalFormController::class, 'search'])->name('paf.search');
Route::get('/v/payment-approval-form/fetch', [PaymentApprovalFormController::class, 'fetch'])->name('paf.fetch.items');
Route::get('/v/payment-approval-form/fetch/{id}', [PaymentApprovalFormController::class, 'show'])->name('paf.show');

// Import Data
Route::post('/v/suppliers/import', [SupplierController::class, 'import'])->name('import.supplier');
Route::post('/v/companies/import', [CompanyController::class, 'import'])->name('import.company');
Route::post('/v/locations/import', [LocationController::class, 'import'])->name('import.location');
Route::post('/v/users/import', [UserController::class, 'import'])->name('import.users');
Route::post('/v/departments/import', [DepartmentController::class, 'import'])->name('import.department');

// Reports
Route::post('/v/report/prf', [RequestController::class, 'reportTable'])->name('report.prf.table');
Route::post('/v/report/lpo', [LocalPurchaseOrderController::class, 'reportTable'])->name('report.lpo.table');
Route::post('/v/report/business-report', [LocalPurchaseOrderController::class, 'fetchBusinessReport'])->name('report.business-report');
Route::post('/v/report/paf', [PaymentApprovalFormController::class, 'reportTable'])->name('report.paf.table');
Route::post('/v/report/statuses/counts', [UserController::class, 'fetchProcurement'])->name('report.statuses.counts'); 
Route::post('/v/report/monthly/counts', [UserController::class, 'fetchProcurementMonthly'])->name('report.monthly.counts');

// CRONJOB
Route::get('/job/notification/procurement',  [RequestController::class, 'cronJobReminderNotification'])->name('cron.job.notification');