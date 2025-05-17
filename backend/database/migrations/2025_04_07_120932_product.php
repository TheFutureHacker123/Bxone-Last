<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('product', function (Blueprint $table) {
            $table->increments('product_id'); // Auto-increment primary key
            $table->string('product_name', 100);
            $table->integer('total_product');
            $table->float('product_price');
            $table->string('product_img1', 100);
            $table->string('product_img2', 100)->nullable();
            $table->string('product_img3', 100)->nullable();
            $table->string('product_img4', 100)->nullable();
            $table->string('product_img5', 100)->nullable();
            $table->text('product_desc');
            $table->unsignedInteger('vendor_id'); // Foreign key reference
            $table->unsignedInteger('category_id'); // Foreign key reference
            $table->unsignedInteger('sub_category_id'); // Foreign key reference
            $table->enum('product_status', ['Active', 'Inactive','Ban'])->default('Active'); // Enum for status
            $table->timestamps(); // Adding created_at and updated_at timestamps

            // Foreign key constraints
            $table->foreign('vendor_id')->references('vendor_id')->on('vendors')->onDelete('cascade');
            $table->foreign('category_id')->references('category_id')->on('category')->onDelete('cascade');
            $table->foreign('sub_category_id')->references('sub_category_id')->on('sub_category')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('product');
    }
};
