<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateProfilesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('profiles', function (Blueprint $table) {
            $table->id();
            $table->string('name', 150); 
            $table->string('dob', 30)->nullable();
            $table->string('ecode', 30)->nullable();
            $table->string('gender', 20)->nullable();
            $table->string('branch_code', 30)->nullable();
            $table->string('contact_no', 80)->nullable();
            $table->string('personal_contact_no', 80)->nullable();
            $table->string('personal_email', 80)->nullable();
            $table->string('designation', 150)->nullable();
            $table->string('description')->nullable();
            $table->string('summary')->nullable();
            $table->unsignedBigInteger('company_id')->nullable();
            $table->unsignedBigInteger('department_id')->nullable();
            $table->unsignedBigInteger('user_id');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('profiles');
    }
}
