<?php

namespace App\Http\Controllers;

use App\Models\Image;
use App\Models\Company;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class CompanyController extends Controller
{
    public function __construct()
    {
       // $this->middleware('auth');
    } 

    public function fetchAll()
    {
        $data = Company::orderBy('title', 'asc')->get(); 
        
        return response()->json([
            'item' => $data 
        ], 200); 
    } 

    public function fetch()
    {
        $data = Company::paginate(10); 
        
        return response()->json([
            'item' => $data 
        ], 200); 
    } 

    public function search($search){
        if($search !== '-'){
            $data = Company::where("title", "LIKE", "%".$search."%")->orWhere("tax_no", "LIKE", "%".$search."%")->orWhere("contact_person", "LIKE", "%".$search."%")->orWhere("email", "=", $search)->paginate(10);
        }else{
            $data = Company::orderBy('title', 'ASC')->paginate(10); 
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
        $responseCode = 200;
        $data = '';
        $newData = $request->data[0];
        $newData['created_at'] = Carbon::now();

        DB::beginTransaction();
        // do all your updates here
        try {
            $data = Company::create($newData);
            $id = $data['id'];
            $arrDetail = $newData;
            $data->logs()->create([
                'user_id' => $request['user_id'],
                'log_type' => 'new',
                'details' => json_encode($arrDetail)
            ]);

            $msg = "Data has been added"; 
          
            DB::commit();
            
        } catch (\Exception $e) {
            DB::rollback();
            $success = false;
            $msg = "Error: Failed to add the data!";
            $responseCode = 500;
        }

        return response()->json([
            'success' => $success,
            'msg' => $msg,
            'id' => $id,
           
        ], $responseCode);
    }
     
    public function show(Request $request)
    {
        $data = Company::where('id', '=', $request->id)->with('images')->first(); 

        return response()->json([
            'item' => $data 
        ], 200); 
    } 

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Company  $company
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request)
    {
       
        $success = true;
        $responseCode = 200;
        $data = '';
        $newData = array(
            'address' => $request->address,
            'code' => $request->code,
            'contact_no' => $request->contact_no,
            'contact_person' => $request->contact_person,
            'email' => $request->email,
            'tax_no' => $request->tax_no,
            'title' => $request->title
        );
        
        DB::beginTransaction();
        // do all your updates here
        try { 
            $data = Company::where('id', '=', $request->id)->first(); 

            $userStorage = '/uploads';
            if (!Storage::exists($userStorage)) {
                Storage::makeDirectory($userStorage, 0755, true);
            }
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
                     
                    $data->images()->sync($img_id); 
                }
            
            $data->update($newData);

            $arrDetail = $newData;
            $data->logs()->create([
                'user_id' => $request['user_id'],
                'log_type' => 'update',
                'details' => json_encode($arrDetail)
            ]);

            $msg = "Data has been updated!"; 
          
            DB::commit();
            
        } catch (\Exception $e) {
            DB::rollback();
            dd($e);
            $success = false;
            $msg = "Error: Failed to update the data!";
            $responseCode = 500;
        }

        return response()->json([
            'success' => $success,
            'msg' => $msg
        ], $responseCode);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Company  $company
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request)
    {
        $data = Company::where('id', '=', $request->id)->first(); 
            
        $data->delete();
        $msg = "Data has been deleted!"; 
        return response()->json([
            'success' => true,
            'msg' =>  "Data has been deleted!"
        ], 200);
    }

    public function import(Request $request){
        $success = true;
        $responseCode = 200;
        DB::beginTransaction();
        // do all your updates here
        try {
            $data = Company::insert($request['data']);
         
            $msg = "Data has been imported"; 
          
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
            'msg' => $msg, 
           
        ], $responseCode);
    }
}
