<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Orders extends Model
{
    use HasFactory;

    protected $table = 'orders';
    protected $primaryKey = 'order_id';
    public $incrementing = true;

    protected $fillable = [
        'user_id',
        'product_id',
        'vendor_id',
        'order_status',
        'payment_method',
        'total_paid',
        'orderd_quantity',
        'address_id',
    ];

    protected $casts = [
        'total_paid' => 'float',
        'order_status' => 'string',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];


    public $timestamps = true; //new
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'user_id');
    }

    public function product()
    {
        return $this->belongsTo(Product::class, 'product_id', 'product_id');
    }

    public function address()
    {
        return $this->belongsTo(Address::class, 'address_id', 'address_id');
    }

    public function notifications()
    {
        return $this->hasMany(Notification::class, 'order_id', 'order_id');
    }
}