<?php

namespace App\Jobs;

 
use App\Mail\Reminder;
use Illuminate\Bus\Queueable;
use Illuminate\Support\Carbon; 
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Mail;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Contracts\Queue\ShouldBeUnique;

class ReminderNotification implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Create a new job instance.
     *
     * @return void
     */

    protected $data;
    public function __construct($data)
    {
        $this->data = $data;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        // Publisher ID
        $publisherData = $this->data;
        $details = $publisherData['details'];
        $employeeEmail = $publisherData['email'];     

        $getEmails =  (object) ['email' => $employeeEmail];

        $data = array("details" => $details,  "date" => Carbon::now(), 'subject' => "Reminder! Procurement - Pendings!"); 
       
        Mail::to($getEmails)->queue( new Reminder($data) ); 
    }
}
