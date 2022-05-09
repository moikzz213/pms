<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSuppliersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('suppliers', function (Blueprint $table) {
            $table->id(); 
            $table->string('title', 150)->nullable();
            $table->string('code', 10)->nullable();
            $table->string('address', 150)->nullable();
            $table->string('tax_no', 80)->nullable();
            $table->string('contact_person', 150)->nullable();
            $table->string('contact_no',30)->nullable();
            $table->string('email')->nullable();
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
        Schema::dropIfExists('suppliers');
    }
}
