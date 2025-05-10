<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Category;
use App\Models\Orders;
use App\Models\Cart;
use App\Models\Review;
use App\Models\Coupon;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    // Search function to find products based on user input
    public function search(Request $request)
    {

        // Get the search query from user input
        $searchQuery = $request->input('query');

        $products = Product::where('product_name', 'like', '%' . $searchQuery . '%')
        ->select('product_id', 'product_name', 'total_product', 'product_price', 'product_img1', 'product_img2', 'product_img3', 'product_img4', 'product_img5', 'product_desc', 'vendor_id', 'category_id', 'sub_category_id') // Select only the desired fields
        ->get();

        // Return the results (you can also return a view with these products)
        return response()->json($products);
    }

    public function topproduct(Request $request)
    {
        // Fetch 12 random products
        $products = Product::inRandomOrder()
            ->select(
                'product_id',
                'product_name',
                'total_product',
                'product_price',
                'product_img1',
                'product_img2',
                'product_img3',
                'product_img4',
                'product_img5',
                'product_desc',
                'vendor_id',
                'category_id',
                'sub_category_id'
            )
            ->limit(12)
            ->get();
    
        return response()->json($products);
    }
    


    public function categorylist()
    {
        $categories = Category::with('subCategories')->get(); // Eager loading sub-categories
        return response()->json($categories);
    }





   public function productdetails(Request $request) {
    $validatedData = $request->validate([
        'product_id' => 'required|integer',
    ]);

    // Fetch the product info
    $product = Product::select(
        'product_id', 'product_name', 'product_desc',
        'product_price', 'product_img1', 'product_img2',
        'product_img3', 'product_img4', 'product_img5'
    )->where('product_id', $validatedData['product_id'])->first();

    if (!$product) {
        return response()->json([
            'success' => false,
            'message' => 'Product not found.',
        ]);
    }

    // Fetch reviews with user info (may be empty)
    $reviews = Review::where('product_id', $validatedData['product_id'])
        ->with(['user:user_id,name'])
        ->select('review_txt', 'rate', 'user_id', 'product_id', 'created_at')
        ->get();

    return response()->json([
        'success' => true,
        'data' => [
            'product' => [
                'product_id' => $product->product_id,
                'product_name' => $product->product_name,
                'product_desc' => $product->product_desc,
                'product_price' => $product->product_price,
                'product_images' => $product->product_img1,
                'product_img2' => $product->product_img2,
                'product_img3' => $product->product_img3,
                'product_img4' => $product->product_img4,
                'product_img5' => $product->product_img5,
            ],
            'reviews' => $reviews->map(function ($review) {
                return [
                    'review_txt' => $review->review_txt,
                    'rate' => $review->rate,
                    'user_id' => $review->user_id,
                    'user_name' => $review->user->name ?? 'Unknown',
                    'created_at' => $review->created_at,
                ];
            }),
        ]
    ]);
}




    public function addtocart(Request $request)
    {
        // Extract the product_id and user_id from the request
        $product_id = $request->input('product_id');
        $user_id = $request->input('user_id');

        // Check if the product is already in the user's cart
        $existingItem = Cart::where('user_id', $user_id)
                            ->where('product_id', $product_id)
                            ->first();

        if ($existingItem) {
            // If the product is already in the cart, send a response that it's already added
            return response()->json(['success' => false, 'message' => 'Product already added to the cart!']);
        } else {
            // Add new product to the cart
            $cartItem = new Cart();
            $cartItem->product_id = $product_id;
            $cartItem->user_id = $user_id;
            $cartItem->save();

            return response()->json(['success' => true, 'message' => 'Product added to cart!']);
        }
    }

    public function removecartitems(Request $request)
{
    $cart_id = $request->input('cart_id');
    $user_id = $request->input('user_id');

    $cartItem = Cart::where('cart_id', $cart_id)
                ->where('user_id', $user_id)
                ->first();

    if (!$cartItem) {
        return response()->json(['success' => false, 'message' => 'Cart item not found!.']);
    }else{
    $cartItem->delete();
    return response()->json(['success' => true, 'message' => 'Cart item removed successfully.']);
    }


}




    public function listcartitems(Request $request)
    {
        // Retrieve the user_id from the request (assuming it's passed as part of the request)
        $user_id = $request->input('user_id');

        // Get cart items with product details
        $cartItems = Cart::where('user_id', $user_id)
            ->join('product', 'cart.product_id', '=', 'product.product_id')
            ->select(
                'product.product_name',
                'product.product_price',
                'cart.total_added',
                'cart.cart_id',
                'product.product_img1',
                'product.total_product',
            )
            ->get();

        // Return the cart items in the response
        if ($cartItems->isEmpty()) {
            return response()->json(['success' => false, 'message' => 'No products in cart.']);
        }

        return response()->json(['success' => true, 'cart_items' => $cartItems]);
    }


    public function orderditems(Request $request)
    {
        // Retrieve the user_id from the request
        $user_id = $request->input('user_id');

        // Fetch orders with product details
        $orders = Orders::where('user_id', $user_id)->where('order_status', "Pending")
            ->join('product', 'orders.product_id', '=', 'product.product_id')
            ->select(
                'product.product_name',
                'orders.total_paid',
                'orders.orderd_quantity',
                "orders.order_id",
                'product.product_img1',
                'orders.payment_method',
                'orders.order_status'
            )
            ->get();

        // Return the orders in the response
        if ($orders->isEmpty()) {
            return response()->json(['success' => false, 'message' => 'No orders found.']);
        }

        return response()->json(['success' => true, 'orderd_items' => $orders]);
    }

    public function shippeditems(Request $request)
    {
       // Retrieve the user_id from the request
       $user_id = $request->input('user_id');

       // Fetch orders with product details
       $orders = Orders::where('user_id', $user_id)->where('order_status', "Shipped")
           ->join('product', 'orders.product_id', '=', 'product.product_id')
           ->select(
               'product.product_name',
               'orders.total_paid',
               'orders.orderd_quantity',
               "orders.order_id",
               'product.product_img1',
               'orders.payment_method',
               'orders.order_status'
           )
           ->get();

       // Return the orders in the response
       if ($orders->isEmpty()) {
           return response()->json(['success' => false, 'message' => 'No orders found.']);
       }

       return response()->json(['success' => true, 'shipped_items' => $orders]);
    }



    public function completeditems(Request $request)
    {
          // Retrieve the user_id from the request
          $user_id = $request->input('user_id');

          // Fetch orders with product details
          $orders = Orders::where('user_id', $user_id)->where('order_status', "Completed")
              ->join('product', 'orders.product_id', '=', 'product.product_id')
              ->select(
                  'product.product_name',
                  'orders.total_paid',
                  'orders.orderd_quantity',
                  "orders.order_id",
                  'product.product_img1',
                  'orders.payment_method',
                  'orders.order_status'
              )
              ->get();
   
          // Return the orders in the response
          if ($orders->isEmpty()) {
              return response()->json(['success' => false, 'message' => 'No orders found.']);
          }
   
          return response()->json(['success' => true, 'completed_items' => $orders]);
    }

    public function refunditems(Request $request)
    {
         // Retrieve the user_id from the request
         $user_id = $request->input('user_id');

         // Fetch orders with product details
         $orders = Orders::where('user_id', $user_id)->where('order_status', "Refunded")
             ->join('product', 'orders.product_id', '=', 'product.product_id')
             ->select(
                 'product.product_name',
                 'orders.total_paid',
                 'orders.orderd_quantity',
                 "orders.order_id",
                 'product.product_img1',
                 'orders.payment_method',
                 'orders.order_status'
             )
             ->get();
  
         // Return the orders in the response
         if ($orders->isEmpty()) {
             return response()->json(['success' => false, 'message' => 'No orders found.']);
         }
  
         return response()->json(['success' => true, 'refund_items' => $orders]);
    }





public function addCoupon(Request $request)
{
    // Validate the incoming request data
    $request->validate([
        'product_id' => 'required|exists:product,product_id',
        'vendor_id' => 'required|exists:vendors,vendor_id', // Ensure the vendor exists
        'product_name' => 'required|string|max:255',
        'coupon_code' => 'required|string|max:255|unique:coupons,coupon_code',
        'discount_price' => 'required|numeric|min:0',
        'expiry_date' => 'required|date|after:today',
        'status' => 'required|in:active,inactive',
    ]);

    // Create a new coupon using the validated data
    $coupon = Coupon::create([
        'product_id' => $request->product_id,
        'vendor_id' => $request->vendor_id, // Assign vendor ID
        'product_name' => $request->product_name,
        'coupon_code' => $request->coupon_code,
        'discount_price' => $request->discount_price,
        'expiry_date' => $request->expiry_date,
        'status' => $request->status,
    ]);

    // Return a response indicating success
    return response()->json([
        'message' => 'Coupon added successfully!',
        'coupon' => $coupon
    ], 201);
}

public function listCoupon(Request $request)
    {
        // Validate the incoming request data
        $request->validate([
            'vendor_id' => 'required|exists:vendors,vendor_id',  // Ensure the vendor exists
        ]);

        // Get the vendor_id from the request
        $vendorId = $request->vendor_id;

        // Fetch all coupons for the specified vendor with related product information
        $coupons = Coupon::with('product')  // Eager load the related product data
                        ->where('vendor_id', $vendorId)  // Filter by vendor_id
                        ->get();

        // Return a response with the list of coupons
        return response()->json([
            'message' => 'Coupons retrieved successfully.',
            'coupons' => $coupons
        ]);
    }







public function deleteCoupon(Request $request)
{
    // Validate the request
    $request->validate([
        'coupon_id' => 'required|exists:coupons,coupon_id',
    ]);

    // Find the coupon
    $coupon = Coupon::find($request->coupon_id);

    if (!$coupon) {
        return response()->json([
            'message' => 'Coupon not found.'
        ], 404);
    }

    // Delete the coupon
    $coupon->delete();

    return response()->json([
        'message' => 'Coupon deleted successfully.'
    ]);
}






public function editCoupon(Request $request)
    {
       
        // Validate the incoming request data
        $request->validate([
            'coupon_id'      => 'required|exists:coupons,coupon_id', // Validate the coupon ID
            'product_id'     => 'required|exists:product,product_id', // Validate the product ID
            'product_name'   => 'required|string|max:255', // Validate the product name
            'coupon_code'    => 'required|string|max:255', // Validate the coupon code
            'discount_price' => 'required|numeric|min:0', // Validate the discount price
            'expiry_date'    => 'required|date|after_or_equal:today', // Validate the expiry date
            'status'         => 'required|in:active,inactive', // Validate the status
        ]);
        // Find the coupon by its ID
        $coupon = Coupon::find($request->coupon_id);

        if (!$coupon) {
            return response()->json([
                'message' => 'Coupon not found.',
            ], 404);
        }

        // Update the coupon fields
        $coupon->product_id = $request->product_id;
        $coupon->product_name = $request->product_name;
        $coupon->coupon_code = $request->coupon_code;
        $coupon->discount_price = $request->discount_price;
        $coupon->expiry_date = $request->expiry_date;
        $coupon->status = $request->status;

        // Save the updated coupon to the database
        $coupon->save();

        // Return a response confirming the update
        return response()->json([
            'message' => 'Coupon updated successfully.',
            'coupon' => $coupon
        ]);
    }






}