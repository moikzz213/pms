<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateLoggablesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('loggables', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('log_id');
            $table->unsignedBigInteger('loggable_id');
            $table->string('loggable_type'); // Model Class
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
        Schema::dropIfExists('loggables');
    }
}
