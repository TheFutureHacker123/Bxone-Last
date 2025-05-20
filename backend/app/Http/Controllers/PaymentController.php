<?php

namespace App\Http\Controllers;

use App\Models\Orders;
use App\Models\Payment;
use Illuminate\Http\Request;
use Chapa\Chapa\Facades\Chapa as Chapa;
use Illuminate\Support\Facades\Log;
use Stripe\StripeClient;


class PaymentController extends Controller
{
    
    public function initiatePayment(Request $request)
    {
        // 1. Validate the incoming request
        $request->validate([
            'order_id' => 'required|exists:orders,order_id',
        ]);

        $order = Orders::findOrFail($request->input('order_id'));
        $totalAmount = $order->total_paid;

        // Load the address relationship for the order
        $order->load('address');

        $customerPhone = $order->address ? $order->address->phone : null;

        // 2. Check if a payment record already exists for this order
        $existingPayment = Payment::where('order_id', $order->order_id)->first();

        Log::info('Existing payment for order ID ' . $order->order_id . ': ' . json_encode($existingPayment));

        if ($existingPayment) {
            if ($existingPayment->chapa_reference) {
                Log::info('Redirecting user to existing Chapa checkout URL for order ID: ' . $order->order_id);
                return response()->json(['checkout_url' => $existingPayment->chapa_reference]);
            } else {
                Log::warning('Payment record exists for order ID ' . $order->order_id . ' but no Chapa reference found. Updating the existing record.');
                Log::info('Total amount before update: ' . $totalAmount);
                $existingPayment->total_amount = $totalAmount;
                $existingPayment->payment_status = 'held';
                $existingPayment->save();
                $payment = $existingPayment;
            }
        } else {
            Log::info('Creating a new payment record for order ID: ' . $order->order_id);
            $payment = Payment::create([
                'order_id' => $order->order_id,
                'total_amount' => $totalAmount,
                'payment_status' => 'held', // Initial status as 'held'
            ]);
        }

        // 3. Initialize Chapa payment and get the checkout URL
        $chapaInitURL = 'https://api.chapa.co/v1/transaction/initialize';
        $callbackURL = route('payment.callback');
       $postData = [
            'amount' => $payment->total_amount,
            'currency' => 'ETB',
            'email' => $order->user->email ?? null,
            'first_name' => $order->address->full_name ?? null,
            'last_name' => '',
            'phone_number' => $customerPhone,
            'tx_ref' => 'order-' . $order->order_id . '-' . time(),
            'return_url' => 'http://localhost:3000/order-confirmation',
            'callback_url' => $callbackURL,
            'customization' => [
                'title' => 'Order ' . $order->order_id, // Shortened title
                'description' => 'Payment for your order on Enew',
            ],
        ];
        Log::info('Phone number being sent to Chapa: ' . $customerPhone);
        
        $chapaSecretKey = env('CHAPA_SECRET_KEY');
        $headers = [
            'Authorization' => 'Bearer ' . $chapaSecretKey,
            'Content-Type' => 'application/json',
        ];

        try {
            $client = new \GuzzleHttp\Client();
            $response = $client->post($chapaInitURL, [
                'headers' => $headers,
                'json' => $postData,
            ]);

            $body = json_decode($response->getBody(), true);

            if ($body['status'] === 'success') {
                $payment->update(['chapa_reference' => $body['data']['checkout_url'] ?? $body['data']['payment_url'] ?? null]);
                Log::info("Chapa payment initiated successfully for order ID: " . $order->order_id . ", Checkout/Payment URL: " . ($body['data']['checkout_url'] ?? $body['data']['payment_url'] ?? 'N/A'));
                return response()->json(['checkout_url' => $body['data']['checkout_url'] ?? $body['data']['payment_url'] ?? null]);
            } else {
                Log::error("Chapa payment initiation failed for order ID: " . $order->order_id . ", Response: " . json_encode($body));
                return response()->json(['error' => 'Failed to initiate payment with Chapa.'], 500);
            }

        } catch (\Exception $e) {
            Log::error("Error initiating Chapa payment for order ID: " . $order->order_id . ", Error: " . $e->getMessage());
            return response()->json(['error' => 'Error communicating with Chapa.'], 500);
        }
    }

 public function handleCallback(Request $request)
{
    Log::info('Chapa Callback Headers: ' . json_encode($request->headers->all()));
    Log::info('Chapa Callback Data: ' . json_encode($request->all()));

    $transactionReference = $request->input('trx_ref');

    if (!$transactionReference) {
        $transactionReference = $request->input('tx_ref'); // Fallback to tx_ref
        if (!$transactionReference) {
            Log::warning('Callback received without transaction reference (trx_ref or tx_ref).');
            return response()->json(['status' => 'error', 'message' => 'Transaction reference not found in callback.'], 400);
        }
    }

    Log::info('Payment callback received for tx_ref/trx_ref: ' . $transactionReference);

    try {
        $paymentData = Chapa::verifyTransaction($transactionReference);
        Log::info('Chapa verification response: ' . json_encode($paymentData));

        if ($paymentData['status'] === 'success') {
            $orderId = explode('-', $transactionReference)[1] ?? null;
            $payment = Payment::where('order_id', $orderId)->first();

            if ($payment) {
                dd($payment->toArray());
                $payment->update(['payment_status' => 'admin_approved', 'chapa_reference' => $transactionReference]);
                Log::info('Payment updated successfully for order ID: ' . $payment->order_id . ', tx_ref/trx_ref: ' . $transactionReference);
                return response()->json(['status' => 'success', 'message' => 'Payment successful and record updated.']);
            } else {
                Log::error('Payment record not found for tx_ref/trx_ref: ' . $transactionReference);
                return response()->json(['status' => 'error', 'message' => 'Payment record not found for this transaction.'], 404);
            }
        } else {
            Log::warning('Chapa verification failed for tx_ref/trx_ref: ' . $transactionReference . ', message: ' . $paymentData['message']);
            return response()->json(['status' => 'error', 'message' => 'Payment verification failed: ' . $paymentData['message']], 400);
        }
    } catch (\Exception $e) {
        Log::error('Error verifying Chapa transaction (' . $transactionReference . '): ' . $e->getMessage());
        return response()->json(['status' => 'error', 'message' => 'Payment verification failed due to an error.'], 500);
    }
}

    public function confirmOrder(Orders $order)
    {
        // Check if there's a 'held' payment for this order
        $payment = Payment::where('order_id', $order->order_id)
            ->where('payment_status', 'held')
            ->first();

        if (!$payment) {
            return response()->json(['status' => 'error', 'message' => 'No held payment found for this order.'], 400);
        }

        // Update order status and payment status
        $order->update(['order_status' => 'Processing']);
        $payment->update(['payment_status' => 'user_released']);

        return response()->json(['status' => 'success', 'message' => 'Order confirmed and payment released by user. Awaiting admin approval.']);
    }

    public function approvePayment(Payment $payment)
    {
        // Check if the payment status is 'user_released'
        if ($payment->payment_status !== 'user_released') {
            return response()->json(['status' => 'error', 'message' => 'Payment cannot be approved as it is not yet released by the user.'], 400);
        }

        // Calculate vendor payout (total amount - 5% service fee)
        $serviceFeePercentageVendor = 0.05; // 5%
        $serviceFeeAmountVendor = $payment->total_amount * $serviceFeePercentageVendor;
        $vendorPayoutAmount = $payment->total_amount - $serviceFeeAmountVendor;

        // Update payment status and store payout details
        $payment->update([
            'payment_status' => 'admin_approved',
            'vendor_payout_amount' => $vendorPayoutAmount,
            'service_fee_amount' => $serviceFeeAmountVendor,
        ]);

        return response()->json(['status' => 'success', 'message' => 'Payment approved by admin. Ready for vendor payout.', 'vendor_payout' => $vendorPayoutAmount]);
    }


    public function payoutVendor(Payment $payment)
    {
        // Check if the payment status is 'admin_approved'
        if ($payment->payment_status !== 'admin_approved') {
            return response()->json(['status' => 'error', 'message' => 'Payment cannot be paid out as it is not yet approved by the admin.'], 400);
        }

        // Update payment status to 'vendor_paid'
        $payment->update(['payment_status' => 'vendor_paid']);

        return response()->json(['status' => 'success', 'message' => 'Payment has been marked as paid to the vendor.']);
    }

    public function paymentSuccess(Request $request)
    {
        // Handle successful payment logic here
        return response()->json(['message' => 'Payment successful!']);
    }

     public function createStripePaymentIntent(Request $request)
    {
        $stripe = new StripeClient(env('STRIPE_SECRET'));
        $items = $request->input('items');
        $orderId = $request->input('order_id');

        $totalAmount = 0;
        if (is_array($items)) {
            foreach ($items as $item) {
                $product = \App\Models\Product::find($item['id']);
                if ($product) {
                    $totalAmount += (int)($product->product_price * 100) * $item['quantity'];
                } else {
                    return response()->json(['error' => 'Product not found: ' . $item['id']], 400);
                }
            }
        } else {
            return response()->json(['error' => 'No items in the order.'], 400);
        }

        $totalAmount += 500; // Example shipping

        try {
            $paymentIntent = $stripe->paymentIntents->create([
                'amount' => $totalAmount,
                'currency' => 'etb',
                // 'automatic_payment_methods' => ['enabled' => true], // Enable all available payment methods
                'metadata' => ['order_id' => $orderId],
            ]);

            return response()->json(['clientSecret' => $paymentIntent->client_secret]);
        } catch (\Stripe\Exception\ApiErrorException $e) {
            Log::error('Stripe Payment Intent creation error: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to create Stripe Payment Intent.'], 500);
        }
    }
}