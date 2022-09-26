<?php

namespace App\Http\Controllers;

use Swift_Mailer;
use App\Models\Image;
use App\Models\Requests;
use Swift_SmtpTransport;
use App\Jobs\CancelRequest;
use App\Jobs\RecipientMailJob;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use App\Jobs\ReminderNotification;
use App\Jobs\RequestToProcurement;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use App\Jobs\RequestAssignToProcurement;
use Laravel\Sanctum\PersonalAccessToken;
use Intervention\Image\Facades\Image as Img;

class RequestController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function fetch(Request $request, $token)
    {  
        $token = PersonalAccessToken::findToken($token);
        $user = $token->tokenable;
        
        $id = $user->id;
        
        $searchData = array();
        if(@$request['company_id']){
            $searchData = array_merge($searchData, array('company_id' => $request['company_id']));
        }
        if(@$request['status']){
            $searchData = array_merge($searchData,array('status' => $request['status']));
        }
        if(@$request['process_by']){
            $searchData =  array_merge($searchData,array('process_by' => $request['process_by']));
        }
        if(@$request['user_id']){
            $searchData =  array_merge($searchData,array('user_id' => $request['user_id']));
        }

        if($id == 304){
            $data = Requests::where($searchData)->where( function($query)  use ($id){
                $query->where('user_id',"=",$id) 
                ->orWhere('user_id',"=", 261)->orWhere('user_id',"=", 82)
                ->orWhere('user_id',"=", 19)->orWhere('user_id',"=", 258);
            })->with("company","location","process_by", "profile")->orderBy("updated_at", "desc")->paginate(10); 
        }elseif($id == 258){
            $data = Requests::where($searchData)->where( function($query)  use ($id){
                $query->where('user_id',"=",$id) 
                ->orWhere('user_id',"=", 261)->orWhere('user_id',"=", 82)
                ->orWhere('user_id',"=", 19)->orWhere('user_id',"=", 304);
            })->with("company","location","process_by", "profile")->orderBy("updated_at", "desc")->paginate(10); 
        }elseif($id == 261){
            $data = Requests::where($searchData)->where( function($query)  use ($id){
                $query->where('user_id',"=",$id) 
                ->orWhere('user_id',"=", 258)->orWhere('user_id',"=", 82)
                ->orWhere('user_id',"=", 19)->orWhere('user_id',"=", 304);
            })->with("company","location","process_by", "profile")->orderBy("updated_at", "desc")->paginate(10); 
        }elseif($id == 333 || $id == 249){
            $data = Requests::where($searchData)->where( function($query)  use ($id){
                $query->where('user_id',"=",$id)
                ->orWhere('user_id',"=", 304)->orWhere('user_id',"=", 258)
                ->orWhere('user_id',"=", 261)->orWhere('user_id',"=", 82)
                ->orWhere('user_id',"=", 19);
            })->with("company","location","process_by", "profile")->orderBy("updated_at", "desc")->paginate(10); 
        }else{
             
            $data = Requests::where('user_id',"=",$id)->where($searchData)->with("company","location","process_by", "profile")->orderBy("updated_at", "desc")->paginate(10); 
        }
        return response()->json([
            'item' => $data 
        ], 200); 
    } 

    public function fetchAllOnProcess()
    {  
        
        $data = Requests::where('status',"=",'onprocess')->with("company","location")->orderBy("prf_no", "desc")->get(); 
       
        return response()->json([
            'item' => $data 
        ], 200); 
    } 

    public function requests_procurements(Request $request)
    {  
        $searchData = array();
        if($request['process_by'] == 'unassign'){
            $searchData = 'process_by';
        }else{
            if(@$request['company_id']){
                $searchData = array_merge($searchData, array('company_id' => $request['company_id']));
            }
            if(@$request['status']){
                $searchData = array_merge($searchData,array('status' => $request['status']));
            }
            if(@$request['process_by']){
                $searchData =  array_merge($searchData,array('process_by' => $request['process_by']));
            }
            if(@$request['user_id']){
                $searchData =  array_merge($searchData,array('user_id' => $request['user_id']));
            }
        }

        $data = Requests::where($searchData)->with("company","location","process_by", "profile")->orderBy("updated_at", "desc")->paginate(10); 
        
        return response()->json([
            'item' => $data 
        ], 200); 
    } 

    public function dashboard($token){
        $token = PersonalAccessToken::findToken($token);
        if(!$token){
            return false;
        }
        $user = $token->tokenable;
       //|| $user->id == 258 || $user->id == 261
        if($user->id == 304 ){
            // jeff - 258
            // jerico - 261
            // arnel - 82
            // abe - 19
            $id = $user->id;
            $data = Requests::where('user_id', "=",$id)->orWhere('user_id',"=", 258)->orWhere('user_id',"=", 261)->orWhere('user_id',"=", 82)->orWhere('user_id',"=", 19)->with("company","location","process_by", "profile")->orderBy("updated_at", "desc")->take(10)->get();
            $pending =  Requests::where(['user_id' => $id])->where("status", "=", "pending")->get(); 
            $onhold =  Requests::where(['user_id' => $id])->where("status", "=", "onhold")->get(); 
            $processed = Requests::where(['user_id' => $id])->where("status", "=", "onprocess")->get(); 
            $newRequest =  Requests::where('user_id', "=", $id)->whereDate( "created_at" , Carbon::today())->get(); 
            $closed =  Requests::where(['user_id' => $id, "status" => "closed"])->get(); 
            $totalRequest = Requests::where(['user_id' => $id])->orWhere('user_id',"=", 258)->orWhere('user_id',"=", 261)->orWhere('user_id',"=", 82)->orWhere('user_id',"=", 19)->where("status", "!=", "cancelled")->get(); 
        }elseif($user->id == 333){
            // jeff - 258
            // jerico - 261
            // arnel - 82
            // abe - 19
            $id = $user->id;
            $data = Requests::where('user_id', "=",$id)->orWhere('user_id',"=", 304)->orWhere('user_id',"=", 258)->orWhere('user_id',"=", 261)->orWhere('user_id',"=", 82)->orWhere('user_id',"=", 19)->with("company","location","process_by", "profile")->orderBy("updated_at", "desc")->take(10)->get();
            $pending =  Requests::where(['user_id' => $id])->where("status", "=", "pending")->get(); 
            $onhold =  Requests::where(['user_id' => $id])->where("status", "=", "onhold")->get(); 
            $processed = Requests::where(['user_id' => $id])->where("status", "=", "onprocess")->get(); 
            $newRequest =  Requests::where('user_id', "=", $id)->whereDate( "created_at" , Carbon::today())->get(); 
            $closed =  Requests::where(['user_id' => $id, "status" => "closed"])->get(); 
            $totalRequest = Requests::where(['user_id' => $id])->orWhere('user_id',"=", 304)->orWhere('user_id',"=", 258)->orWhere('user_id',"=", 261)->orWhere('user_id',"=", 82)->orWhere('user_id',"=", 19)->where("status", "!=", "cancelled")->get(); 
        }elseif($user->role == 'normal'){
            $id = $user->id;
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

    public function search($id,$search){ 
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
            })->with("company","location","process_by", "profile")->paginate(10);
        }else{
             
            $data = Requests::where($where)->with("company","location","process_by", "profile")->orderBy("updated_at", "desc")->paginate(10); 
        }
        return response()->json([
            'item' => $data 
        ], 200); 
    }

    public function procSearch($search){ 
         
        if($search !== '-'){ 
            $data = Requests::where(function ($q) use ($search){
                $q->where("subject", "LIKE", "%".$search."%")->orWhere("prf_no", "LIKE", "%".$search."%")->orWhere("status", "LIKE", "%".$search."%");
            })->orWhereHas('profile', function ($q) use ($search){
                $q->where("name", "LIKE", "%".$search."%");  
            })->orWhereHas('company', function ($q) use ($search){
                $q->where("title", "LIKE", "%".$search."%");  
            })->with("company","location","process_by", "profile")->paginate(10);
        }else{
             
            $data = Requests::with("company","location","process_by", "profile")->orderBy("updated_at", "desc")->paginate(10); 
        }
        return response()->json([
            'item' => $data 
        ], 200); 
    }

    // Procuremnt Filter Search function
    public function filterSearch(Request $request){ 
        if($request['data']){
            if(@$request['data']['process_by'] == 'unassign'){
                $data = Requests::where('process_by', null)->with("company","location","process_by", "profile")->paginate(10);
            }else{
                $data = Requests::where($request['data'])->with("company","location","process_by", "profile")->paginate(10);
            }
        }else{
            $data = Requests::with("company","location","process_by", "profile")->orderBy("updated_at", "desc")->paginate(10); 
        }

        return response()->json([
            'item' => $data 
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
        $userStorage = '/uploads';
        if (!Storage::exists($userStorage)) {
            Storage::makeDirectory($userStorage, 0755, true);
        }
       
        $newData = array( 
                "urgency" =>  $request['urgency'],
                "company_id" => $request['company_id'],
                "location_id" => $request['location_id'],
                "subject" => $request['subject'],
                "status" => "pending",
                "details" => $request['details'],
                "recipients" => $request['recipients'],
                "user_id"  => $request['user_id'],
                "created_at"    => Carbon::now()
        );
        
        DB::beginTransaction();
        // do all your updates here
        try {
            $result = Requests::create($newData);
            
            $id = $result['id']; 

            $data = Requests::where('id', '=', $id)->first();  

            $curYear = Carbon::now()->format('Y');
            $prfNo = $this->pad( $id, 6 );
            $prfNo = "PRF-".$curYear.$prfNo;

            $data->update(array("prf_no" => $prfNo));

            $fileArray = array();
            if( $request->hasFile('images') ) { 
                $uploadKey = Carbon::now()->format('YmdHis');
                $img_id = array();
                foreach($request->file('images') as $k => $file) {
                    $fileName = $file->getClientOriginalName();
                    $title = pathinfo($fileName, PATHINFO_FILENAME);
                    $extn = strtolower($file->getClientOriginalExtension());
                    $slugTitle = Str::slug($title, '-');
                    $path = $slugTitle."-".$uploadKey.".".$extn;
                    $mime = $file->getClientMimeType(); 
                    $file->move(storage_path() . '/app' . $userStorage, $path);
                    
                     // Setup data into array
                    $fileArray = array(
                        'original_name' => $fileName,
                        'title' => $title,
                        'disk' => 'local',
                        'path' => $path, 
                        'mime' => $mime,
                        'user_id' => $request['user_id'],
                        'created_at' => Carbon::now(),
                    );

                    $images = Image::insertGetId($fileArray);
                    array_push( $img_id, $images);
                }
                 
                $result->images()->sync($img_id);
                
            }
            $arrDetail = array( 
                "urgency" =>  $request['urgency'],
                "company_id" => $request['company_id'],
                "location_id" => $request['location_id'],
                "status" => "pending",
                "details" => $request['details'],
                "subject" => $request['subject'],
                "user_id"  => $request['user_id'],
                "prf_no" => $prfNo,
                "created_at"    => Carbon::now()
            );
            $data->logs()->create([
                'user_id' => $request['user_id'],
                'log_type' => 'new',
                'details' => json_encode($arrDetail)
            ]);

            //procurementgroup@gagroup.net
            $emails = 'jacob@gagroup.net';
            $details = array("prf_no" => $prfNo, 'data' => $request['details'], 'user_id' => $request['user_id']);
            $rabbitArray = array("details" => $details, "email" => $emails, "subject" => "New Request");

            if($request['recipients']){
                $have_recipient = true;
                $recipients_email = str_replace(' ', '', $request['recipients']);  
                $recipients_message = "Dear, 

Your request has been forwarded to Procurement Team, 
Normal requests: Will take at least 14 working days.
Project requests: Will take at least 2 months.";
                $recipients_data = array("email" => $recipients_email, "message" => $recipients_message, "subject" => "Requested to Procurement Team");
            }
             
            $msg = "New request has been created!"; 
          
            DB::commit();
            
        } catch (\Exception $e) {
            DB::rollback(); 
            $success = false;
            $msg = "Error: Failed to add the data!";
            $responseCode = 500;
        }
        
        if($success){
                try{
                    $transport = new Swift_SmtpTransport('smtp.office365.com', '587', 'tls');
                    $transport->setUsername('GAGWebService@gagroup.net');
                    $transport->setPassword('G4@Sf4V52zY46$4T6du');
                    $mailer = new Swift_Mailer($transport);
                    $mailer->getTransport()->start();
                    RequestToProcurement::dispatch($rabbitArray);

                    if($have_recipient){
                        RecipientMailJob::dispatch($recipients_data);
                    }
                } catch (Swift_TransportException $e) {
                    $msg = 'Request has been '.$request['type'] .' But Email notification has not been sent!'; 
                } catch (Exception $e) {
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
        $data = Requests::where('id', '=', $id)->with("company","location","process_by", "profile", "images")->first(); 

        return response()->json([
            'item' => $data 
        ], 200); 
    }

    public function updateStatus(Request $request){
        
        $data = Requests::where('id', '=', $request['id'])->first(); 

        
        $item = array("status" => $request['type']);
        $data->update($item); 
        
         $data->logs()->create([
            'user_id' => $request['user_id'],
            'log_type' => 'change_status',
            'details' => json_encode($item)
        ]);
         
        $msg = 'Request has been '.$request['type']; 

        if($request['type'] == 'cancelled'){
             //procurementgroup@gagroup.net
             $emails = 'procurementgroup@gagroup.net';
             $rabbitArray = array("details" => $data, "email" => $emails, "subject" => "Request Cancelled");  
             
             if($data){
                try{
                    $transport = new Swift_SmtpTransport('smtp.office365.com', '587', 'tls');
                    $transport->setUsername('GAGWebService@gagroup.net');
                    $transport->setPassword('G4@Sf4V52zY46$4T6du');
                    $mailer = new Swift_Mailer($transport);
                    $mailer->getTransport()->start();
                    CancelRequest::dispatch($rabbitArray);
                } catch (Swift_TransportException $e) {
                    $msg = 'Request has been '.$request['type'] .' But Email notification has not been sent!'; 
                } catch (Exception $e) {
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

        $item = array("process_by" => $request['process_by']);
        $data->update($item);  
       
        $arrDetail = array( "process_by" => $request['process_by'],
            "created_at"    => Carbon::now()
        );
        $data->logs()->create([
            'user_id' => $request['user_id'],
            'log_type' => 'assign',
            'details' => json_encode($arrDetail)
        ]);
        
        $details = array("prf_no" => $data['prf_no'], 'user_id' => $request['process_by']); 
        
        $rabbitArray = array("details" => $details, "subject" => "Request Assigned");  
       
         if($data){
            try{
                $transport = new Swift_SmtpTransport('smtp.office365.com', '587', 'tls');
                $transport->setUsername('GAGWebService@gagroup.net');
                $transport->setPassword('G4@Sf4V52zY46$4T6du');
                $mailer = new Swift_Mailer($transport);
                $mailer->getTransport()->start();
                RequestAssignToProcurement::dispatch($rabbitArray);
            } catch (Swift_TransportException $e) {
                $msg = "Request has been assigned! But Email notification has not been sent!"; 
            } catch (Exception $e) {
                $msg = "Request has been assigned! But Email notification has not been sent!"; 
            }
        }
        
        $msg = 'Request has been assigned!';

        return response()->json([
            'status' => true,
            'message' => $msg
        ], 200); 
    }

    public function editData(Request $request){
        $data = Requests::where('id', '=', $request['id'])->first(); 
        $item = array("details" => $request['details'], 'subject' => $request['subject'], 'company_id' => $request['company'], 'location_id' => $request['location']);
        $data->update($item);  
       
        $arrDetail = array( "details" => $request['details'],
            "created_at"    => Carbon::now()
        );
        $data->logs()->create([
            'user_id' => $request['user_id'],
            'log_type' => 'update',
            'details' => json_encode($arrDetail)
        ]);
    }

    public function showFile($path)
    {
        $ext = explode(".", $path);
        $ext = end($ext);
        $ext = strtolower($ext);

        $mime_type = 'image/'.$ext;

        if( isset($path) ){
            $fileUrl = storage_path(). '/app/uploads/'.$path;
            return response()->file($fileUrl, array('Content-Type' => $mime_type));
        }else{
            return abort('403');
        }
    }

    function pad($num, $size){
        return substr(str_repeat(0, $size).$num, - $size);
    }

    function reportTable(Request $request){
         
        $search = $request['daterange'];
        $fromDate = $search['from'];
        $toDate = $search['to'];
        
        $dataSearch = $request['data'];
       
        $data = Requests::whereBetween('created_at', [$fromDate, $toDate])->where($dataSearch) 
        ->with("location","process_by", "profile", "company")->orderBy("created_at", "asc")->get();

        return response()->json([
            'item'     =>$data            
        ], 200);
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

           $rabbitArray = array("details" => $newArray, 'email' => 'procurementgroup@gagroup.net');  
           ReminderNotification::dispatch($rabbitArray);
        }
      
        return;
    }
}