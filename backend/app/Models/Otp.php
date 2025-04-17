<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Otp extends Model
{
    use HasFactory;

    // Table name
    protected $table = 'otps';

    // Primary key
    protected $primaryKey = 'id';

    // Primary key is incrementing
    public $incrementing = true;

    // Key type
    protected $keyType = 'int';

    // Disable default timestamps since you're using custom timestamp fields
    public $timestamps = false;

    // Mass assignable fields
    protected $fillable = [
        'user_id',
        'otp',
        'expires_at',
        'time_stamp',
    ];

    // Casts
    protected $casts = [
        'expires_at' => 'datetime',
        'time_stamp' => 'datetime',
    ];

    // Relationships
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'user_id');
    }
}
