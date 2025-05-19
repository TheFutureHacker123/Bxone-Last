<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('notifications', function (Blueprint $table) {
            $table->increments('notification_id'); // Auto-increment primary key
            $table->string('notification_text', 255); // Notification text
            $table->unsignedInteger('user_id')->nullable(); // Foreign key reference to users, nullable
            $table->unsignedInteger('vendor_id')->nullable(); // Foreign key reference to vendors, nullable
            $table->unsignedInteger('admin_id')->nullable(); // Foreign key reference to admins
            $table->unsignedInteger('order_id')->nullable(); // Add this line for order relationship
            $table->timestamps(); // Adding created_at and updated_at timestamps

            // Foreign key constraints
            $table->foreign('user_id')->references('user_id')->on('users')->onDelete('cascade');
            $table->foreign('vendor_id')->references('vendor_id')->on('vendors')->onDelete('cascade');
            $table->foreign('admin_id')->references('admin_id')->on('admins')->onDelete('cascade');
            $table->foreign('order_id')->references('order_id')->on('orders')->onDelete('cascade'); // Add foreign key constraint
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('notifications');
    }
};