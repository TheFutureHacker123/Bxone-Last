<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Models\Admin;
use App\Models\User;
use App\Models\Vendor;
use App\Models\PersonalInfo;
use App\Models\businessInfo;
use App\Models\bankInfo;
use App\Models\Category;
use App\Models\SubCategory;
use App\Models\Notification;
use App\Models\Orders;
use App\Models\Product;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
class AdminController extends Controller
{
    //
public function loginadmin(Request $request)
{
    $request->validate([
        'email' => 'required|email',
        'password' => 'required|string|min:6',
    ]);

    // Find admin by email
    $admin = Admin::where('email', $request->email)->first();

    if (!$admin) {
        return response()->json([
            'success' => false,
            'message' => 'Invalid email or password.',
        ], 401);
    }

    // Check status before password verification
    if ($admin->status === 'Suspended') {
        return response()->json([
            'success' => false,
            'status' => 'Suspended',
        ], 403);
    } elseif ($admin->status !== 'Active') {
        return response()->json([
            'success' => false,
            'status' => 'Your account status does not allow login.',
        ], 403);
    }

    // Check password
    if (Hash::check($request->password, $admin->password)) {
        return response()->json([
            'success' => true,
            'message' => 'Login successful.',
            'admin' => [
                'admin_id' => $admin->admin_id,
                'admin_role_id' => $admin->admin_role_id,
            ],
        ]);
    } else {
        return response()->json([
            'success' => false,
            'message' => 'Invalid email or password.',
        ], 401);
    }
}



   // Fetch users
    public function listusers()
    {
        $users = User::all(); // Fetch all users
        return response()->json(['users' => $users]);
    }

    public function listadmins()
    {
        $users = Admin::where("admin_role_id", "!=", "SuperAdmin")->get(); // Fetch all users who are not superadmins
        return response()->json(['users' => $users]);
    }


    public function changeuserstatusadmin(Request $request)
    {
        // Validate the incoming request
        $validator = Validator::make($request->all(), [
            'admin_id' => 'required|exists:admins,admin_id',
            'status' => 'required|in:Active,Suspended',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 400);
        }
        // Find the user and update the status
        $admin = Admin::find($request->admin_id);
        $admin->status = $request->status; // Update status
        $admin->save();

        return response()->json(['success' => true, 'user' => $admin]);
    }



    // Change user status
    public function changeuserstatus(Request $request)
    {
        // Validate the incoming request
        $validator = Validator::make($request->all(), [
            'user_id' => 'required|exists:users,user_id',
            'status' => 'required|in:Active,Suspended',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 400);
        }
        // Find the user and update the status
        $user = User::find($request->user_id);
        $user->status = $request->status; // Update status
        $user->save();

        return response()->json(['success' => true, 'user' => $user]);
    }


    // Fetch vendor
    public function listvendors()
    {
        $users = Vendor::all(); // Fetch all users
        return response()->json(['users' => $users]);
    }

    // Change vendor status
    public function changeVendorStatus(Request $request)
    {
        $vendor = Vendor::find($request->vendor_id);
        if ($vendor) {
            $vendor->status = $request->status;
            // Approve only if status is Verified
            $vendor->is_approved = ($request->status === 'Verified') ? 1 : 0;
            $vendor->save();
            return response()->json(['success' => true]);
        }
        return response()->json(['success' => false], 404);
    }

    // update admin password

    public function updatepassword(Request $request)
    {
        // Validate the incoming request
        $validator = Validator::make($request->all(), [
            'admin_id' => 'required|exists:admins,admin_id',
            'current_password' => 'required|string|min:6',
            'new_password' => 'required|string|min:6|confirmed',
        ]);

        if($request->password_confirmation !== $request->new_password){ 
            return response()->json([
                 'success' => false,
                 'message' => 'Password confirmation does not match.',
             ], 400); // HTTP 400 for bad request
         }
 


        // Find the admin and check the old password
        $admin = Admin::find($request->admin_id);
        if (Hash::check($request->current_password, $admin->password)) {
            // Update password
            $admin->password = Hash::make($request->new_password);
            $admin->save();

            return response()->json(['success' => true, 'message' => 'Password updated successfully.']);
        } else {
            return response()->json(['success' => false, 'message' => 'Old password is incorrect.'], 401);
        }
    }








    public function newvendorrequest(Request $request)
    {
        // Validate the incoming request
        $request->validate([
            'vendor_id' => 'required|integer|exists:vendors,vendor_id',
        ]);
    
        // Retrieve the vendor_id from the request
        $vendorId = $request->input('vendor_id');
    
        // Fetch personal info
        $personalInfo = PersonalInfo::where('vendor_id', $vendorId)->first();
    
        // Fetch business info
        $businessInfo = businessInfo::where('vendor_id', $vendorId)->first();
    
        // Fetch bank info
        $bankInfo = bankInfo::where('vendor_id', $vendorId)->first();
    
        // Prepare the response data
        $responseData = [
            'Personal Info' => [
                'personal_name' => $personalInfo->personal_name ?? null,
                'personal_address' => $personalInfo->personal_address ?? null,
                'personal_city' => $personalInfo->personal_city ?? null,
                'personal_state' => $personalInfo->personal_state ?? null,
                'personal_phone' => $personalInfo->personal_phone ?? null,
                'personal_unique_id' => $personalInfo->personal_unique_id ?? null,
                'id_front_side' => $personalInfo->id_front_side ?? null,
                'id_back_side' => $personalInfo->id_back_side ?? null,
            ],
            'Business Information' => [
                'business_name' => $businessInfo->business_name ?? null,
                'business_address' => $businessInfo->business_address ?? null,
                'business_city' => $businessInfo->business_city ?? null,
                'business_state' => $businessInfo->business_state ?? null,
                'business_phone' => $businessInfo->business_phone ?? null,
                'blicense_number' => $businessInfo->blicense_number ?? null,
                'address_proof_img' => $businessInfo->address_proof_img ?? null,
                'other_proof_images' => [
                    $businessInfo->other_img_one ?? null,
                    $businessInfo->other_img_two ?? null,
                    $businessInfo->other_img_three ?? null,
                    $businessInfo->other_img_four ?? null,
                    $businessInfo->other_img_five ?? null,
                ],
            ],
            'Bank Info' => [
                'bank_name' => $bankInfo->bank_name ?? null,
                'account_name' => $bankInfo->account_name ?? null,
                'account_number' => $bankInfo->account_number ?? null,
            ],
        ];
    
        // Return the response as JSON
        return response()->json($responseData);
    }




   public function listnewvendors(Request $request)
{
    // Fetch only UnVerified vendors who have personalInfo
    $vendors = Vendor::with('personalInfo')
        ->where('status', 'UnVerified')
        ->whereHas('personalInfo') // Ensures only vendors with related personalInfo
        ->get();

    // Prepare response data
    $responseData = [];
    foreach ($vendors as $vendor) {
        $responseData[] = [
            'email' => $vendor->email,
            'personal_name' => $vendor->personalInfo->personal_name,
            'vendor_id' => $vendor->vendor_id,
        ];
    }

    // Return the response as JSON
    return response()->json(['success' => true, 'data' => $responseData]);
}





public function addCategories(Request $request)
{
    try {
        // Validate including unique rule for category_name
        $validated = $request->validate([
            'admin_id' => 'required|exists:admins,admin_id',
            'category_name' => [
                'required',
                'string',
                'max:50',
                Rule::unique('category', 'category_name')
            ],
        ], [
            'category_name.unique' => 'Category name already exists.',
        ]);
    } catch (ValidationException $e) {
        return response()->json([
            'success' => false,
            'message' => $e->errors()['category_name'][0],
        ], 422);
    }

    $admin = Admin::where('admin_id', $validated['admin_id'])->first();

    if (!$admin || $admin->admin_role_id !== 'SuperAdmin') {
        return response()->json([
            'success' => false,
            'message' => 'Only SuperAdmins are allowed to add categories.'
        ], 403);
    }

    $category = Category::create([
        'admin_id' => $validated['admin_id'],
        'category_name' => $validated['category_name'],
    ]);

    return response()->json([
        'success' => true,
        'message' => 'Category added successfully.',
        'data' => $category
    ], 201);
}


public function getCategories()
{
    $categories = Category::all();  // Fetch all categories
    return response()->json($categories);
}


public function deleteCategory(Request $request) {
    $request->validate(['category_id' => 'required']);
    Category::where('category_id', $request->category_id)->delete();
    return response()->json(['success' => true]);
}

public function editCategory(Request $request)
{
    try {
        $request->validate([
            'category_id' => 'required|exists:category,category_id',
            'category_name' => [
                'required',
                'string',
                'max:50',
                Rule::unique('category', 'category_name')->ignore($request->category_id, 'category_id'),
            ],
        ], [
            'category_name.unique' => 'Category name already exists.',
        ]);
    } catch (ValidationException $e) {
        return response()->json([
            'success' => false,
            'message' => $e->validator->errors()->first('category_name'),
        ], 422);
    }

    $category = Category::find($request->category_id);

    if (!$category) {
        return response()->json([
            'success' => false,
            'message' => 'Category not found.'
        ], 404);
    }

    $category->category_name = $request->category_name;
    $category->save();

    return response()->json([
        'success' => true,
        'message' => 'Category updated successfully.',
        'data' => $category
    ]);
}





public function addSubCategories(Request $request)
{
    try {
        $validated = $request->validate([
            'admin_id' => 'required|exists:admins,admin_id',
            'category_id' => 'required|exists:category,category_id',
            'sub_category_name' => [
                'required',
                'string',
                'max:50',
                Rule::unique('sub_category')
                    ->where(function ($query) use ($request) {
                        return $query->where('category_id', $request->category_id);
                    })
                    ->ignore($request->sub_category_id ?? null, 'sub_category_id'),
            ],
        ], [
            'sub_category_name.unique' => 'Sub category already exists for this category.',
        ]);
    } catch (ValidationException $e) {
        // Return the validation error message in JSON with 422 status
        return response()->json([
            'success' => false,
            'message' => $e->errors()['sub_category_name'][0], // specific validation message
        ], 422);
    }

    // Check if admin is SuperAdmin
    $admin = Admin::where('admin_id', $validated['admin_id'])->first();

    if (!$admin || $admin->admin_role_id !== 'SuperAdmin') {
        return response()->json([
            'success' => false,
            'message' => 'Only SuperAdmins are allowed to add subcategories.'
        ], 403);
    }

    // Create subcategory
    $subCategory = SubCategory::create([
        'admin_id' => $validated['admin_id'],
        'category_id' => $validated['category_id'],
        'sub_category_name' => $validated['sub_category_name'],
    ]);

    return response()->json([
        'success' => true,
        'message' => 'Subcategory added successfully.',
        'data' => $subCategory,
    ], 201);
}



public function getSubCategories()
{
    // Fetch all subcategories with their associated category names
    $subcategories = SubCategory::with('category')->get();

    // Transform the collection to include the category name
    $subcategoriesWithCategoryNames = $subcategories->map(function ($subcategory) {
        return [
            'sub_category_id' => $subcategory->sub_category_id,
            'sub_category_name' => $subcategory->sub_category_name,
            'category_id' => $subcategory->category_id,
            'category_name' => $subcategory->category->category_name, // Assuming 'category_name' exists in the Category model
        ];
    });

    return response()->json($subcategoriesWithCategoryNames);
}


public function deleteSubCategory(Request $request) {
    $request->validate(['sub_category_id' => 'required']);
    SubCategory::where('sub_category_id', $request->sub_category_id)->delete();
    return response()->json(['success' => true]);
}

public function editSubCategory(Request $request) {
    try {
        // Validate including unique rule for sub_category_name within the same category, ignoring current subcategory
        $validated = $request->validate([
            'sub_category_id' => 'required|exists:sub_category,sub_category_id',
            'sub_category_name' => [
                'required',
                'string',
                'max:50',
                Rule::unique('sub_category')
                    ->where(function ($query) use ($request) {
                        return $query->where('category_id', $request->category_id);
                    })
                    ->ignore($request->sub_category_id, 'sub_category_id'),
            ],
            'category_id' => 'required|exists:category,category_id'
        ], [
            'sub_category_name.unique' => 'Subcategory name already exists for this category.',
        ]);
    } catch (ValidationException $e) {
        return response()->json([
            'success' => false,
            'message' => $e->errors()['sub_category_name'][0],
        ], 422);
    }

    $subcategory = SubCategory::find($validated['sub_category_id']);

    if (!$subcategory) {
        return response()->json([
            'success' => false,
            'message' => 'Subcategory not found.'
        ], 404);
    }

    $subcategory->sub_category_name = $validated['sub_category_name'];
    $subcategory->category_id = $validated['category_id'];
    $subcategory->save();

    return response()->json([
        'success' => true,
        'message' => 'Subcategory updated successfully.',
        'data' => $subcategory,
    ]);
}


public function addAdmins(Request $request)
{
    // Check if admin with the same email already exists
    if (Admin::where('email', $request->email)->exists()) {
        return response()->json([
            'success' => false,
            'status' => 'exist',
        ], 409); // 409 Conflict is appropriate for duplicate resources
    }

    // Proceed with validation after duplicate check
    $validated = $request->validate([
        'name'         => 'required|string|max:255',
        'phone'        => 'required|numeric',
        'email'        => 'required|email',
        'password'     => 'required|min:8',
        'profile_img'  => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
    ]);

    if ($request->hasFile('profile_img')) {
        $imageName = Str::uuid() . '.' . $request->file('profile_img')->getClientOriginalExtension();
        $path = 'profile_img/' . $imageName;
        $request->file('profile_img')->storeAs('public/profile_img', $imageName);
        $validated['profile_img'] = $path;
    } else {
        $validated['profile_img'] = null;
    }

    $admin = Admin::create([
        'phone'         => $validated['phone'],
        'name'          => $validated['name'],
        'email'         => $validated['email'],
        'password'      => Hash::make($validated['password']),
        'profile_img'   => $validated['profile_img'],
        'admin_role_id' => 'Admin',
        'status'        => 'Active',
    ]);

    return response()->json([
        'success' => true,
        'message' => 'Admin added successfully!',
        'admin' => $admin
    ], 201);
}



public function addNotification(Request $request)
    {
        // Validate the incoming request data
        $validatedData = $request->validate([
            'notification_text' => 'required|string|max:255',
            'user_id' => 'nullable|integer|exists:users,user_id',
            'admin_id' => 'nullable|integer|exists:admins,admin_id',
        ]);

        // Create a new notification
        $notification = Notification::create($validatedData);

        // Return a response (you can customize the response as needed)
        return response()->json([
            'message' => 'Notification added successfully',
            'notification' => $notification,
        ], 201);
    }



  public function analytics(Request $request)
{
    // General counts
    $totalOrders = Orders::count();
    $pendingOrders = Orders::where('order_status', 'Pending')->count();
    $completedOrders = Orders::where('order_status', 'Completed')->count();
    $shippedOrders = Orders::where('order_status', 'Shipped')->count();

    // Time-based analytics (e.g., daily counts)
    $dateRange = now()->subDays(30); // Adjust the range as needed
    $dailyOrders = Orders::where('created_at', '>=', $dateRange)
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




public function changeProductStatus(Request $request)
    {
        // Validate the request
        $validated = $request->validate([
            'product_id' => 'required|integer|exists:product,product_id',
            'status' => 'required|in:Active,Inactive,Ban',
        ]);

        // Find the product
        $product = Product::find($validated['product_id']);

        // Update the status
        $product->product_status = $validated['status'];
        $product->save();

        // Return a response
        return response()->json([
            'success' => true,
            'message' => 'Product status updated successfully.',
            'product' => $product,
        ]);
    }

}