<?php
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\FeedbackController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/
 
Route::get('/data/comparisons/auto-closed', [FeedbackController::class, 'closeComparison'])->name('auto.close.comparisons');
Route::get('/data/master-files/view-file', [FeedbackController::class, 'viewFile'])->name('view.files');
Route::middleware('auth:sanctum')->get('/user', function (Request $request) { 
        return $request->user(); 
});