<?php

namespace App\Http\Controllers;

use App\Models\Chat;
use App\Models\Admin;
use Illuminate\Http\Request;

class MessageController extends Controller
{


public function fetchChat(Request $request)
{
    // Validate the incoming request
    $validated = $request->validate([
        'vendor_id' => 'required|integer',
        'admin_id' => 'required|integer',
    ]);

    // Fetch chats based on vendor_id and admin_id
    $chats = Chat::where('vendor_id', $validated['vendor_id'])
                 ->where('admin_id', $validated['admin_id'])
                 ->get();

    // Return the fetched chats
    return response()->json([
        'success' => true,
        'data' => $chats,
    ]);
}

public function addChat(Request $request)
{
    // Validate the incoming request
    $validated = $request->validate([
        'message' => 'required|string|max:255',
        'vendor_id' => 'required|integer',
        'admin_id' => 'required|integer',
        'writen_by' => 'required|in:Admin,Vendor,User', // Validate against ENUM values
    ]);
    
    // Create a new chat message
    $chat = Chat::create([
        'message' => $validated['message'],
        'vendor_id' => $validated['vendor_id'],
        'admin_id' => $validated['admin_id'],
        'writen_by' => $validated['writen_by'], // Include writen_by in the creation
    ]);

    // Return a response
    return response()->json([
        'success' => true,
        'data' => $chat,
    ], 201);
}






}
