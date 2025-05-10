<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('coupons', function (Blueprint $table) {
            $table->increments('coupon_id'); // auto-increment primary key
            $table->unsignedInteger('product_id'); // Foreign key column
            $table->unsignedInteger('vendor_id'); // Foreign key column for vendor
            $table->string('product_name'); // Optional if already in product table
            $table->string('coupon_code');
            $table->decimal('discount_price', 8, 2);
            $table->date('expiry_date');
            $table->enum('status', ['active', 'inactive'])->default('active');
            $table->timestamps();

            // Add foreign key constraint for product_id
            $table->foreign('product_id')
                  ->references('product_id')
                  ->on('product')
                  ->onDelete('cascade');

            // Add foreign key constraint for vendor_id
            $table->foreign('vendor_id')
                  ->references('vendor_id')
                  ->on('vendors')
                  ->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('coupons');
    }
};
