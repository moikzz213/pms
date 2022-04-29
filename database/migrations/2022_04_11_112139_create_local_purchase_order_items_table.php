<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateLocalPurchaseOrderItemsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('local_purchase_order_items', function (Blueprint $table) {
            $table->id(); 
            $table->unsignedBigInteger('local_purchase_order_id');
            $table->unsignedBigInteger('category_id')->nullable();
            $table->unsignedBigInteger('qty')->nullable();
            $table->string('item', 150)->nullable();
            $table->string('specification', 150)->nullable();
            $table->string('uom', 100)->nullable();
            $table->float('unit_price', 10)->nullable();
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
        Schema::dropIfExists('local_purchase_order_items');
    }
}
