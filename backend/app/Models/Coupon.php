<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Coupon extends Model
{
    use HasFactory;

    protected $table = 'coupons'; // Table name

    protected $primaryKey = 'coupon_id'; // Set the correct primary key for Coupon

    protected $fillable = [
        'product_id',
        'product_name', // Optional: can remove if not used
        'coupon_code',
        'discount_price',
        'expiry_date',
        'status',
        'vendor_id', // Added vendor_id to the fillable attributes
    ];

    public $timestamps = true;

    // Relationship to Product
    public function product()
    {
        return $this->belongsTo(Product::class, 'product_id', 'product_id');
    }

    // Relationship to Vendor
    public function vendor()
    {
        return $this->belongsTo(Vendor::class, 'vendor_id', 'vendor_id');
    }
}
