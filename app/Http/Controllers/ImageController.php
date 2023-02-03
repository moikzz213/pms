<?php

namespace App\Http\Controllers;

use App\Models\Image;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\Facades\Image as Img;

class ImageController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
    }
    public function fetch(){
        $result = Image::where('types', 'logo')->latest()->paginate(12);

        return response()->json( $result, 200);
    }

    public function dropzoneUpload(Request $request)
    {
        $fileArray = array();
        $uploadKey = Carbon::now()->format('YmdHis');

        $files = Collection::wrap(request()->file('file'));
         
        $userStorage = '/uploads';
        
        if (!Storage::exists($userStorage)) {
            Storage::makeDirectory($userStorage, 0755, true);
        }

        $files->each(function ($file, $key) use (&$userStorage, &$fileArray, &$uploadKey, &$request) {

            $userStorageDir = storage_path() . '/app' . $userStorage;
            $fileName = $file->getClientOriginalName();
            $title = pathinfo($fileName, PATHINFO_FILENAME);
            $extn = strtolower($file->getClientOriginalExtension());
            $slugTitle = Str::slug($title, '-');
            $path = $slugTitle."-".$uploadKey.".".$extn;
            $mime = $file->getClientMimeType();

            // File Optimization
            $img = Img::make($file);
            $img->encode($extn, 50);
            // Save file to storage directory
            $img->save($userStorageDir . '/' . $path);

            // Setup data into array
            array_push( $fileArray, array(
                    'original_name' => $fileName,
                    'title' => $title,
                    'disk' => 'local',
                    'path' => $path,
                    'mime' => $mime,
                    'types' => 'logo',
                    'user_id' => auth()->id(),
                    'created_at' => Carbon::now(),
            ));
        });

        // Insert into database at once
        $uploadedFiles = Image::insert($fileArray);

        return response()->json([
            'success' => true,
            'message' => 'Upload Success',
        ], 200);
    }
}
