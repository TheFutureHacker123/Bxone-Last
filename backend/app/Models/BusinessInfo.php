<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Model;
use Laravel\Sanctum\HasApiTokens;

class businessInfo extends Model
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $table = 'business_info';

    protected $fillable = [
        'business_id',
        'business_name',
        'business_address',
        'business_city',
        'business_state',
        'business_phone',
        'blicense_number',
        'address_proof_img',
        'other_img_one',
        'other_img_two',
        'other_img_three',
        'other_img_four',
        'other_img_five',
        'vendor_id',
        'verified_by'
    ];

    // public $timestamps = false;
public $timestamps = true;
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];
}
