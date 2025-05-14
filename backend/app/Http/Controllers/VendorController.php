<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

use App\Models\Vendor;
use App\Models\PersonalInfo;
use App\Models\BusinessInfo;
use App\Models\BankInfo;
use App\Models\Product;
use App\Models\Cart;
use App\Models\Category;
use App\Models\SubCategory;
use App\Models\Orders;
use App\Models\Notification;
use App\Models\Review;
use App\Models\User;

class VendorController extends Controller
{

    public function register(Request $req)
    {
        $validated = $req->validate([
            'email' => 'required|email|unique:vendors,email',
            'password' => [
                'required',
                'string',
                'min:8', // Minimum length of 8 characters
                'regex:/[A-Z]/', // At least one uppercase letter
                'regex:/[a-z]/', // At least one lowercase letter
                'regex:/[\W_]/', // At least one special character (non-word character)
                'confirmed', // Ensure password matches password_confirmation
            ],
        ]);

        if ($validated) {
            $vendor = new Vendor;
            $vendor->email = $req->input('email');

            $vendor->password = Hash::make($req->input('password'));
            if ($vendor->save()) {
                return response()->json([
                    'success' => true,
                    'message' => 'Account created successfully!',
                    'user' => $vendor
                ], 201); // HTTP 201 means "Created"
            } else {
                return response()->json([
                    'success' => false,
                    'message' => 'Failed to create account. Please try again.'
                ], 500); // HTTP 500 for server error
            }
        }
    }

    public function login(Request $req)
    {
        // Validate the inputs to ensure email and password are provided
        $req->validate([
            'email' => 'required|email',
            'password' => [
                'required',
                'string',
                'min:8',
                'regex:/[A-Z]/',
                'regex:/[a-z]/',
                'regex:/[\W_]/',
            ],
        ]);

        $user = Vendor::where('email', $req->email)->first();

        // Check if the user exists and if the password matches
        if (!$user || !Hash::check($req->password, $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid email or password',
            ], 401); // Changed from 500 to 401 for unauthorized
        }

        // Check if vendor has completed their information
        $hasCompletedInfo = PersonalInfo::where('vendor_id', $user->vendor_id)->exists() &&
            BusinessInfo::where('vendor_id', $user->vendor_id)->exists() &&
            BankInfo::where('vendor_id', $user->vendor_id)->exists();

        return response()->json([
            'success' => true,
            'message' => 'Logged in successfully!',
            'storeData' => [
                'email' => $user->email,
                "vendor_id" => $user->vendor_id,
                'vendor_role_id' => $user->vendor_role_id,
                "status" => $user->status,
                "has_completed_info" => $hasCompletedInfo
            ]
        ], 200); // Changed from 201 to 200 for successful login
    }


    /**
     * Get vendor details by ID
     *
     * @param int $id Vendor ID
     * @return JsonResponse
     */
    public function getVendorDetails(int $id): JsonResponse
    {
        $vendor = Vendor::with('personalInfo')->findOrFail($id);
        return response()->json([
            'success' => true,
            'data' => [
                'vendor' => $vendor
            ]
        ]);
    }

    /**
     * Get products for a specific vendor
     *
     * @param int $id Vendor ID
     * @return JsonResponse
     */
    public function getVendorProducts(int $id): JsonResponse
    {
        $products = Product::where('vendor_id', $id)->get();

        return response()->json([
            'success' => true,
            'data' => [
                'products' => $products
            ]
        ]);
    }

    // Get all featured vendors
    public function getFeaturedVendors(): JsonResponse
    {
        $featuredVendors = Vendor::with('personalInfo')
            ->where('is_featured', true)
            ->get();

        return response()->json([
            'success' => true,
            'data' => [
                'featured_vendors' => $featuredVendors
            ]
        ]);
    }

    // Get all categories
    public function getCategories(): JsonResponse
    {
        $categories = Category::all();

        return response()->json([
            'success' => true,
            'data' => $categories
        ]);
    }

    // Get categories associated with a vendor's products
    public function getVendorCategories(int $id): JsonResponse
    {
        $vendor = Vendor::findOrFail($id);
        $categories = $vendor->products()->distinct()->pluck('category_id');
        $vendorCategories = Category::whereIn('category_id', $categories)->get();

        return response()->json([
            'success' => true,
            'data' => $vendorCategories
        ]);
    }
    public function updatepassword(Request $request)
    {
        // Validate the incoming request to ensure passwords are valid
        $request->validate([
            'vendor_id' => 'required|integer', // Ensure vendor_id is provided
            'current_password' => 'required|string', // Ensure current password is provided
            'new_password' => 'required|string', // Ensure new password matches password_confirmation

        ]);

        // Find the vendor by vendor_id

        if ($request->password_confirmation !== $request->new_password) {
            return response()->json([
                'success' => false,
                'message' => 'Password confirmation does not match.',
            ], 400); // HTTP 400 for bad request
        }


        $vendor = Vendor::find($request->vendor_id);

        if (!$vendor) {
            return response()->json(['error' => 'Vendor not found'], 404);
        }

        // Check if the current password is correct
        if (!Hash::check($request->current_password, $vendor->password)) {
            return response()->json(['error' => 'Current password is incorrect'], 400);
        }

        // Hash the new password and update it
        $vendor->password = bcrypt($request->new_password);
        $vendor->save();

        return response()->json(['message' => 'Password updated successfully'], 200);
    }

    public function vendorinfo(Request $request)
    {
        // Validate incoming request data
        $validator = Validator::make($request->all(), [
            'personal_name' => 'required|string|max:100',
            'personal_address' => 'required|string|max:100',
            'personal_city' => 'required|string|max:100',
            'personal_state' => 'required|string|max:100',
            'personal_phone' => 'required|string|max:100',
            'personal_unique_id' => 'required|integer',
            'idPhotoFront' => 'required|image|max:2048',
            'idPhotoBack' => 'required|image|max:2048',
            'business_name' => 'required|string|max:100',

            'business_address' => 'required|string|max:100',
            'business_city' => 'required|string|max:100',
            'business_phone' => 'required|string|max:100',
            'blicense_number' => 'required|integer',
            'addressProofImage' => 'required|image|max:2048',
            'otherProofImages.*' => 'image|max:2048', // Up to 5 images
            'bank_name' => 'required|string|max:100',
            'account_name' => 'required|string|max:100',
            'account_number' => 'required|string|max:100',
            'vendor_id' => 'required|integer', // Accept vendor_id from user
            'verified_by' => 'nullable|integer', // Accept verified_by from user
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 400);
        }

        // Store uploaded files
        $idPhotoFrontPath = $request->file('idPhotoFront')->store('id_photos', 'public');
        $idPhotoBackPath = $request->file('idPhotoBack')->store('id_photos', 'public');
        $addressProofPath = $request->file('addressProofImage')->store('address_proofs', 'public');

        // Create personal info record
        $personalInfo = PersonalInfo::create([
            'personal_name' => $request->personal_name,
            'personal_address' => $request->personal_address,
            'personal_city' => $request->personal_city,
            'personal_state' => $request->personal_state,
            'personal_phone' => $request->personal_phone,
            'personal_unique_id' => $request->personal_unique_id,
            'id_front_side' => $idPhotoFrontPath,
            'id_back_side' => $idPhotoBackPath,
            'vendor_id' => $request->vendor_id, // Use user-provided vendor_id
            'verified_by' => $request->verified_by, // Use user-provided verified_by
        ]);

        // Create business info record
        $businessInfo = BusinessInfo::create([
            'business_name' => $request->business_name,
            'business_address' => $request->business_address,
            'business_city' => $request->business_city,
            'business_state' => $request->business_state,
            'business_phone' => $request->business_phone,
            'blicense_number' => $request->blicense_number,
            'address_proof_img' => $addressProofPath,
            'other_img_one' => $request->file('otherProofImages.0') ? $request->file('otherProofImages.0')->store('other_proofs', 'public') : null,
            'other_img_two' => $request->file('otherProofImages.1') ? $request->file('otherProofImages.1')->store('other_proofs', 'public') : null,
            'other_img_three' => $request->file('otherProofImages.2') ? $request->file('otherProofImages.2')->store('other_proofs', 'public') : null,
            'other_img_four' => $request->file('otherProofImages.3') ? $request->file('otherProofImages.3')->store('other_proofs', 'public') : null,
            'other_img_five' => $request->file('otherProofImages.4') ? $request->file('otherProofImages.4')->store('other_proofs', 'public') : null,
            'vendor_id' => $request->vendor_id, // Use user-provided vendor_id
            'verified_by' => $request->verified_by, // Use user-provided verified_by
        ]);
        // Create bank info record
        $bankInfo = BankInfo::create([
            'bank_name' => $request->bank_name,
            'account_name' => $request->account_name,
            'account_number' => $request->account_number,
            'vendor_id' => $request->vendor_id, // Use user-provided vendor_id
            'verified_by' => $request->verified_by, // Use user-provided verified_by
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Vendor information submitted successfully.',
            'data' => [
                'personalInfo' => $personalInfo,
                'businessInfo' => $businessInfo,
                'bankInfo' => $bankInfo,
            ]
        ], 201);
    }

    public function addproduct(Request $request)
    {
        // ✅ Step 1: Validate request data
        $validated = $request->validate([
            'product_name'      => 'required|string|max:100',
            'total_product'     => 'required|integer',
            'product_price'     => 'required|numeric',
            'product_desc'      => 'required|string|max:100',
            'vendor_id'         => 'required|exists:vendors,vendor_id',
            'category_id'       => 'required|exists:category,category_id',
            'sub_category_id'   => 'required|exists:sub_category,sub_category_id',
            'status'            => 'in:Active,Inactive',
            'product_img1'      => 'required|image|mimes:jpeg,png,jpg,gif',
            // 'product_img1'      => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
            'product_img2'      => 'nullable|image|mimes:jpeg,png,jpg,gif',
            'product_img3'      => 'nullable|image|mimes:jpeg,png,jpg,gif',
            'product_img4'      => 'nullable|image|mimes:jpeg,png,jpg,gif',
            'product_img5'      => 'nullable|image|mimes:jpeg,png,jpg,gif',
        ]);

        // ✅ Step 2: Handle image uploads
        $imageFields = ['product_img1', 'product_img2', 'product_img3', 'product_img4', 'product_img5'];

        foreach ($imageFields as $field) {
            if ($request->hasFile($field)) {
                $imageName = Str::uuid() . '.' . $request->file($field)->getClientOriginalExtension();
                $path = 'products/' . $imageName;
                $request->file($field)->storeAs('public/products', $imageName);
                $validated[$field] = $path;
            } else {
                $validated[$field] = null;
            }
        }
        // ✅ Step 3: Create product
        $product = Product::create([
            'product_name'      => $validated['product_name'],
            'total_product'     => $validated['total_product'],
            'product_price'     => $validated['product_price'],
            'product_desc'      => $validated['product_desc'],
            'vendor_id'         => $validated['vendor_id'],
            'category_id'       => $validated['category_id'],
            'sub_category_id'   => $validated['sub_category_id'],
            'product_status'            => $validated['product_status'] ?? 'Active',
            'product_img1'      => $validated['product_img1'],
            'product_img2'      => $validated['product_img2'],
            'product_img3'      => $validated['product_img3'],
            'product_img4'      => $validated['product_img4'],
            'product_img5'      => $validated['product_img5'],
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Product added successfully!',
            'data' => $product
        ], 201);
    }

    public function productlist(Request $request)
    {
        // Get the vendor_id from the request
        $vendor_id = $request->input('vendor_id');

        // Fetch products for the authenticated vendor with eager loading of category and sub-category
        $products = Product::where('vendor_id', $vendor_id)
            ->with(['category', 'subCategory']) // Eager load category and subCategory relationships
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
                'product_status',
                'category_id',
                'sub_category_id',
                'vendor_id'
            )
            ->get();

        // Transform the product data to include category and subcategory names
        $products = $products->map(function ($product) {
            // Add category and sub-category names to the product
            return [
                'product_id' => $product->product_id,
                'product_name' => $product->product_name,
                'total_product' => $product->total_product,
                'product_price' => $product->product_price,
                'product_img1' => $product->product_img1,
                'product_img2' => $product->product_img2,
                'product_img3' => $product->product_img3,
                'product_img4' => $product->product_img4,
                'product_img5' => $product->product_img5,
                'product_desc' => $product->product_desc,
                'product_status' => $product->product_status,
                'category_name' => $product->category->category_name, // Get category name from relationship
                'sub_category_name' => $product->subCategory->sub_category_name, // Get sub-category name from relationship
                'vendor_id' => $product->vendor_id,
            ];
        });

        // Return the transformed product data with category and subcategory names
        return response()->json($products);
    }

    public function deleteProduct(Request $request)
    {
        $productId = $request->input('product_id');
        $product = Product::find($productId);

        if ($product) {
            $product->delete();
            return response()->json(['message' => 'Product deleted successfully']);
        }

        return response()->json(['message' => 'Product not found'], 404);
    }

    public function orderlist(Request $request)
    {
        // Get vendor_id and order_status from the request
        $vendor_id = $request->input('vendor_id');
        $order_status = $request->input('order_status');

        // Retrieve orders with product and address details
        $orders = Orders::where('vendor_id', $vendor_id)
            ->where('order_status', $order_status)
            ->with([
                'product' => function ($query) {
                    $query->select('product_id', 'product_name', 'product_img1');
                },
                'address' => function ($query) {
                    $query->select(
                        'address_id',
                        'full_name',
                        'phone',
                        'country',
                        'state',
                        'city',
                        'post'
                    );
                }
            ])
            ->select(
                'order_id',
                'user_id',
                'product_id',
                'address_id',
                'payment_method',
                'created_at as order_time',
                'order_status',
                'total_paid',
                'orderd_quantity'
            )
            ->get();

        // Format the response
        $formattedOrders = $orders->map(function ($order) {
            $address = $order->address;
            $fullAddress = $address
                ? trim("{$address->country}, {$address->state}, {$address->city}, " . ($address->post ? $address->post : ''), ', ')
                : 'Address not available';


            return [
                'order_id' => $order->order_id,
                'product_id' => $order->product_id,
                'product_name' => $order->product->product_name ?? 'N/A',
                'product_image' => $order->product->product_img1 ?? null,
                'payment_method' => $order->payment_method,
                'order_time' => $order->order_time ? $order->order_time->toDateTimeString() : 'N/A',
                'order_status' => $order->order_status,

                // Extra info
                'address' => $fullAddress,
                'phone' => $address->phone ?? 'N/A',
                'full_name' => $address->full_name ?? 'N/A',
                'total_paid' => $order->total_paid,
                'ordered_quantity' => $order->orderd_quantity,
            ];
        });

        return response()->json($formattedOrders);
    }

    public function updateorderstatus(Request $request)
    {
        // Validate the incoming request data
        $request->validate([
            'order_id' => 'required|integer|exists:orders,order_id', // Ensure the order_id is valid and exists in the database
            'new_status' => 'required|string|in:Pending,Completed,Cancelled,Shipped', // Only allow these statuses
        ]);

        // Find the order by ID
        $order = Orders::find($request->order_id);

        // Update the order status
        $order->order_status = $request->new_status;

        // Save the order with the new status
        if ($order->save()) {
            return response()->json(['message' => 'Order status updated successfully'], 200);
        }

        // Return error if save failed
        return response()->json(['message' => 'Failed to update order statussss'], 500);
    }

    public function categoryandsubcategory($category_id)
    {
        $subcategories = SubCategory::where('category_id', $category_id)->get();
        return response()->json($subcategories);
    }

    public function editproduct(Request $request)
    {
        // ✅ Step 1: Validate the incoming data
        $validated = $request->validate([
            'product_id' => 'required|integer',
            'product_name' => 'required|string|max:255',
            'product_price' => 'required|numeric',
            'total_product' => 'required|integer',
            'product_desc' => 'nullable|string',
            'product_status' => 'nullable|string|in:Active,Inactive',
            'category_id' => 'required|integer',
            'sub_category_id' => 'required|integer',
            'product_img1' => 'nullable|image|mimes:jpeg,png,jpg,gif',
            'product_img2' => 'nullable|image|mimes:jpeg,png,jpg,gif',
            'product_img3' => 'nullable|image|mimes:jpeg,png,jpg,gif',
            'product_img4' => 'nullable|image|mimes:jpeg,png,jpg,gif',
            'product_img5' => 'nullable|image|mimes:jpeg,png,jpg,gif',
        ]);

        // ✅ Step 2: Find the product by ID
        $product = Product::find($validated['product_id']);

        if (!$product) {
            return response()->json(['error' => 'Product not found'], 404);
        }

        // ✅ Step 3: Update text fields
        $product->product_name = $validated['product_name'];
        $product->product_price = $validated['product_price'];
        $product->total_product = $validated['total_product'];
        $product->product_desc = $request->input('product_desc', $product->product_desc); // Optional
        $product->product_status = $request->input('product_status', $product->product_status); // Optional
        $product->category_id = $validated['category_id'];
        $product->sub_category_id = $validated['sub_category_id'];

        // ✅ Step 4: Handle image uploads
        $imageFields = ['product_img1', 'product_img2', 'product_img3', 'product_img4', 'product_img5'];

        foreach ($imageFields as $field) {
            if ($request->hasFile($field)) {
                $imageName = Str::uuid() . '.' . $request->file($field)->getClientOriginalExtension();
                $path = 'products/' . $imageName;
                $request->file($field)->storeAs('public/products', $imageName);
                $product->$field = $path;
            }
        }

        $product->save();

        // ✅ Step 5: Return updated product
        return response()->json([
            'status' => 'success',
            'message' => 'Product updated successfully!',
            'product' => $product
        ], 200);
    }

    public function addNotification(Request $request)
    {
        // Validate the incoming request data
        $validatedData = $request->validate([
            'notification_text' => 'required|string|max:255',
            'user_id' => 'required|integer|exists:users,user_id',
            'vendor_id' => 'required|integer|exists:vendors,vendor_id',

        ]);

        // Create a new notification
        $notification = Notification::create($validatedData);

        // Return a response (you can customize the response as needed)
        return response()->json([
            'message' => 'Notification added successfully',
            'notification' => $notification,
        ], 201);
    }

    public function getNotifications(Request $request)
    {
        // Validate the incoming request data
        $validatedData = $request->validate([
            'vendor_id' => 'required|integer|exists:vendors,vendor_id',
        ]);

        // Retrieve notifications for the specified vendor where admin_id is not null
        $notifications = Notification::where('vendor_id', $validatedData['vendor_id'])
            ->whereNotNull('admin_id') // Check if admin_id is not null
            ->get();

        // Return the notifications in a response
        return response()->json([
            'notifications' => $notifications,
        ], 200);
    }

    public function deleteNotification(Request $request)
    {
        // Validate the incoming request data
        $validatedData = $request->validate([
            'vendor_id' => 'required|integer',
            'notification_id' => 'required|integer',
        ]);
        // Find the notification
        $notification = Notification::where('notification_id', $validatedData['notification_id'])
            ->where('vendor_id', $validatedData['vendor_id'])
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
    public function listproduct(Request $request)
    {
        $validatedData = $request->validate([
            'vendor_id' => 'required|integer',
        ]);

        $products = Product::where('vendor_id', $validatedData['vendor_id'])
            ->select(
                'product_id',
                'product_name',
            )
            ->get();

        return response()->json($products);
    }

    public function listreview(Request $request)
    {
        $validatedData = $request->validate([
            'product_id' => 'required|integer',
        ]);

        $reviews = Review::where('product_id', $validatedData['product_id'])
            ->with('user:user_id,name') // Fetching the user with only id and name
            ->select('review_txt', 'rate', 'created_at', 'user_id') // Include user_id for reference
            ->get();

        return response()->json([
            'success' => true,
            'data' => $reviews,
        ]);
    }

 public function analytics(Request $request)
{
    $vendorId = $request->input('vendor_id');

    // General counts
    $totalOrders = Orders::where('vendor_id', $vendorId)->count();
    $pendingOrders = Orders::where('vendor_id', $vendorId)
                            ->where('order_status', 'Pending')
                            ->count();
    $completedOrders = Orders::where('vendor_id', $vendorId)
                             ->where('order_status', 'Completed')
                             ->count();
    $shippedOrders = Orders::where('vendor_id', $vendorId)
                           ->where('order_status', 'Shipped')
                           ->count();

    // Time-based analytics (e.g., daily counts)
    $dateRange = now()->subDays(30); // Adjust the range as needed
    $dailyOrders = Orders::where('vendor_id', $vendorId)
                         ->where('created_at', '>=', $dateRange)
                         ->selectRaw('DATE(created_at) as date, COUNT(*) as count')
                         ->groupBy('date')
                         ->orderBy('date')
                         ->get();

    // Prepare data for chart
    $orderDates = $dailyOrders->pluck('date');
    $orderCounts = $dailyOrders->pluck('count');

    return response()->json([
        'total_orders' => $totalOrders,
        'pending_orders' => $pendingOrders,
        'shipped_orders' => $shippedOrders,
        'completed_orders' => $completedOrders,
        'daily_orders' => [
            'dates' => $orderDates,
            'counts' => $orderCounts,
        ],
    ]);
}


}