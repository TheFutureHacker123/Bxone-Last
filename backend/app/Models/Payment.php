<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Payment extends Model
{
    use HasFactory;

    protected $primaryKey = 'payment_id';

/**
 * Indicates if the IDs are auto-incrementing.
 *
 * @var bool
 */
public $incrementing = true; // Assuming payment_id is auto-incrementing

/**
 * The "type" of the auto-incrementing ID.
 *
 * @var string
 */
protected $keyType = 'int';
    protected $fillable = [
        'order_id',
        'chapa_reference',
        'payment_status',
        'total_amount',
        'vendor_payout_amount',
        'service_fee_amount',
    ];

    /**
     * Get the order associated with the payment.
     */
    public function order(): BelongsTo
    {
        return $this->belongsTo(Orders::class, 'order_id', 'order_id');
    }
}