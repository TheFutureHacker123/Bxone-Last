<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cart extends Model
{
    use HasFactory;

    // Table name (optional if it follows Laravel convention)
    protected $table = 'cart';

    // Primary key (optional if 'id')
    protected $primaryKey = 'cart_id';

    // Disable auto-incrementing if it's not using 'id'
    public $incrementing = true;

    // Set the primary key type
    protected $keyType = 'int';

    // Fields that can be mass assigned
    protected $fillable = [
        'user_id',
        'product_id',
        'total_added',
    ];

    public $timestamps = true; //new
    // Relationships
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'user_id');
    }

    public function product()
    {
        return $this->belongsTo(Product::class, 'product_id', 'product_id');
    }
}
