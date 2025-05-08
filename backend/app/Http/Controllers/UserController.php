<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Address;
use App\Models\Notification;
use App\Models\Review;
use App\Models\Product;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rules\Password;


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
                    ->uncompromised(),
            ],
        ], [
            'name.regex' => 'Name can only contain letters and spaces',
            'password.confirmed' => 'Passwords do not match',
        ]);

        try {
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
                'email' => $user->email,
                "user_role_id" => $user->user_role_id,
                // Never include password in response
                // 'token' => $token, // If using Sanctum/Passport
            ]
        ], 200); // 200 OK is standard for successful requests
    
    }


    public function addadress(Request $request)
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

  
    











}