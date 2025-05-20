<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Laravel\Sanctum\HasApiTokens;

class Vendor extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $primaryKey = 'vendor_id';
    protected $table = 'vendors';
    // public $timestamps = false;
public $timestamps = true;
    protected $fillable = [
        'vendor_id',
        'email',
        'password',
        'status',
        'time_stamp',
        'vendor_role_id',
        'logo', // Added logo to fillable
        'is_featured',
     // Added is_featured to fillable
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
        'is_featured' => 'boolean', // Cast is_featured to boolean
        'is_approved' => 'boolean', // Cast is_approved to boolean
    ];

    public function personalInfo(): HasOne
    {
        return $this->hasOne(PersonalInfo::class, 'vendor_id', 'vendor_id');
    }

    /**
     * Get the products associated with the vendor.
     */
    public function products(): HasMany
    {
        return $this->hasMany(Product::class, 'vendor_id', 'vendor_id');
    }

    public function businessInfo(): HasOne
    {
        return $this->hasOne(BusinessInfo::class, 'vendor_id', 'vendor_id');
    }

    public function bankInfo(): HasOne
    {
        return $this->hasOne(BankInfo::class, 'vendor_id', 'vendor_id');
    }

    public function notifications(): HasMany
    {
        return $this->hasMany(Notification::class, 'vendor_id', 'vendor_id');
    }

    public function orders(): HasMany
    {
        return $this->hasMany(Orders::class, 'vendor_id', 'vendor_id');
    }
}