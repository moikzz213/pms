<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateComparisonItemsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('comparison_items', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('comparison_id');
            $table->string('title',200);
            $table->text('description');
            $table->unsignedInteger('qty')->default(1);
            $table->string('uom', 50);
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
        Schema::dropIfExists('comparison_items');
    }
}
