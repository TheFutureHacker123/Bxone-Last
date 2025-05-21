<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use App\Models\Address;
use App\Models\Notification;
use App\Models\Review;
use App\Models\Product;
use App\Models\UserBankInfo; // Add this at the top with other models
use App\Models\Otp;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rules\Password;

use Illuminate\Support\Facades\Mail;
use App\Mail\RawHtmlMail;
use App\Models\Orders;

class UserController extends Controller
{
    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => [
                'required',
                'string',
                'min:2',
                'max:255',
                'regex:/^[A-Za-z\s\-]+$/',
            ],
            'email' => 'required|email|unique:users,email',
            'password' => [
                'required',
                'string',
                'confirmed',
                Password::min(8)
                    ->mixedCase()
                    ->numbers()
                    ->symbols()
            ],
        ], [
            'name.regex' => 'Name can only contain letters and spaces',
            'password.confirmed' => 'Passwords do not match',
        ]);

        try {

            $otpEntry = Otp::where('otp', $request->input('otp'))
             ->first();

    // Check if the OTP entry exists and is not expired
       if ($otpEntry && $otpEntry->expires_at > now()) {
        $otpEntry->delete();
        $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Registration successful',
                'user' => $user->makeHidden(['password', 'remember_token']),
            ], 201);

    }

            return response()->json([
                'success' => false,
                'message' => 'Invalid or expired OTP',
            ], 400);
           

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Registration failed',
                'error' => env('APP_DEBUG') ? $e->getMessage() : null,
            ], 500);
        }
    }
    


    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|string|min:8'
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid credentials',
            ], 401); // 401 Unauthorized is more appropriate
        }

        // Generate token if using API authentication
        // $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Logged in successfully',
            'storeData' => [
                "user_id" => $user->user_id,
                "name" => $user->name,
                //'email' => $user->email,
                "user_role_id" => $user->user_role_id,
                // Never include password in response
                // 'token' => $token, // If using Sanctum/Passport
            ]
        ], 200); // 200 OK is standard for successful requests
    
    }


    public function addaddress(Request $request)
    {
        // Validate the incoming request data
        $validator = Validator::make($request->all(), [
            'full_name' => 'required|string|max:100',
            'phone' => 'required|string|max:20',
            'country' => 'required|string|max:100',
            'state' => 'required|string|max:100',
            'city' => 'required|string|max:100',
            'post' => 'required|string|max:20',
            'user_id' => 'required|integer|exists:users,user_id', // Ensure user_id exists in the users table
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        // Check if the address already exists for the user
        $existingAddress = Address::where([
            ['full_name', $request->full_name],
            ['phone', $request->phone],
            ['country', $request->country],
            ['state', $request->state],
            ['city', $request->city],
            ['post', $request->post],
            ['user_id', $request->user_id],
        ])->first();

        if ($existingAddress) {
            return response()->json(['success' => false, 'message' => 'Address already exists for this user.'], 409);
        }

        // Create the address record
        $address = Address::create([
            'full_name' => $request->full_name,
            'phone' => $request->phone,
            'country' => $request->country,
            'state' => $request->state,
            'city' => $request->city,
            'post' => $request->post,
            'user_id' => $request->user_id,
        ]);

        // Return a success response
        return response()->json(['success' => true, 'message' => 'Address saved successfully!', 'address' => $address], 201);
    }


    public function addBankInfo(Request $request)
    {
        // Validate the incoming request data
        $validator = Validator::make($request->all(), [
            'user_id' => 'required|integer|exists:users,user_id',
            'bank_name' => 'required|string|max:255',
            'account_number' => 'required|string|max:255',
            'account_holder' => 'required|string|max:255',
            'bank_branch' => 'nullable|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        // Create the bank info record
        $bankInfo = UserBankInfo::create([
            'user_id' => $request->user_id,
            'bank_name' => $request->bank_name,
            'account_name' => $request->account_holder,
            'account_number' => $request->account_number,
            'branch' => $request->bank_branch,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Bank information saved!',
            'bank_info' => $bankInfo
        ], 201);
    }

    public function getNotifications(Request $request)
    {
        // Validate the incoming request data
        $validatedData = $request->validate([
            'user_id' => 'required|integer|exists:users,user_id',
        ]);

        // Retrieve notifications for the specified user
        $notifications = Notification::where('user_id', $validatedData['user_id'])->get();

        // Return the notifications in a response
        return response()->json([
            'notifications' => $notifications,
        ], 200);
    }

    public function deleteNotification(Request $request)
    {
        // Validate the incoming request data
        $validatedData = $request->validate([
            'user_id' => 'required|integer',
            'notification_id' => 'required|integer',
        ]);
        // Find the notification
        $notification = Notification::where('notification_id', $validatedData['notification_id'])
        ->where('user_id', $validatedData['user_id'])
        ->first();

        // Check if the notification exists
        if (!$notification) {
            return response()->json([
                'message' => 'Notification not found or does not belong to the user.',
            ], 404);
        }

        // Delete the notification
        $notification->delete();

        // Return a response
        return response()->json([
            'message' => 'Notification deleted successfully.',
        ], 200);
    }

    public function userInfo(Request $request)
    {
        $request->validate([
            'user_id' => 'required|integer|exists:users,user_id',
        ]);

        // Retrieve user information from the users table
        $user = User::find($request->user_id);

        // Retrieve addresses for the user
        $addresses = Address::where('user_id', $request->user_id)->get();

        // Retrieve bank information for the user
        $bankInfo = UserBankInfo::where('user_id', $request->user_id)->first();

        // Return the user information, addresses, and bank information in a JSON response
        return response()->json([
            'personal_name' => $user->name, // Assuming 'name' field in users table stores the user's full name
            'email' => $user->email,
            'phone' => $user->phone, // Assuming 'phone' field exists in users table
            'addresses' => $addresses,
            'bank_info' => $bankInfo
        ]);
    }
 public function send(Request $request)
    {
        $data = $request->validate([
            'to' => 'required|email',
            'subject' => 'OTP',
            'message' => 'required|string',
        ]);

        Mail::to($data['to'])->send(new RawHtmlMail($data['subject'], $data['message']));

        return response()->json(['message' => 'Email sent successfully']);
    }


 public function getcode(Request $request)
{
    // Validate the incoming request
    $request->validate([
        'email' => 'required|email',
    ]);

    // Generate a random 6-digit OTP code
    $otpCode = rand(100000, 999999);

    // Find the user by email
    $user = User::where('email', $request->input('email'))->first();

    if (!$user) {
        return response()->json(['message' => 'User not found'], 404);
    }

    // Save the OTP to the database
    Otp::create([
        'user_id' => $user->user_id, // Assuming user_id is the primary key in users table
        'otp' => $otpCode,
        'expires_at' => now()->addMinutes(1), // Set expiration time (e.g., 10 minutes)
        'time_stamp' => now(),
    ]);

    // Prepare email data
    $data = [
        'to' => $user->email,
        'subject' => 'Your OTP Code',
        'message' => "Your OTP code is: {$otpCode}. It is valid for 1 minutes.",
    ];

    // Send the OTP email
    Mail::to($data['to'])->send(new RawHtmlMail($data['subject'], $data['message']));

    // Return response
    return response()->json(['message' => 'Otp sent successfully']);
}


 public function updatepassword(Request $request)
{
    // Validate the incoming request
    $request->validate([
        'email' => 'required|email',
        'password' => 'required|string|min:8|confirmed', // Validate password and confirmation
    ]);
    // Find the user by email
    $user = User::where('email', $request->input('email'))->first();

    if (!$user) {
        return response()->json(['message' => 'User not found'], 404);
    }

    // Update the user's password
    $user->password = Hash::make($request->input('password'));
    $user->save();

    return response()->json(['message' => 'Password updated successfully']);
}


public function reset(Request $request)
{
    // Validate the incoming request
    $request->validate([
        'email' => 'required|email',
        'otp' => 'required|string',
    ]);

    // Find the OTP entry by email and OTP
    $otpEntry = Otp::where('otp', $request->input('otp'))
        ->whereHas('user', function ($query) use ($request) {
            $query->where('email', $request->input('email'));
        })
        ->first();

    // Check if the OTP entry exists and is not expired
    if ($otpEntry && $otpEntry->expires_at > now()) {
        return response()->json(['message' => 'Correct email and OTP']);
    }

    return response()->json(['message' => 'Invalid or expired OTP'], 400);
}




 public function sendotp(Request $request)
{
    // Validate the incoming request
    $request->validate([
        'email' => 'required|email',
    ]);
    // Generate a random 6-digit OTP code
    $otpCode = rand(100000, 999999);

    // Find the user by email
    $user = User::where('email', $request->input('email'))->first();

    if ($user) {
        return response()->json(['status' => false, 'message' => 'User already registered']);
    }

    // Save the OTP to the database
    Otp::create([ // Assuming user_id is the primary key in users table
        'otp' => $otpCode,
        'expires_at' => now()->addMinutes(1), // Set expiration time (e.g., 10 minutes)
        'time_stamp' => now(),
    ]);

    // Prepare email data
   $data = [
       'to' => $request->email,
       'subject' => 'Your OTP Code',
       'message' => "Your OTP code is: {$otpCode}. It is valid for 1 minutes.",
   ];

    // Send the OTP email
    Mail::to($data['to'])->send(new RawHtmlMail($data['subject'], $data['message']));

    // Return response
    return response()->json(['status' => true, 'message' => 'Otp sent successfully']);
}

 public function orderHistory(Request $request, $user_id)
    {
        // Remove the validate for user_id from the request body
        // as it's now coming from the URL parameter.
        // You can keep the 'exists' check if you want to ensure the user_id is valid
        // but it would typically be handled by route model binding or earlier middleware.
        // For now, let's just use the $user_id from the route.

        // Retrieve order history for the specified user
        $orderHistory = Orders::where('user_id', $user_id)->get();

        // Return the order history in a response
        return response()->json($orderHistory);
    }

}