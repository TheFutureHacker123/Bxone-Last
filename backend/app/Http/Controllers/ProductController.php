<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Category;
use App\Models\Orders;
use App\Models\Cart;
use App\Models\Review;
use App\Models\OrderItem;
use App\Models\Coupon;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ProductController extends Controller
{
    // Search function to find products based on user input
    public function search(Request $request)
    {

        // Get the search query from user input
        $searchQuery = $request->input('searchproduct');

        $products = Product::where('product_name', 'like', '%' . $searchQuery . '%')
            ->where('product_status', 'Active')
            ->where('total_product', '>', 1)
            ->select('product_id', 'product_name', 'total_product', 'product_price', 'product_img1', 'product_img2', 'product_img3', 'product_img4', 'product_img5', 'product_desc', 'vendor_id', 'category_id', 'sub_category_id') // Select only the desired fields
            ->get();

        // Return the results (you can also return a view with these products)
        return response()->json($products);
    }

    public function topproduct(Request $request)
    {
        // Fetch 12 random products
        $products = Product::inRandomOrder()
            ->where('product_status', 'Active')
            ->where('total_product', '>', 1)
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

    public function newArrivals()
    {
        // Adjust the query as needed (e.g., order by created_at, limit 10)
        $products = \App\Models\Product::orderBy('created_at', 'desc')
            ->take(10)
            ->get();

        return response()->json($products);
    }

    public function categorylist()
    {
        $categories = Category::with('subCategories')->get(); // Eager loading sub-categories
        return response()->json($categories);
    }

    public function productdetails(Request $request)
    {
        $validatedData = $request->validate([
            'product_id' => 'required|integer',
        ]);

        // Fetch the product info
        $product = Product::select(
            'product_id',
            'product_name',
            'product_desc',
            'product_price',
            'product_img1',
            'product_img2',
            'product_img3',
            'product_img4',
            'product_img5'
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
        } else {
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
            ->where('product.product_status', 'Active') 
        ->where('product.total_product', '>', 1)
        ->select(
                'product.product_name',
                'product.product_id', // Add product_id here
                'product.vendor_id',  // Add vendor_id here
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

    public function updateCartQuantity(Request $request)
    {
        $request->validate([
            'user_id' => 'required|integer',
            'cart_id' => 'required|integer',
            'total_added' => 'required|integer|min:1',
        ]);

        $cartItem = Cart::where('user_id', $request->user_id)
            ->where('cart_id', $request->cart_id)
            ->first();

        if (!$cartItem) {
            return response()->json(['success' => false, 'message' => 'Cart item not found']);
        }

        $product = Product::find($cartItem->product_id);
        if (!$product) {
            return response()->json(['success' => false, 'message' => 'Product not found']);
        }

        // Fix: use correct column name for product quantity
        $availableQty = $product->total_product ?? $product->product_quantity ?? null;
        if ($availableQty === null) {
            return response()->json(['success' => false, 'message' => 'Product stock information unavailable']);
        }

        if ($request->total_added > $availableQty) {
            return response()->json([
                'success' => false,
                'message' => "Requested quantity ({$request->total_added}) exceeds available stock ({$availableQty})"
            ]);
        }

        $cartItem->total_added = $request->total_added;
        if ($cartItem->save()) {
            return response()->json(['success' => true, 'message' => 'Cart quantity updated successfully']);
        } else {
            return response()->json(['success' => false, 'message' => 'Failed to update cart quantity']);
        }
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

     public function processOrder(Request $request)
    {
        $request->validate([
            'user_id' => 'required|integer',
            'cartItems' => 'required|array|min:1',
            'cartItems.*.cart_id' => 'required|integer',
            'cartItems.*.product_id' => 'required|integer',
            'cartItems.*.vendor_id' => 'required|integer',
            'cartItems.*.product_name' => 'required|string',
            'cartItems.*.product_price' => 'required|numeric|min:0',
            'cartItems.*.total_added' => 'required|integer|min:1',
            'shippingAddress' => 'nullable|array',
        ]);

        try {
            DB::beginTransaction();

            $totalProductPrice = 0;
            $order = new Orders();
            $order->user_id = $request->user_id;
            $order->order_status = 'pending';
            $order->payment_method = 'chapa';
            $order->orderd_quantity = 0;
            $order->address_id = $request->shippingAddress ? $request->shippingAddress['address_id'] ?? null : null;
            $order->save();

            $cartItemIdsToDelete = [];

            foreach ($request->cartItems as $cartItem) {
                $totalProductPrice += $cartItem['product_price'] * $cartItem['total_added'];
                $order->orderd_quantity += $cartItem['total_added'];

                OrderItem::create([
                    'order_id' => $order->order_id,
                    'product_id' => $cartItem['product_id'],
                    'product_name' => $cartItem['product_name'],
                    'product_price' => $cartItem['product_price'],
                    'quantity' => $cartItem['total_added'],
                ]);

                $cartItemIdsToDelete[] = $cartItem['cart_id'];
            }

           error_log('Total Product Price before saving order: ' . $totalProductPrice);
            $order->total_paid = $totalProductPrice;
            $order->save();

            // Calculate fees
            $serviceFeePercentage = 0.03;
            $deliveryFee = 5;
            $serviceFee = $totalProductPrice * $serviceFeePercentage;
            $totalAmount = $totalProductPrice + $serviceFee + $deliveryFee;

            // Create a payment record
            $payment = new Payment();
            $payment->order_id = $order->order_id;
            $payment->total_amount = $totalAmount;
            $payment->payment_status = 'held';
            $payment->save();

            // Delete only the processed cart items
            Cart::whereIn('cart_id', $cartItemIdsToDelete)
                ->where('user_id', $request->user_id)
                ->delete();

            DB::commit();

            return response()->json(['success' => true, 'message' => 'Order placed successfully! Redirecting to payment.', 'order_id' => $order->order_id]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['success' => false, 'message' => 'Failed to process order.', 'error' => $e->getMessage()], 500);
        }
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
        // Check if coupon code already exists before validation
        if (Coupon::where('coupon_code', strtoupper($request->coupon_code))->exists()) {
            return response()->json([
                'message' => 'The coupon already exists.'
            ], 409); // 409 Conflict
        }

        // Validate the incoming request data (after checking for duplicate)
        $request->validate([
            'product_id'      => 'required|exists:product,product_id',
            'vendor_id'       => 'required|exists:vendors,vendor_id',
            'product_name'    => 'required|string|max:255',
            'coupon_code'     => 'required|string|max:255',
            'discount_price'  => 'required|numeric|min:0',
            'expiry_date'     => 'required|date|after:today',
            'status'          => 'required|in:active,inactive',
        ]);

        // Check if vendor is approved
        $vendor = \App\Models\Vendor::find($request->vendor_id);
        if (!$vendor || !$vendor->is_approved) {
            return response()->json([
                'message' => 'Vendor not approved to add coupons.'
            ], 403);
        }

        // Check product existence and price comparison
        $product = Product::find($request->product_id);
        if (!$product) {
            return response()->json([
                'message' => 'Product not found.'
            ], 404);
        }

        if ($request->discount_price >= $product->product_price) {
            return response()->json([
                'message' => 'Discount price cannot be greater than or equal to product price.',
            ], 422);
        }

        // Limit coupon count per vendor to 20
        $couponCount = Coupon::where('vendor_id', $request->vendor_id)->count();
        if ($couponCount >= 20) {
            return response()->json([
                'message' => 'You can’t add more than 20 coupons.'
            ], 403);
        }

        // Create the coupon
        $coupon = Coupon::create([
            'product_id'      => $request->product_id,
            'vendor_id'       => $request->vendor_id,
            'product_name'    => $request->product_name,
            'coupon_code'     => strtoupper($request->coupon_code),
            'discount_price'  => $request->discount_price,
            'expiry_date'     => $request->expiry_date,
            'status'          => $request->status,
        ]);

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
            'coupon_id'      => 'required|exists:coupons,coupon_id',
            'product_id'     => 'required|exists:product,product_id',
            'product_name'   => 'required|string|max:255',
            'coupon_code'    => 'required|string|max:255',
            'discount_price' => 'required|numeric|min:0',
            'expiry_date'    => 'required|date|after_or_equal:today',
            'status'         => 'required|in:active,inactive',
            'vendor_id'      => 'required|exists:vendors,vendor_id'
        ]);

        $vendor_id = $request->vendor_id;

        // Get the related product
        $product = Product::find($request->product_id);

        if (!$product) {
            return response()->json([
                'message' => 'Product not found.',
            ], 404);
        }

        // Check if discount price is less than product price
        if ($request->discount_price >= $product->product_price) {
            return response()->json([
                'message' => 'Discount price cannot be greater than or equal to product price.',
            ], 422);
        }

        // Find the coupon
        $coupon = Coupon::find($request->coupon_id);

        if (!$coupon) {
            return response()->json([
                'message' => 'Coupon not found.',
            ], 404);
        }

        // Update coupon fields
        $coupon->product_id = $request->product_id;
        $coupon->product_name = $request->product_name;
        $coupon->coupon_code = strtoupper($request->coupon_code); // Optional: force uppercase
        $coupon->discount_price = $request->discount_price;
        $coupon->expiry_date = $request->expiry_date;
        $coupon->status = $request->status;

        $coupon->save();

        // Get all coupons for this vendor
        $coupons = Coupon::with('product')
            ->where('vendor_id', $vendor_id)
            ->get();

        return response()->json([
            'message' => 'Coupons retrieved successfully.',
            'coupon' => $coupons
        ]);
    }







    public function oneVendorProducts(Request $request)
    {
        // Validate the incoming request
        $request->validate([
            'vendor_id' => 'required|integer|exists:vendors,vendor_id',
        ]);

        // Get the vendor_id from the request
        $vendorId = $request->input('vendor_id');

        // Retrieve product IDs and names for the specified vendor
        $products = Product::where('vendor_id', $vendorId)
            ->select('product_id', 'product_name')
            ->get();

        // Return the products as a JSON response
        return response()->json($products);
    }

    public function applyCoupon(Request $request)
    {
        // Validate the request to ensure coupon_code and product_id are provided
        $request->validate([
            'coupon_code' => 'required|string',
            'product_id' => 'required|integer|exists:product,product_id',
        ]);

        // Retrieve the coupon based on coupon_code and product_id
        $coupon = Coupon::where('coupon_code', $request->coupon_code)
            ->where('product_id', $request->product_id)
            ->first();

        // Check if the coupon exists and is active
        if ($coupon) {
            if ($coupon->status === 'inactive') {
                return response()->json([
                    'success' => false,
                    'message' => 'Coupon not found'
                ], 404);
            }

            // Extract the desired fields
            $couponDetails = [
                'coupon_code' => $coupon->coupon_code,
                'product_id' => $coupon->product_id,
                'discount_price' => $coupon->discount_price,
                'expiry_date' => $coupon->expiry_date,
                'status' => $coupon->status,
            ];

            return response()->json([
                'success' => true,
                'data' => $couponDetails,
                'message' => 'Coupon applied successfully!'
            ]);
        } else {
            return response()->json([
                'success' => false,
                'message' => 'Coupon not found'
            ], 404);
        }
    }
}