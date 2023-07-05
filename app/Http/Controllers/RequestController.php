<?php

namespace App\Http\Controllers;

//use Swift_Mailer;
use App\Models\Requests;
use App\Jobs\CancelRequest;
//use Swift_SmtpTransport;
use App\Models\RequestItem;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Jobs\RecipientMailJob;
use Illuminate\Support\Carbon;
use App\Jobs\ReminderNotification;
use App\Jobs\RequestToProcurement;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use App\Models\Local_purchase_order;
use Illuminate\Support\Facades\Storage;
use App\Jobs\RequestAssignToProcurement;
use Intervention\Image\Facades\Image as Img;

class RequestController extends Controller
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
     
    public function fetch($search=null, $status=null, $orderBy=null)
    {  
        $loggedUser = auth()->user();
        $id = $loggedUser->id;
        
        $field = 'id';
        $sort = "desc";

        if($orderBy !== '-'){
            $orderBy = explode(",", $orderBy);
            $field = $orderBy[0];
            $sort = $orderBy[1];
        }
        
        $searchData = array();
    
        if($status && $status !== '-'){
            $searchData = array('status' => $status);
        }
      
        if($id == 261 || $id == 82 || $id == 19 || $id == 258 || $id == 304){
            $where = ['user_id' => '261','user_id' => '82','user_id' => '19','user_id' => '258','user_id' => '304'];
            $itOnly = true;
        }else{
            $where = ['user_id' => $id];
            $itOnly = false;
        }
        
        if($search !== '-'){
            
           $data = Requests::where(function ($q) use ($itOnly,$id){
                if($itOnly){
                $q->where('user_id',"=",$id) 
                    ->orWhere('user_id',"=", 261)->orWhere('user_id',"=", 82)
                    ->orWhere('user_id',"=", 19)->orWhere('user_id',"=", 304)->orWhere('user_id',"=", 258);
                }else{
                    $q->where('user_id',"=",$id);
                }
            })->where(function ($q) use ($search){
                $q->where("subject", "LIKE", "%".$search."%")->orWhere("prf_no", "LIKE", "%".$search."%")->orWhere("status", "LIKE", "%".$search."%");
            })->orWhereHas('profile', function ($q) use ($search){
                $q->where("name", "LIKE", "%".$search."%");  
            })->orWhereHas('company', function ($q) use ($search){
                $q->where("title", "LIKE", "%".$search."%");  
            })->with("company","location","process_by", "profile")->orderBy($field, $sort)->paginate(10);
        }else{
          
            if($id == 304 ){
                $data = Requests::where($searchData)->where( function($query)  use ($id){
                    $query->where('user_id',"=",$id) 
                    ->orWhere('user_id',"=", 261)->orWhere('user_id',"=", 82)
                    ->orWhere('user_id',"=", 19)->orWhere('user_id',"=", 258);
                })->with("company","location","process_by", "profile")->orderBy($field, $sort)->paginate(10); 
            }elseif($id == 258 ){
                $data = Requests::where($searchData)->where( function($query)  use ($id){
                    $query->where('user_id',"=",$id) 
                    ->orWhere('user_id',"=", 261)->orWhere('user_id',"=", 82)
                    ->orWhere('user_id',"=", 19)->orWhere('user_id',"=", 304);
                })->with("company","location","process_by", "profile")->orderBy($field, $sort)->paginate(10); 
            }elseif($id == 261 ){
               
                $data = Requests::where($searchData)->where( function($query)  use ($id){
                    $query->where('user_id',"=",$id) 
                    ->orWhere('user_id',"=", 258)->orWhere('user_id',"=", 82)
                    ->orWhere('user_id',"=", 19)->orWhere('user_id',"=", 304);
                })->with("company","location","process_by", "profile")->orderBy($field, $sort)->paginate(10); 
            }elseif(($id == 333 || $id == 249 ) ){
                $data = Requests::where($searchData)->where( function($query)  use ($id){
                    $query->where('user_id',"=",$id)
                    ->orWhere('user_id',"=", 304)->orWhere('user_id',"=", 258)
                    ->orWhere('user_id',"=", 261)->orWhere('user_id',"=", 82)
                    ->orWhere('user_id',"=", 19);
                })->with("company","location","process_by", "profile")->orderBy($field, $sort)->paginate(10); 
            }else{             
                $data = Requests::where('user_id',"=",$id)->where($searchData)->with("company","location","process_by", "profile")->orderBy($field, $sort)->paginate(10); 
            }
        }
        return response()->json(  $data  , 200); 
    } 

    public function fetchAllOnProcess()
    {  
        
        $data = Requests::where('status',"=",'onprocess')->with("company","location")->orderBy("prf_no", "desc")->get(); 
       
        return response()->json($data, 200); 
    } 
    
       public function requestDetachImage(Request $request){
        $data = Requests::where('id', $request['id'])->first();
        
        $data->images()->detach($request['image_id']);

        return response()->json([
            'success' => true,
            'msg' => 'Attachment has been removed', 
        ], 200);
    }

    public function requests_procurements(Request $request,$search=null)
    {   

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
          
                $data = Requests::where(function ($q) use ($search){
                    $q->where("subject", "LIKE", "%".$search."%")->orWhere("prf_no", "LIKE", "%".$search."%")->orWhere("details", "LIKE", "%".$search."%");
                })->with("company","location","process_by", "profile", 'items')->orderBy($field, $sort)->paginate(10);
            
        }else{
            if(@$request['company_id']){
                $searchData = array_merge($searchData, array('company_id' => $request['company_id']));
            }
            if(@$request['status']){
                $searchData = array_merge($searchData,array('status' => $request['status']));
            }
            if(@$request['process_by'] ){
                if($request['process_by'] !== 'unassign'){
                    $searchData =  array_merge($searchData,array('process_by' => $request['process_by']));
                }else{
                    $searchData =  array_merge($searchData,array('process_by' => null));
                }
            }
            if(@$request['user_id']){
                $searchData =  array_merge($searchData,array('user_id' => $request['user_id']));
            }
           
            $data = Requests::where($searchData)->with("company","location","process_by", "profile", 'items')->orderBy($field, $sort)->paginate(10);
        }
     
        
        return response()->json( $data, 200); 
    } 

    public function dashboard(){
        $loggedUser = auth()->user();
        
        $userID = $loggedUser->id;
        $id = $userID; 
        
      
        if($userID == 304 ){
            // leslie - 304
            // jeff - 258
            // jerico - 261
            // arnel - 82
            // abe - 19
          
            $data = Requests::where('user_id', "=",$id)->orWhere('user_id',"=", 258)->orWhere('user_id',"=", 261)->orWhere('user_id',"=", 82)->orWhere('user_id',"=", 19)->with("company","location","process_by", "profile")->orderBy("updated_at", "desc")->take(10)->get();
            $pending =  Requests::where(function($q) use ($id){
                $q->where('user_id' ,"=", $id) 
                ->orWhere('user_id' ,"=", 258)
                ->orWhere('user_id' ,"=", 261)
                ->orWhere('user_id' ,"=", 82)
                ->orWhere('user_id' ,"=", 19);
            })->where("status", "=", "pending")->get(); 
            $onhold =  Requests::where(function($q) use ($id){
                $q->where('user_id' ,"=", $id) 
                ->orWhere('user_id' ,"=", 258)
                ->orWhere('user_id' ,"=", 261)
                ->orWhere('user_id' ,"=", 82)
                ->orWhere('user_id' ,"=", 19);
            })->where("status", "=", "onhold")->get(); 
            $processed = Requests::where(function($q) use ($id){
                $q->where('user_id' ,"=", $id) 
                ->orWhere('user_id' ,"=", 258)
                ->orWhere('user_id' ,"=", 261)
                ->orWhere('user_id' ,"=", 82)
                ->orWhere('user_id' ,"=", 19);
            })->where("status", "=", "onprocess")->get(); 
            $newRequest =  Requests::where(function($q) use ($id){
                $q->where('user_id' ,"=", $id) 
                ->orWhere('user_id' ,"=", 258)
                ->orWhere('user_id' ,"=", 261)
                ->orWhere('user_id' ,"=", 82)
                ->orWhere('user_id' ,"=", 19);
            })->whereDate( "created_at" , Carbon::today())->get(); 
            $closed =  Requests::where(function($q) use ($id){
                $q->where('user_id' ,"=", $id) 
                ->orWhere('user_id' ,"=", 258)
                ->orWhere('user_id' ,"=", 261)
                ->orWhere('user_id' ,"=", 82)
                ->orWhere('user_id' ,"=", 19);
            })->where("status", "=", "closed")->get(); 
            $totalRequest = Requests::where(function($q) use ($id){
                $q->where('user_id' ,"=", $id) 
                ->orWhere('user_id' ,"=", 258)
                ->orWhere('user_id' ,"=", 261)
                ->orWhere('user_id' ,"=", 82)
                ->orWhere('user_id' ,"=", 19);
            })->where("status", "!=", "cancelled")->get(); 
        }elseif($userID == 333 || $userID == 249){
            // jeff - 258
            // jerico - 261
            // arnel - 82
            // abe - 19
         
            $data = Requests::where('user_id', "=",$id)->orWhere('user_id',"=", 304)->orWhere('user_id',"=", 258)->orWhere('user_id',"=", 261)->orWhere('user_id',"=", 82)->orWhere('user_id',"=", 19)->with("company","location","process_by", "profile")->orderBy("updated_at", "desc")->take(10)->get();
            $pending =  Requests::where(function($q) use ($id){
                $q->where('user_id' ,"=", $id)
                ->orWhere('user_id' ,"=", 304)
                ->orWhere('user_id' ,"=", 258)
                ->orWhere('user_id' ,"=", 261)
                ->orWhere('user_id' ,"=", 82)
                ->orWhere('user_id' ,"=", 19);
            })->where("status", "=", "pending")->get(); 
            $onhold =  Requests::where(function($q) use ($id){
                $q->where('user_id' ,"=", $id)
                ->orWhere('user_id' ,"=", 304)
                ->orWhere('user_id' ,"=", 258)
                ->orWhere('user_id' ,"=", 261)
                ->orWhere('user_id' ,"=", 82)
                ->orWhere('user_id' ,"=", 19);
            })->where("status", "=", "onhold")->get(); 
            $processed = Requests::where(function($q) use ($id){
                $q->where('user_id' ,"=", $id)
                ->orWhere('user_id' ,"=", 304)
                ->orWhere('user_id' ,"=", 258)
                ->orWhere('user_id' ,"=", 261)
                ->orWhere('user_id' ,"=", 82)
                ->orWhere('user_id' ,"=", 19);
            })->where("status", "=", "onprocess")->get(); 
            $newRequest =  Requests::where(function($q) use ($id){
                $q->where('user_id' ,"=", $id)
                ->orWhere('user_id' ,"=", 304)
                ->orWhere('user_id' ,"=", 258)
                ->orWhere('user_id' ,"=", 261)
                ->orWhere('user_id' ,"=", 82)
                ->orWhere('user_id' ,"=", 19);
            })->whereDate( "created_at" , Carbon::today())->get(); 
            $closed =  Requests::where(function($q) use ($id){
                $q->where('user_id' ,"=", $id)
                ->orWhere('user_id' ,"=", 304)
                ->orWhere('user_id' ,"=", 258)
                ->orWhere('user_id' ,"=", 261)
                ->orWhere('user_id' ,"=", 82)
                ->orWhere('user_id' ,"=", 19);
            })->where("status", "=", "closed")->get(); 
            $totalRequest = Requests::where(function($q) use ($id){
                $q->where('user_id' ,"=", $id)
                ->orWhere('user_id' ,"=", 304)
                ->orWhere('user_id' ,"=", 258)
                ->orWhere('user_id' ,"=", 261)
                ->orWhere('user_id' ,"=", 82)
                ->orWhere('user_id' ,"=", 19);
            })->where("status", "!=", "cancelled")->get(); 
        }elseif($loggedUser->role == 'normal'){
          
            $data = Requests::where('user_id',"=",$id)->with("company","location","process_by", "profile")->orderBy("updated_at", "desc")->take(10)->get();
            $pending = Requests::where(['user_id' => $id, "status" => "pending"])->get(); 
            $onhold =  Requests::where(['user_id' => $id])->where("status", "=", "onhold")->get(); 
            $processed = Requests::where(['user_id' => $id, "status" => "onprocess"])->get(); 
            $newRequest = Requests::where(['user_id' => $id])->whereDate( "created_at" , Carbon::today())->get(); 
            $closed = Requests::where(['user_id' => $id, "status" => "closed"])->get(); 
            $totalRequest = Requests::where(['user_id' => $id])->where("status", "!=", "cancelled")->get(); 
        }else{
           
            $data = Requests::with("company","location","process_by", "profile")->orderBy("updated_at", "desc")->take(10)->get();
            $pending = Requests::where([ "status" => "pending"])->get(); 
            $processed = Requests::where([ "status" => "onprocess"])->get(); 
            $onhold =  Requests::where([ "status" => "onhold"])->get(); 
            $newRequest = Requests::whereDate( "created_at" , Carbon::today())->get(); 
            $closed = Requests::where([ "status" => "closed"])->get(); 
            $totalRequest = Requests::where( "status", "!=", "cancelled")->get();
        }

        $pendingCount = $pending->count();
        $processedCount = $processed->count();
        $newCount = $newRequest->count();
        $holdCount = $onhold->count();
        $totalCount = $totalRequest->count();
        $closedCount = $closed->count();
        return response()->json([
            'item'     =>$data,
            'pending' => $pendingCount,
            'process' => $processedCount,
            'hold'  => $holdCount,
            'new'     => $newCount,
            'closed'    => $closedCount,
            'totalcount' => $totalCount
        ], 200); 
    }  

    public function requestorFilterStatus(Request $request){ 
        if($request['data']){ 
            $data = Requests::where($request['data'])->with("company","location","process_by", "profile")->paginate(10);
          
        }else{
            $data = Requests::with("company","location","process_by", "profile")->orderBy("updated_at", "desc")->paginate(10); 
        }

        return response()->json([
            'item' => $data 
        ], 200); 
    } 

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $success = true;
        $have_recipient = false;
        $responseCode = 200;
        $id = '';
        $data = array(); 
        $rabbitArray = array();

        if(@$request['requestObj']){
            $post = json_decode($request['requestObj']);
            $post = (array) $post;

            $ObjToArrayData = array();
            if($post['items']){
                foreach($post['items'] AS $k => $v){
                    $ObjToArrayData[] = array('description' => $v->description, 'qty' => $v->qty, 'uom' => $v->uom);
                }
                $post['items'] = $ObjToArrayData;
            }
        }else{
            $post = $request['data'];
            $post['items'] = $request['items'];
        }
        
        $loggedUser = auth()->user();
        $userId = $loggedUser->id;
        if(!$post){
            return response()->json([
                'success' => false,
                'msg' => 'Invalid Submission! kindly contact Administrator.', 
            ], 500);
        }
        if(@$post['id']){
            $newData = array(
                "company_id"    => $post['company_id'],
                "location_id"   => $post['location_id'],
                "subject"       => $post['subject'],
                "status"        => $post['status'],
                "details"       => $post['details'],
                "user_id"       => $userId, 
        ); 
        }else{
            $newData = array( 
                    "urgency"       => $post['urgency'],
                    "company_id"    => $post['company_id'],
                    "location_id"   => $post['location_id'],
                    "subject"       => $post['subject'],
                    "status"        => "pending",
                    "details"       => $post['details'],
                    "recipients"    => @$post['recipients'] ? $post['recipients'] : '',
                    "user_id"       => $userId,
                    "created_at"    => Carbon::now()
            ); 
        }
      
        DB::beginTransaction();
        // do all your updates here
        try {
            
            if(@$post['id']){
                
                $data = Requests::where('id', '=', $post['id'])->first();  
                $data->update($newData);
                $id = $request['id']; 

                if($post['items']){ 
                    $data->items()->delete();
                    $data->items()->createMany($post['items']); 
               
               
                    foreach($post['items'] AS $k => $v){
                        $locArray = array(
                            'request_id' => $id,
                            'description' => $v['description'],
                            'qty' => $v['qty'],
                            'uom' => $v['uom'], 
                        );
                        RequestItem::updateOrCreate([
                            'id' => @$v['id'],
                            'request_id' => $id,
                        ], $locArray);

                    } 
                }
                $status = 'updated';
                $stats = $post['status'];
                $id = $post['id'];
                $prfNo = $data['prf_no'];
               
            }else{
                $result = Requests::create($newData); 
                $id = $result['id']; 

                $data = Requests::where('id', '=', $id)->first();  
               
                $curYear = Carbon::now()->format('Y');
                $prfNo = $this->pad( $id, 6 );
                $prfNo = "PRF-".$curYear.$prfNo;

                $data->update(array("prf_no" => $prfNo));

                $data->items()->createMany($post['items']); 
                $status = 'new';
                $stats = 'pending';
            }
            if(request()->file('file')){
                // upload image
                $fileArray = array();
                $uploadDate = Carbon::now()->format('YmdHis');
                $files = Collection::wrap(request()->file('file'));
                $userStorage = '/uploads';
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

                    if($extn == 'pdf' || $extn == 'PDF'){
                        $file->move($userStorageDir, $path);
                    }else{
                    // File Optimization
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
                        'types' => 'request',
                        'mime' => $mime,
                        'user_id' => auth()->id(),
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
                    $data->images()->attach($idsToSync);
                } 
            }

            $fileArray = array();
           
            $arrDetail = array(  
                "prf_no" => $prfNo, 
                "urgency"       => $post['urgency'],
                "company_id"    => $post['company_id'],
                "location_id"   => $post['location_id'],
                "subject"       => $post['subject'],
                "status"        => $stats,
                "details"       => $post['details'],
                "recipients"    => @$post['recipients'] ? $post['recipients'] : '',
                "user_id"       => $userId,
                "created_at"    => Carbon::now()
            );
            $data->logs()->create([
                'user_id' => $userId,
                'log_type' => $status,
                'details' => json_encode($arrDetail)
            ]);
            if(@$post['id']){
                $msg = "Request has been updated!";  
            }else{
                $msg = "New request has been created!";  
                    //jacob@gagroup.net
                    $emails = 'jacob@gagroup.net';
                    $details = array("prf_no" => $prfNo, 'data' => $post['details'], 'user_id' => $userId);
                    $rabbitArray = array("details" => $details, "email" => $emails, "subject" => "New Request");
                    
                    if(@$post['recipients']){
                        $have_recipient = true;
                        $recipients_email = str_replace(' ', '', $post['recipients']);  
                        $recipients_message = "Dear, 

Your request has been forwarded to Procurement Team, 
Normal requests: Will take at least 14 working days.
Project requests: Will take at least 2 months.";
                        $recipients_data = array("email" => $recipients_email, "details" => $details, "message" => $recipients_message, "subject" => "Requested to Procurement Team");
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
        
        if($success){
                try{
                    if(@$post['id']){}else{
                        // $transport = new Swift_SmtpTransport('smtp.office365.com', '587', 'tls');
                        // $transport->setUsername('GAGWebService@gagroup.net');
                        // $transport->setPassword('G4@Sf4V52zY46$4T6du');
                        // $mailer = new Swift_Mailer($transport);
                        // $mailer->getTransport()->start();
                       // RequestToProcurement::dispatchAfterResponse($rabbitArray);
                    }
                    if($have_recipient){
                     //   RecipientMailJob::dispatchAfterResponse($recipients_data);
                    }
                }  catch (Exception $e) {
                    $msg = 'Request has been '.$request['type'] .' But Email notification has not been sent!';
                }
            }

        return response()->json([
            'success' => $success,
            'msg' => $msg,
            'id' => $id,
        ], $responseCode);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $data = Requests::where('id', '=', $id)->with("company","location","process_by", "profile", "images", 'items')->first(); 

        return response()->json([
            'item' => $data 
        ], 200); 
    }

    public function updateStatus(Request $request){
        
        $data = Requests::where('id', '=', $request['id'])->first();
        $item = array("status" => $request['type']);
        $data->update($item);
       
         $data->logs()->create([
            'user_id' => auth()->id(),
            'log_type' => 'change_status',
            'details' => json_encode($item)
        ]);
         
        $msg = 'Request has been '.$request['type'];
        if($request['type'] == 'closed'){ 
            $lpoUpdate = Local_purchase_order::where('request_id', '=', $request['id'])->first();
            $lpoUpdate->update($item); 

        }elseif($request['type'] == 'cancelled'){ 
            $ID = auth()->id();
           
             $emails = 'jacob@gagroup.net';
             $rabbitArray = array("details" => $data, 'cancelledBy' => $ID, "email" => $emails, "subject" => "Request Cancelled");
             
             if($data){
                try{
                    // $transport = new Swift_SmtpTransport('smtp.office365.com', '587', 'tls');
                    // $transport->setUsername('GAGWebService@gagroup.net');
                    // $transport->setPassword('G4@Sf4V52zY46$4T6du');
                    // $mailer = new Swift_Mailer($transport);
                    // $mailer->getTransport()->start();
                   // CancelRequest::dispatch($rabbitArray);
                }  catch (Exception $e) {
                    $msg = 'Request has been '.$request['type'] .' But Email notification has not been sent!';
                }
            } 
        } 

        return response()->json([
            'status' => true,
            'message' => $msg
        ], 200); 
    }

    public function procurementAssigned(Request $request){
        $data = Requests::where('id', '=', $request['id'])->first();
        $processedBy = $request['process_by'];
        if($request['process_by'] == 'unassign'){
            $processedBy = NULL;
        }
        $item = array("process_by" => $processedBy);
        $data->update($item);
       
        $arrDetail = array( "process_by" => $processedBy,
                            "created_at"    => Carbon::now()
                        );
        $data->logs()->create([
            'user_id' => auth()->id(),
            'log_type' => 'assign',
            'details' => json_encode($arrDetail)
        ]);
        
        $details = array("prf_no" => $data['prf_no'], 'user_id' => $request['process_by']);
        $rabbitArray = array("details" => $details, "subject" => "Request Assigned");
       
        if($data){
            try{
                if($processedBy){ 
                    // $transport = new Swift_SmtpTransport('smtp.office365.com', '587', 'tls');
                    // $transport->setUsername('GAGWebService@gagroup.net');
                    // $transport->setPassword('G4@Sf4V52zY46$4T6du');
                    // $mailer = new Swift_Mailer($transport);
                    // $mailer->getTransport()->start();
                 //   RequestAssignToProcurement::dispatch($rabbitArray);
                }
            }  catch (Exception $e) {
                $msg = "Request has been assigned! But Email notification has not been sent!"; 
            }
        }
        
        $msg = 'Request has been assigned!';

        return response()->json([
            'status' => true,
            'message' => $msg
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
            if($ext == 'mp4'){
                $fileUrl = 'videos/'.$path;
            }else{
                $fileUrl = storage_path(). '/app/uploads/'.$path;
            }
            return response()->file($fileUrl, array('Content-Type' => $mime_type));
        }else{
            return abort('403');
        }
    }

    function pad($num, $size){
        return substr(str_repeat(0, $size).$num, - $size);
    }

    function reportTable(Request $request){
       
        $filter = $request['daterange'];
        
        $fromDate = $filter['from'];
        $toDate = $filter['to'];
        
        $dataSearch = $request['data'];
       
        $data = Requests::whereBetween('created_at', [$fromDate, $toDate])->where($dataSearch) 
        ->with("location","process_by", "profile", "company",'items')->orderBy("created_at", "asc")->get();

        return response()->json($data , 200);
    }

    function cronJobReminderNotification(){
        $query = Requests::where( function($q) { 
            $q->where('status', '!=', 'closed')->where('status', '!=', 'cancelled')->where('status', '!=', 'onhold');
        })->where('created_at', '<=', Carbon::now()->subDays(3)->toDateTimeString())->with('profile', 'processed_by', 'company')
        ->get();
       
        $newArray = array();
        if($query){
            foreach($query AS $k => $v){
                $newArray[] = array(
                    'prf_no'        => $v->prf_no,
                    'company'       => $v->company->title,
                    'profile'       => $v->profile->name,
                    'process_by'    => $v->processed_by ? $v->processed_by->name : '',
                    'request_date'  => $v->created_at
                );
            }

           $rabbitArray = array("details" => $newArray, 'email' => 'jacob@gagroup.net');
         //  ReminderNotification::dispatch($rabbitArray);
        }
      
        return;
    }
}