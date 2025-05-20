<?php

// app/Http/Controllers/WishlistController.php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Wishlist;
use App\Models\Product;
use Illuminate\Support\Facades\Auth;

class WishlistController extends Controller
{
    public function addToWishlist(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:product,product_id'
        ]);

        $user = Auth::user();
        // Check if already in wishlist
        $exists = Wishlist::where('user_id', $request->user_id)
            ->where('product_id', $request->product_id)
            ->exists();

        if ($exists) {
            return response()->json(['success' => false, 'message' => 'Product already in wishlist']);
        }

        Wishlist::create([
            'user_id' => $request->user_id,
            'product_id' => $request->product_id
        ]);

        return response()->json(['success' => true, 'message' => 'Product added to wishlist']);
    }

public function removeFromWishlist(Request $request)
{
    $request->validate([
        'product_id' => 'required',
        'user_id' => 'required'
    ]);

    $wishlist = Wishlist::where('user_id', $request->user_id)
        ->where('product_id', $request->product_id)
        ->first();
    if (!$wishlist) {
        return response()->json([
            'success' => false,
            'message' => 'Wishlist item not found'
        ], 404);
    }

    $wishlist->delete();

    return response()->json([
        'success' => true,
        'message' => 'Product removed from wishlist'
    ]);
}


    public function getWishlist(Request $request)
    {
        // Get wishlist for the user_id passed from the frontend (no need for Auth)
        $userId = $request->user_id;

        $wishlist = Wishlist::with('product')
            ->where('user_id', $userId)
            ->get()
            ->map(function ($item) {
                return $item->product;
            });

        return response()->json(['success' => true, 'wishlist' => $wishlist]);
    }

    public function checkInWishlist($product_id)
    {
        $user = Auth::user();

        $exists = Wishlist::where('user_id', $user->id)
            ->where('product_id', $product_id)
            ->exists();

        return response()->json(['success' => true, 'in_wishlist' => $exists]);
    }
}
