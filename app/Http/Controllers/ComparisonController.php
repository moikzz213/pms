<?php
namespace App\Http\Controllers;

use App\Models\Supplier; 
use App\Models\Comparison;
use App\Jobs\ComparisonsJob;
use Illuminate\Http\Request;
use App\Models\ComparisonItem;
use Illuminate\Support\Carbon; 
use App\Models\FeedbackDiscount;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use App\Helper\GlobalFunction;
 

class ComparisonController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */

     public function __construct()
     {
         $this->middleware('auth');
     } 
     
    public function fetch(Request $request,$search=null)
    {  
       
        $loggedUser = auth()->user();
        $id = $loggedUser->id;

        $field = 'updated_at';
         $sort = "desc";
         $orderBy = $request['sort'];
         
        if($orderBy){
             $orderBy = explode(",", $orderBy);
           
             $field = $orderBy[0];
             $sort = $orderBy[1];
        }
        $searchData = array();
         
        if($search && $search !== '-'){
           
            $data = Comparison::where("title", "LIKE", "%".$search."%")->with('company', 'processedBy', 'quotation_total_amount')->paginate(10);
             
         }else{
            if(@$request['company_id']){
                $searchData = array_merge($searchData, array('company_id' => $request['company_id']));
            }
            if(@$request['status']){
                $searchData = array_merge($searchData,array('status' => $request['status']));
            }
           
            if(@$request['process_by']){
                $searchData =  array_merge($searchData,array('user_id' => $request['process_by']));
            }
            
            $data = Comparison::where($searchData)->with('company', 'processedBy', 'quotation_total_amount')->orderBy($field, $sort)->paginate(10);
         } 
         return response()->json( $data, 200); 
    }  

    public function store(Request $request){
        $success = true;
        $responseCode = 200;
        $id = '';
        $data = array();   
        DB::beginTransaction();
        // do all your updates here
        try { 
            
            if(@$request['id']){ 
                 
                $result = Comparison::find($request['id']);
                $id = $request['id']; 

                foreach($request['items'] AS $k => $v){
                    $locArray = array(
                        'comparison_id' => $id,
                        'description' => $v['description'],
                        'qty' => $v['qty'],
                        'uom' => $v['uom'],
                        'category_id' => @$v['category_id'],
                        'previous_amount' => @$v['previous_amount']
                    );
                    ComparisonItem::updateOrCreate([
                        'id' => @$v['id'],
                        'comparison_id' => $id,
                    ], $locArray);

                } 
                 
                $result->update($request['data']);

                $result->comparison_approvals()->delete();
                $result->comparison_approvals()->createMany($request['approvers']);
                $logType = 'update';
                $msg = "Comparison has been updated!"; 
            }else{
                $nData = array_merge($request['data'], array('user_id' => auth()->id(), 'status' => 'onprocess'));
                $result = Comparison::create($nData);
                $id = $result['id']; 
                $result->items()->createMany($request['items']); 

                $result->comparison_approvals()->createMany($request['approvers']);
                

                $logType = 'new';
                $msg = "New Comparison has been created!"; 
            }
           
            $result->suppliers()->detach();
            $result->suppliers()->sync( $request['suppliers'] );
            

            $arrDetail = array(  array($request['data']), array($request['items']) );
            $result->logs()->create([
                'user_id' => auth()->id(),
                'log_type' => $logType,
                'details' => json_encode($arrDetail)
            ]); 

            if($success){
                $result = Supplier::whereIn('id', $request['suppliers'])->get();
               
                $result = $result->toArray();
                $emails = array();
                $ids = array();
                if($request['notification']){
                        if($result && count($result) > 0){
                            foreach($result AS $k => $v){
                                if(filter_var( $v['email'], FILTER_VALIDATE_EMAIL)){
                                
                                    $emails[$k] = $v['email'];
                                    $ids[$k] = $v['id'];
                                }
                            } 
                        }
                    
                        if($emails && count($emails) > 0){
            $details = array("id" => $id,"email" => $emails,'supplierID' => $ids, 'title' => $request['data']['title'], 'items' => $request['items'], 'subject' => 'Request for Quotation', 
            'message' => 'Dears,
    Kindly find the request Items/Licenses/Services through our System from the link below.
    Much appreciated if you could provide the soonest.
            '); 
        
                        ComparisonsJob::dispatchAfterResponse($details);
                        }
                    }
            }
          
            DB::commit();
            
        } catch (\Exception $e) {
            DB::rollback();
            dd($e);
            $success = false;
            $msg = "Error: Failed to add the data!";
            $responseCode = 500;
        } 
       
        return response()->json([
            'success' => $success,
            'message' => $msg,
            'id' => $id, 
        ], $responseCode);
    }

    public function uploadImages(Request $request){
        $request = json_decode($request['requestObj']);
        $request = (array) $request;
        $result = Comparison::find($request['id']); 
    
        $images = request()->file('file');
        $foo = new GlobalFunction();
        $rs = $foo->globalUploadImages($result, 'comparisons', $images, 'attach'); // attach or sync
        $success = true;
        $responseCode = 200;
        $msg = 'Image has been uploaded';
        if(!$rs){
            $responseCode = 500;
            $success = false;
            $msg = 'Error uploading image(s)';
        }

        return response()->json([
            'success' => $success,
            'message' => $msg,
            'id' => $request['id'], 
        ], $responseCode);
    }

    public function reminder(Request $request){
        $success = true;
        $responseCode = 200;
        $id = '';
        $data = array();   
        DB::beginTransaction();
        // do all your updates here
        try {  
                 
            $result = Comparison::find($request['id']); 
            $id = $request['id'];
            $result->logs()->create([
                'user_id' => auth()->id(),
                'log_type' => 'reminder',
                'details' => json_encode($result)
            ]); 
            $msg = "Mail has been sent to suppliers";
            if($success){
                
                $emails = array();
                $ids = array();
               
                        if($request['suppliers'] && count($request['suppliers']) > 0){
                            foreach($request['suppliers'] AS $k => $v){
                                if(filter_var( $v['email'], FILTER_VALIDATE_EMAIL)){
                                
                                    $emails[$k] = $v['email'];
                                    $ids[$k] = $v['id'];
                                }
                            } 
                        }
                    
                        if($emails && count($emails) > 0){
            $details = array("id" => $id,"email" => $emails,'supplierID' => $ids, 'title' => $request['data']['title'], 'items' => $request['items'], 'subject' => 'Reminder: Request for Quotation', 
            'message' => 'Dears,
    A kind reminder,
    Kindly find the request Items/Licenses/Services through our System from the link below.
    Much appreciated if you could provide the soonest.
            '); 
                        ComparisonsJob::dispatchAfterResponse($details);
                        }
                    
            }
          
            DB::commit();
            
        } catch (\Exception $e) {
            DB::rollback();
            dd($e);
            $success = false;
            $msg = "Error: Failed to add the data!";
            $responseCode = 500;
        } 
       
        return response()->json([
            'success' => $success,
            'message' => $msg,
            'id' => $id, 
        ], $responseCode);
    }
    public function show($id){
        $result = Comparison::where('id', '=', $id)->with('images','items.category', 'company', 'department', 'suppliers.quotations','comparison_approvals.profile')->first(); 
        return response()->json([
            'item' => $result 
        ], 200); 
    }

    public function quotationSave(Request $request){
        if($request['eval']){
            $result = Comparison::where('id', '=', $request['id'])->first();
            $result->update(['evaluation' => $request['eval']]);
        }
        
        $feedback = array();
     
        if($request['items'] && count($request['items']) > 0){
            foreach($request['items'] AS $k => $v){
                if(!$v['delivery'] && !$v['payment_term'] && !$v['recommendation'] && !$v['remarks'] && !$v['remarks_optional']){

                }else{
                    $feedback[$k] = $v;
                }
            }
        }
        if($feedback && count($feedback) > 0){
            foreach ($feedback as $k => $v) {
                $rs = FeedbackDiscount::where('id',$v['id'])->first();
                $rs->update(array( 
                    "delivery" => $v['delivery'],
                    "payment_term" => $v['payment_term'],
                    "recommendation" => $v['recommendation'],
                    "remarks" => $v['remarks'],
                    "status"   => 'pending',
                    "remarks_optional" => "2")
                );
            } 
        }
        if($request['selected']){
            $rs = FeedbackDiscount::where('id',$request['selected'])->first();
                $rs->update(array(  
                    "status"   => 'selected')
                );
        }

        return response()->json([
            'message' => 'Comparison has been updated' 
        ], 200);
    }

    public function detachImage(Request $request){
        $data = Comparison::where('id', $request['id'])->first();
        
        $data->images()->detach($request['image_id']);

        return response()->json([
            'success' => true,
            'msg' => 'Attachment has been removed', 
        ], 200);
    }

    public function showComparisons($id){
        $result = Comparison::where('id', '=', $id)->with('items.category', 'company', 'department','comparison_approvals.profile')
        ->with('suppliers', function ($q) use ($id) {
            $q->with('quotations', function ($qq) use ($id) {
                $qq->where('feedback.comparison_id','=', $id);
            })->with('netamount', function ($qq) use ($id) {
                $qq->where('feedback_discounts.comparison_id','=', $id)->with('images');
            });
        })->first(); 
        return response()->json([
            'item' => $result 
        ], 200); 
    }

    public function updateStatus(Request $request){
        $data = Comparison::where('id', '=', $request['id'])->first();
        $item = array("status" => $request['type']); 
        $data->update($item); 

        $data->logs()->create([
            'user_id' => auth()->id(),
            'log_type' => 'change_status',
            'details' => json_encode($item)
        ]);
         
        $msg = 'Comparison has been '.$request['type'];

        return response()->json([
            'status' => true,
            'message' => $msg
        ], 200);
    }
}