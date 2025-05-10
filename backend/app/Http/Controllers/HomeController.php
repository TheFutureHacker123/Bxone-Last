<?php

namespace App\Http\Controllers;

use App\Models\Vendor;
use Illuminate\Http\JsonResponse;

class HomeController extends Controller
{
    public function getFeaturedVendors(): JsonResponse
    {
        $featuredVendors = Vendor::where('is_featured', true)
            ->select(['vendor_id', 'store_name', 'logo']) // Select only the necessary fields
            ->with('personalInfo:vendor_id,personal_name') // Assuming you might want the vendor's name
            ->get();

        return response()->json(['featured_vendors' => $featuredVendors]);
    }
}