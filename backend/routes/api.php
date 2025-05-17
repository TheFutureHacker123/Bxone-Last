<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\VendorController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\WishlistController;
use App\Http\Controllers\Api\SubscriptionController;
/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
//     return $request->user();
// });
use App\Http\Controllers\AuthController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:api')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);
});

Route::post('register', [UserController::class, 'register']); //done
Route::post('login', [UserController::class, 'login']); //done
Route::post('/addaddress', [UserController::class, 'addaddress']);

Route::post('vendor/register', [VendorController::class, 'register']); //done
Route::post('/vendor/login', [VendorController::class, 'login']); //done
Route::post('/vendor/addproduct', [VendorController::class, 'addproduct']); //done
Route::post('/vendor/productlist/', [VendorController::class, 'productlist']); //done
Route::post('/vendor/orderlist/', [VendorController::class, 'orderlist']); //done
Route::post('/vendor/updatepassword/', [VendorController::class, 'updatepassword']); //done
Route::delete('/vendor/delete-product', [VendorController::class, 'deleteProduct']); //done
Route::post('/vendor/update-order-status', [VendorController::class, 'updateorderstatus']); //done
Route::get('/vendor/get-categories', [AdminController::class, 'getCategories']); //done
Route::post('/get-subcategories-by-category/{category_id}', [VendorController::class, 'categoryandsubcategory']); //done

Route::post('/vendor/editproduct', [VendorController::class, 'editproduct']); //one

Route::post('/vendor/vendorinfo', [VendorController::class, 'vendorinfo']);

Route::post('/search', [ProductController::class, 'search']); //done
Route::post('/categorylist', [ProductController::class, 'categorylist']); //done
Route::post('/shippeditems', [ProductController::class, 'shippeditems']); //done
Route::post('/orderditems', [ProductController::class, 'orderditems']); //done
Route::post('/refunditems', [ProductController::class, 'refunditems']); //done 
Route::post('/completeditems', [ProductController::class, 'completeditems']); //done
Route::post('/productdetails', [ProductController::class, 'productdetails']); //done
Route::post('/addtocart', [ProductController::class, 'addtocart']); //done
Route::post('/removecartitems', [ProductController::class, 'removecartitems']); //done
Route::post('/listcartitems', [ProductController::class, 'listcartitems']); //done
Route::post('/topproduct', [ProductController::class, 'topproduct']); //done

Route::post('/admin/login', [AdminController::class, 'loginadmin']); //done

Route::get('/admin/listusers', [AdminController::class, 'listusers']); //done
Route::post('/admin/changeuserstatus', [AdminController::class, 'changeuserstatus']); //done

Route::get('/admin/listvendors', [AdminController::class, 'listvendors']); //done
Route::post('/admin/changevendorstatus', [AdminController::class, 'changevendorstatus']); //done
Route::post('/admin/updatepassword', [AdminController::class, 'updatepassword']); //done
Route::post('/admin/newvendorrequest', [AdminController::class, 'newvendorrequest']); //done
Route::post('/admin/listnewvendors', [AdminController::class, 'listnewvendors']); //done
Route::post('/vendor/vendorstatus', [VendorController::class, 'vendorstatus']);

Route::post('add-categories', [AdminController::class, 'addCategories']);
Route::post('/get-categories', [AdminController::class, 'getCategories']); //done

Route::post('/delete-category', [AdminController::class, 'deleteCategory']); //done
Route::post('/edit-category', [AdminController::class, 'editCategory']); //done

Route::post('/add-subcategories', [AdminController::class, 'addSubCategories']);
Route::post('/get-subcategories', [AdminController::class, 'getSubCategories']); //done
Route::post('/delete-subcategory', [AdminController::class, 'deleteSubCategory']); //done
Route::post('/edit-subcategory', [AdminController::class, 'editSubCategory']); //done

Route::post('/superadmin/addadmins', [AdminController::class, 'addAdmins']);

Route::post('/admin/addnotification', [AdminController::class, 'addNotification']); //done
Route::post('/getnotifications', [UserController::class, 'getNotifications']); //done
Route::post('/deletenotification', [UserController::class, 'deleteNotification']); //done

Route::post('/vendor/getnotifications', [VendorController::class, 'getNotifications']); //done
Route::post('/vendor/deletenotification', [VendorController::class, 'deleteNotification']); //done
Route::post('/vendor/addnotification', [VendorController::class, 'addNotification']); //done

Route::get('/admin/listadmins', [AdminController::class, 'listadmins']); //done
Route::post('/admin/changeuserstatusadmin', [AdminController::class, 'changeuserstatusadmin']); //done

Route::post('/vendor/listproduct', [VendorController::class, 'listproduct']); //done
Route::post('/vendor/listreview', [VendorController::class, 'listreview']); //done

Route::get('/featured-vendors', [HomeController::class, 'getFeaturedVendors']);
Route::get('/vendor/{vendorId}', [VendorController::class, 'getVendorDetails']);
Route::get('/vendor/{vendorId}/products', [VendorController::class, 'getVendorProducts']);
Route::get('/vendor/{vendorId}/categories', [VendorController::class, 'getVendorCategories']);

Route::get('/best-selling-vendors', [HomeController::class, 'getBestSellingVendors']);

Route::post('/product/addcoupon', [ProductController::class, 'addCoupon']); //done
Route::post('/product/listcoupon', [ProductController::class, 'listCoupon']); //done
Route::post('/product/deletecoupon', [ProductController::class, 'deleteCoupon']); //done
Route::post('/product/editcoupon', [ProductController::class, 'editCoupon']); //done
Route::post('/product/onevendorproducts', [ProductController::class, 'onevendorproducts']); //done

Route::post('/updateCartQuantity', [ProductController::class, 'updateCartQuantity']);

Route::post('/processOrder', [ProductController::class, 'processOrder']);

Route::post('/applyCoupon', [ProductController::class, 'applyCoupon']);

Route::post('/vendor/analytics', [VendorController::class, 'analytics']);//done
Route::post('/admin/analytics', [AdminController::class, 'analytics']);//done
Route::post('/admin/changeproductstatus', [AdminController::class, 'changeproductstatus']);//done
Route::post('/vendor/orderlistforadmin/', [VendorController::class, 'orderlistforadmin']);//done



// Route::middleware('auth:api')->group(function () {
//     // Wishlist routes
//     Route::post('/wishlist/add', [WishlistController::class, 'addToWishlist']);
//     Route::post('/wishlist/remove', [WishlistController::class, 'removeFromWishlist']);
//     Route::get('/wishlist', [WishlistController::class, 'getWishlist']);
//     Route::get('/wishlist/check/{product_id}', [WishlistController::class, 'checkInWishlist']);
// });

Route::post('/wishlist/add', [WishlistController::class, 'addToWishlist']);
Route::post('/wishlist/remove', [WishlistController::class, 'removeFromWishlist']);
Route::get('/wishlist', [WishlistController::class, 'getWishlist']);
Route::get('/wishlist/check/{product_id}', [WishlistController::class, 'checkInWishlist']);



Route::post('/subscribe', [SubscriptionController::class, 'subscribe']);


Route::post('pay', 'App\Http\Controllers\ChapaController@initialize')->name('pay');
 
// The callback url after a payment
Route::get('callback/{reference}', 'App\Http\Controllers\ChapaController@callback')->name('callback');



Route::get('/new-arrivals', [ProductController::class, 'newArrivals']);