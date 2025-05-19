<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserBankInfo extends Model
{
    use HasFactory;

    protected $table = 'user_bank_info';

    protected $fillable = [
        'user_id',
        'bank_name',
        'account_name',
        'account_number',
        'ifsc_code',
        'branch',
    ];

    // If you want to define the relationship to User:
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'user_id');
    }
}
