<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
//use App\Models\Product;
class Product extends Model
{
    use HasFactory;

    protected $table = 'product'; // Explicitly set table name

    protected $primaryKey = 'product_id'; // Set custom primary key

    protected $fillable = [
        'product_name',
        'total_product',
        'product_price',
        'product_img1',
        'product_img2',
        'product_img3',
        'product_img4',
        'product_img5',
        'product_desc',
        'vendor_id',
        'category_id',
        'sub_category_id',
        'product_status',
    ];

    public $timestamps = true; // You are using timestamps in migration

    // Relationships (optional but good practice)
    public function vendor()
    {
        return $this->belongsTo(Vendor::class, 'vendor_id', 'vendor_id');
    }

    public function category()
    {
        return $this->belongsTo(Category::class, 'category_id', 'category_id');
    }

    public function subCategory()
    {
        return $this->belongsTo(SubCategory::class, 'sub_category_id', 'sub_category_id');
    }

    // app/Models/Product.php
    public function wishlist()
    {
        return $this->hasMany(Wishlist::class, 'product_id');
    }
    public function scopeNewArrivals($query, $limit = 10)
    {
        return $query->orderBy('created_at', 'desc')->take($limit);
    }
}