<?php 
namespace App\Helper; 

use Illuminate\Support\Str;
use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\Facades\Image as Img;
use Illuminate\Support\Facades\DB;

class GlobalFunction
{  
    public function randomLettersOnly($length)
    {
        $pool = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        return substr(str_shuffle(str_repeat($pool, 5)), 0, $length);
    }

    public function randomStringWithNumbers()
    {
        $pool = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        return substr(str_shuffle(str_repeat($pool, 5)), 0, $length);
    }

    public function globalUploadImages($tableClass, $type, $images, $syncOrAttach){ 
        
        if($images){
                    
            // upload image
            $fileArray = array();
            $uploadDate = Carbon::now()->format('YmdHis');
            $files = Collection::wrap($images);
            $userStorage = '/uploads/quotations';
            if (!Storage::exists($userStorage)) {
                Storage::makeDirectory($userStorage, 0755, true);
            }

            $files->each(function ($file, $key) use (&$userStorage, &$fileArray,$type, &$uploadDate) {
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
                    'types' => $type,
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
                if($syncOrAttach == 'attach'){ 
                    // attach
                    $tableClass->images()->attach($idsToSync);
                }else{
                    // sync
                    $tableClass->images()->sync($idsToSync);
                }
            } 
            return true;
        } 

        return false;
         
    }

    public function createLogs($request, $id, $log_type, $data)
    {
        $request->logs()->create([
            'user_id' => $id,
            'log_type' => $log_type,
            'details' => json_encode($data)
        ]);
        return true;
    }
}
