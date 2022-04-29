<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateImagesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('images', function (Blueprint $table) {
            $table->id();
            $table->string('original_name', 150)->nullable();
            $table->string('title', 150)->nullable();
            $table->string('disk', 150)->nullable();
            $table->string('path', 150)->nullable();
            $table->string('mime', 80)->nullable();
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
        Schema::dropIfExists('images');
    }
}
