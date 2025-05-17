<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Subscriber;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class SubscriptionController extends Controller
{
    public function subscribe(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|unique:subscribers',
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => $validator->errors()->first()], 422);
        }

        try {
            Subscriber::create(['email' => $request->input('email')]);
            return response()->json(['message' => 'Successfully subscribed!'], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to subscribe.'], 500);
        }
    }
}