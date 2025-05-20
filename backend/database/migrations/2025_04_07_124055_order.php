<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->increments('order_id'); // Auto-increment primary key
            $table->unsignedInteger('user_id'); // Foreign key reference to users
            $table->unsignedInteger('product_id')->nullable(); // Foreign key reference to products
            $table->unsignedInteger('vendor_id')->nullable(); // Foreign key reference to vendors
            $table->enum('order_status', ['Pending', 'Completed', 'Cancelled', 'Shipped', 'Refunded'])->default('Pending'); // Enum for order status
            $table->string('payment_method', 10); // Payment method used
            $table->float('total_paid')->nullable(); // Total amount paid
            $table->integer('orderd_quantity')->nullable(); // Quantity of the product ordered
            $table->unsignedInteger('address_id')->nullable(); // Added address_id to the orders table
            $table->timestamps(); // Adding created_at and updated_at timestamps

            // Foreign key constraints
            $table->foreign('user_id')->references('user_id')->on('users')->onDelete('cascade');
            $table->foreign('product_id')->references('product_id')->on('product')->onDelete('cascade');
            $table->foreign('vendor_id')->references('vendor_id')->on('vendors')->onDelete('cascade');
            $table->foreign('address_id')->references('address_id')->on('address')->onDelete('set null'); // Fixed table name to 'address'
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};