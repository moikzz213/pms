<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ImageController;
use App\Http\Controllers\LoginController;
use App\Http\Controllers\CompanyController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\RequestController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\FeedbackController;
use App\Http\Controllers\LocationController;
use App\Http\Controllers\SupplierController;
use App\Http\Controllers\ComparisonController;
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


Route::get('/auth_user', [LoginController::class, 'authenticate'])->name('get.authenticated.user');
Auth::routes([
    'register' => false, // Registration Routes...
    //'reset' => false, // Password Reset Routes...
    'verify' => false, // Email Verification Routes...
]);
Route::get('/', function () {
    return redirect('/d/admin/dashboard');
});
Route::get('/home', function () {
    return redirect('/d/admin/dashboard');
});
/**
 * Dashboard Routes
 */
Route::group(['prefix'=>'d','as'=>'dashboard', 'middleware' => 'auth'], function(){
    
    Route::get('/{page}', function () { return view('layouts.moderator'); });  
    Route::get('/admin/{page}', function () { return view('layouts.moderator'); });  
    Route::get('/admin/{page}/{action}', function () { return view('layouts.moderator'); });  
    Route::get('/admin/{page}/page/{id}', function () { return view('layouts.moderator'); });  
    Route::get('/admin/{page}/edit/{id}', function () { return view('layouts.moderator'); });  
    Route::get('/admin/{page}/quotations/{id}', function () { return view('layouts.moderator'); });  
});
Route::group([ 'prefix'=>'d','as'=>'dashboard','middleware' => 'auth'], function(){
// Companies
Route::get('/admin/fetch/companies/{perPage}/{search}/{orderBy}', [CompanyController::class, 'fetch'])->name('companies.paginate.fetch'); // updated
Route::get('/admin/fetch/non-paginate/companies', [CompanyController::class, 'fetchNonpaginate'])->name('companies.non-paginate.fetch'); // updated
Route::post('/admin/company/save', [CompanyController::class, 'saveData'])->name('save.company.data'); // updated
Route::get('/admin/company/get/{id}', [CompanyController::class, 'edit'])->name('show.single.company'); // updated
Route::get('/admin/company/delete/{id}', [CompanyController::class, 'destroy'])->name('delete.company'); // updated

Route::get('/admin/fetch/all/logos', [ImageController::class, 'fetch'])->name('fetch.image.logo'); // updated
Route::post('/admin/file/upload', [ImageController::class, 'dropzoneUpload'])->name('upload.image.logo'); // updated

// Departments 
Route::get('/admin/fetch/non-paginate/departments', [DepartmentController::class, 'fetchAll'])->name('department.fetch.all'); // updated
Route::get('/admin/departments/fetch-all/{search}', [DepartmentController::class, 'fetch'])->name('department.fetch.paginate'); // updated
Route::get('/admin/departments/fetch/{id}', [DepartmentController::class, 'show'])->name('department.show'); // updated
Route::post('/admin/departments/save', [DepartmentController::class, 'store'])->name('department.save'); // updated
Route::post('/admin/departments/delete', [DepartmentController::class, 'destroy'])->name('department.destroy'); // updated
 
// Locations 
Route::get('/admin/fetch/non-paginate/locations', [LocationController::class, 'fetchAll'])->name('location.fetch.all'); // updated
Route::get('/admin/locations/fetch-all/{search}', [LocationController::class, 'fetch'])->name('location.fetch.paginate'); // updated
Route::get('/admin/locations/fetch/{id}', [LocationController::class, 'show'])->name('location.show'); // updated
Route::post('/admin/locations/save', [LocationController::class, 'store'])->name('location.save'); // updated
Route::post('/admin/locations/delete', [LocationController::class, 'destroy'])->name('location.destroy'); // updated

// Categories
Route::get('/admin/categories/fetch/non-paginate', [CategoryController::class, 'fetchAll'])->name('category.fetch.all'); // updated
Route::get('/admin/categories/fetch-all/{search}', [CategoryController::class, 'fetch'])->name('category.fetch.paginate'); // updated
Route::get('/admin/categories/fetch/{id}', [CategoryController::class, 'show'])->name('category.show'); // updated
Route::post('/admin/category/save', [CategoryController::class, 'store'])->name('category.save'); // updated
Route::post('/admin/category/delete', [CategoryController::class, 'destroy'])->name('category.destroy'); // updated

// Suppliers
Route::get('/admin/fetch/suppliers/{perPage}/{search}/{orderBy}', [SupplierController::class, 'fetch'])->name('suppliers.paginate.fetch'); // updated
Route::get('/admin/fetch/non-paginate/suppliers', [SupplierController::class, 'fetchNonpaginate'])->name('suppliers.non-paginate.fetch'); // updated
Route::post('/admin/suppliers/save', [SupplierController::class, 'saveData'])->name('save.suppliers.data'); // updated
Route::get('/admin/suppliers/get/{id}', [SupplierController::class, 'edit'])->name('show.single.suppliers'); // updated
Route::get('/admin/suppliers/delete/{id}', [SupplierController::class, 'destroy'])->name('delete.suppliers'); // updated

// Users
// Route::get('/v/fetch/hive-users', [UserController::class, 'fetchHiveUsers'])->name('fetch.hive.users');
// Route::get('/v/users/fetch-active-users', [UserController::class, 'fetchActiveUsers'])->name('user.fetch.active.non-paginate');
Route::get('/admin/users/fetch-all/{search}', [UserController::class, 'fetch'])->name('user.fetch.paginate');               // updated
Route::get('/admin/single/user/fetch/{id}', [UserController::class, 'show'])->name('user.show');                            // updated
//Route::get('/v/users/search/{search}', [UserController::class, 'search'])->name('user.search');
Route::post('/admin/user/save', [UserController::class, 'store'])->name('user.new');                                        // updated
// Route::post('/v/users/profile-fetch', [UserController::class, 'profile'])->name('user.profile.show');
// Route::post('/v/users/update', [UserController::class, 'update'])->name('user.update');
Route::post('/users/profile-update', [UserController::class, 'profile_update'])->name('user.profile.update');               // updated 

// Route::post('/v/users/delete', [UserController::class, 'destroy'])->name('user.destroy');
// Route::post('/v/users/logout', [UserController::class, 'logout'])->name('user.logout');
Route::post('/admin/user/changepassword', [UserController::class, 'change_password'])->name('user.change.password');            // updated
Route::post('/admin/user/reset-password', [UserController::class, 'reset_link_password'])->name('user.reset.link.password');    // updated 

// Profile
Route::get('/v/profile/fetch/{id}', [ProfileController::class, 'show'])->name('profile.show');
Route::get('/profile/procurements/profile_users', [ProfileController::class, 'profile_users'])->name('profile.procurements.profile_users'); //updated
Route::get('/admin/profile/procurements/list', [UserController::class, 'profile_procurement'])->name('profile.procurements');               //updated 

// Request
Route::get('/admin/request/fetch/{search}/{status}/{orderBy}', [RequestController::class, 'fetch'])->name('request.paginate.fetch');        // updated
Route::post('/admin/request/update-status', [RequestController::class, 'updateStatus'])->name('request.update.status');                     // updated
Route::post('/admin/requests/save', [RequestController::class, 'store'])->name('request.new');                
Route::post('/admin/request/detach-image', [RequestController::class, 'requestDetachImage'])->name('request.remove.image');                                  // updated
Route::get('/admin/request/fetch-single/{id}', [RequestController::class, 'show'])->name('request.show');                                   // updated

// Comparisons
Route::get('/admin/comparisons/fetch/{search}',  [ComparisonController::class, 'fetch'])->name('comparisons.paginate.fetch');        // updated      
Route::post('/admin/comparisons/save', [ComparisonController::class, 'store'])->name('comparisons.new');                          // updated 
Route::post('/admin/comparisons/sending-reminder', [ComparisonController::class, 'reminder'])->name('comparisons.reminder');                          // updated 
Route::get('/admin/comparisons/fetch-single/{id}', [ComparisonController::class, 'show'])->name('comparisons.show');             // updated    
Route::get('/admin/comparisons/viewing/{id}', [ComparisonController::class, 'showComparisons'])->name('comparisons.show');  // updated 
Route::post('/admin/comparison/quotation-save', [ComparisonController::class, 'quotationSave'])->name('comparisons.quotation.save');      // updated 
Route::post('/admin/comparison/update-status', [ComparisonController::class, 'updateStatus'])->name('comparison.update.status'); // updated
Route::post('/admin/comparison/detach-image', [ComparisonController::class, 'detachImage'])->name('detach.image');     
Route::post('/admin/comparisons/upload-images', [ComparisonController::class, 'uploadImages'])->name('comparisons.upload.images');      // updated 

Route::get('/requests/dashboard', [RequestController::class, 'dashboard'])->name('request.dashboard'); // updated - not complete
Route::get('/admin/request/fetch-onprocess/pendings', [RequestController::class, 'fetchAllOnProcess'])->name('request.fetch.fetch-pending'); // updated 

// Procurement
Route::get('/admin/request/procurement-fetch/{search}', [RequestController::class, 'requests_procurements'])->name('request.procurement.fetch.paginate'); // updated
Route::post('/admin/request/procurement/assigned', [RequestController::class, 'procurementAssigned'])->name('request.procurement.assign');              // updated

// Local Purchase Order - LPO 
 
Route::post('/admin/local-purchase-order/update-status', [LocalPurchaseOrderController::class, 'updateStatus'])->name('lpo.update.status'); // updated
Route::post('/admin/local-purchase-order/save', [LocalPurchaseOrderController::class, 'store'])->name('lpo.new'); // updated
Route::get('/admin/local-purchase-orders/fetch/{search}', [LocalPurchaseOrderController::class, 'fetch'])->name('lpo.fetch.items'); // updated 
Route::get('/admin/local-purchase-order/fetch-single/{id}', [LocalPurchaseOrderController::class, 'show'])->name('lpo.show'); // updated
Route::get('/admin/local-purchase-order/fetch-onprocess/pendings', [LocalPurchaseOrderController::class, 'fetchProcessStatus'])->name('lpo.fetch.onprocess'); // updated

Route::get('/admin/fetch/currency/list', [LocalPurchaseOrderController::class, 'fetchCurrencies'])->name('fetch.currencies'); // updated

// Payment Approval Form - PAF
// Route::post('/v/payment-approval-form/item-update', [PaymentApprovalFormController::class, 'updateItem'])->name('paf.item.update');
// Route::post('/v/payment-approval-form/paf-update', [PaymentApprovalFormController::class, 'updatePAF'])->name('paf.data.update'); 
Route::post('/admin/payment-approval-form/update-status', [PaymentApprovalFormController::class, 'updateStatus'])->name('paf.update.status'); // updated
Route::post('/admin/payment-approval-form/save', [PaymentApprovalFormController::class, 'store'])->name('paf.new'); // updated
// Route::post('/v/payment-approval-form/invoice-update', [PaymentApprovalFormController::class, 'pafClosed'])->name('paf.closed');
// Route::post('/v/payment-approval-form/filter/search', [PaymentApprovalFormController::class, 'filterSearch'])->name('paf.filter.search');

Route::get('/admin/payment-approval-form/fetch/{search}', [PaymentApprovalFormController::class, 'fetch'])->name('paf.fetch.items'); // updated
Route::get('/admin/payment-approval-form/fetch-single/{id}', [PaymentApprovalFormController::class, 'show'])->name('paf.show'); // updated

// Import Data
// Route::post('/v/suppliers/import', [SupplierController::class, 'import'])->name('import.supplier');
// Route::post('/v/companies/import', [CompanyController::class, 'import'])->name('import.company');
// Route::post('/v/locations/import', [LocationController::class, 'import'])->name('import.location');
// Route::post('/v/users/import', [UserController::class, 'import'])->name('import.users');
// Route::post('/v/departments/import', [DepartmentController::class, 'import'])->name('import.department');

// Reports
Route::post('/admin/generate/report/prf', [RequestController::class, 'reportTable'])->name('report.prf.table'); // updated
Route::post('/admin/generate/report/lpo', [LocalPurchaseOrderController::class, 'reportTable'])->name('report.lpo.table'); // updated 
Route::post('/admin/generate/report/paf', [PaymentApprovalFormController::class, 'reportTable'])->name('report.paf.table'); // updated
Route::post('/admin/report/business-report', [LocalPurchaseOrderController::class, 'fetchBusinessReport'])->name('report.business-report'); // updated
Route::post('/admin/report/statuses/counts', [UserController::class, 'fetchProcurement'])->name('report.statuses.counts'); // updated
Route::post('/admin/report/monthly/counts', [UserController::class, 'fetchProcurementMonthly'])->name('report.monthly.counts'); // updated
});
// CRONJOB
Route::get('/job/notification/procurement',  [RequestController::class, 'cronJobReminderNotification'])->name('cron.job.notification');
Route::get('/file/{path}',  [RequestController::class, 'showFile'])->name('file.show');
Route::get('/suppliers/add-quotation',  function () { return view('layouts.home'); });  

Route::get('/supplier/quotation/fetch-single', [FeedbackController::class, 'show'])->name('quotation.supplier.show');  
Route::post('/supplier/quotation/save', [FeedbackController::class, 'store'])->name('quotation.supplier.new');  
Route::get('/file/quotations/{path}',  [FeedbackController::class, 'showFile'])->name('file.show');