<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\VendorController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\AdminController;
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




Route::post('register',[UserController::class,'register']);//done
Route::post('login',[UserController::class,'login']);//done
Route::post('/addadress',[UserController::class,'addadress']);//done

Route::post('vendor/register',[VendorController::class,'register']);//done
Route::post('/vendor/login',[VendorController::class,'login']);//done
Route::post('/vendor/addproduct',[VendorController::class,'addproduct']);//done
Route::post('/vendor/productlist/', [VendorController::class, 'productlist']);//done
Route::post('/vendor/orderlist/', [VendorController::class, 'orderlist']);//done
Route::post('/vendor/updatepassword/', [VendorController::class, 'updatepassword']);//done
Route::delete('/vendor/delete-product', [VendorController::class, 'deleteProduct']);//done
Route::post('/vendor/update-order-status', [VendorController::class, 'updateorderstatus']);//done
Route::get('/vendor/get-categories', [AdminController::class, 'getCategories']);//done
Route::post('/get-subcategories-by-category/{category_id}', [VendorController::class, 'categoryandsubcategory']);//done

Route::post('/vendor/editproduct', [VendorController::class, 'editproduct']);//one


Route::post('/vendor/vendorinfo',[VendorController::class,'vendorinfo']);


Route::post('/search', [ProductController::class, 'search']);//done
Route::post('/categorylist', [ProductController::class, 'categorylist']);//done
Route::post('/shippeditems', [ProductController::class, 'shippeditems']);//done
Route::post('/orderditems', [ProductController::class, 'orderditems']);//done
Route::post('/refunditems', [ProductController::class, 'refunditems']);//done 
Route::post('/completeditems', [ProductController::class, 'completeditems']);//done
Route::post('/productdetails/{product_id}', [ProductController::class, 'productdetails']);//done
Route::post('/addtocart', [ProductController::class, 'addtocart']);//done
Route::post('/removecartitems', [ProductController::class, 'removecartitems']);//done
Route::post('/listcartitems', [ProductController::class, 'listcartitems']);//done

Route::post('/admin/login', [AdminController::class, 'loginadmin']);//done


Route::get('/admin/listusers', [AdminController::class, 'listusers']);//done
Route::post('/admin/changeuserstatus', [AdminController::class, 'changeuserstatus']);//done

Route::get('/admin/listvendors', [AdminController::class, 'listvendors']);//done
Route::post('/admin/changevendorstatus', [AdminController::class, 'changevendorstatus']);//done
Route::post('/admin/updatepassword', [AdminController::class, 'updatepassword']);//done
Route::post('/admin/newvendorrequest', [AdminController::class, 'newvendorrequest']);//done
Route::post('/admin/listnewvendors', [AdminController::class, 'listnewvendors']);//done
Route::post('/vendor/vendorstatus', [VendorController::class, 'vendorstatus']);

Route::post('add-categories', [AdminController::class, 'addCategories']);
Route::post('/get-categories', [AdminController::class, 'getCategories']);//done

Route::post('/delete-category', [AdminController::class, 'deleteCategory']);//done
Route::post('/edit-category', [AdminController::class, 'editCategory']);//done

Route::post('/add-subcategories', [AdminController::class, 'addSubCategories']);
Route::post('/get-subcategories', [AdminController::class, 'getSubCategories']);//done
Route::post('/delete-subcategory', [AdminController::class, 'deleteSubCategory']);//done
Route::post('/edit-subcategory', [AdminController::class, 'editSubCategory']);//done

Route::post('/superadmin/addadmins', [AdminController::class, 'addAdmins']);



