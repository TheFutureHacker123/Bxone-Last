<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('chat', function (Blueprint $table) {
            $table->increments('chat_id'); // Auto-increment primary key
            $table->string('message', 255); // Increased length for message field
            $table->string('chat_img', 255)->nullable(); // Image link for chat, nullable
            $table->unsignedInteger('user_id')->nullable(); // Foreign key reference to users, nullable
            $table->unsignedInteger('vendor_id')->nullable(); // Foreign key reference to vendors, nullable
            $table->unsignedInteger('admin_id')->nullable(); // Foreign key reference to admins, nullable
            $table->unsignedInteger('product_id')->nullable(); // Foreign key reference to products, nullable
            $table->enum('writen_by', ['Admin','Vendor',"User"])->default('Vendor');
            $table->timestamps(); // Adding created_at and updated_at timestamps
            
            // Foreign key constraints
            $table->foreign('user_id')->references('user_id')->on('users')->onDelete('cascade');
            $table->foreign('vendor_id')->references('vendor_id')->on('vendors')->onDelete('cascade');
            $table->foreign('admin_id')->references('admin_id')->on('admins')->onDelete('cascade');
            $table->foreign('product_id')->references('product_id')->on('product')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('chat');
    }
};