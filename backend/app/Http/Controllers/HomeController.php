<?php

namespace App\Http\Controllers;

use App\Models\Vendor;
use App\Models\Orders;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

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

    public function getBestSellingVendors(): JsonResponse
    {
        $bestSellingVendors = Orders::select('vendor_id', DB::raw('count(*) as total_orders'))
            ->groupBy('vendor_id')
            ->orderByDesc('total_orders')
            ->limit(5) // Let's get the top 5 best-selling vendors
            ->get();

        // Load the vendor details for the best-selling vendors
        $vendors = Vendor::whereIn('vendor_id', $bestSellingVendors->pluck('vendor_id'))
            ->select(['vendor_id', 'store_name', 'logo'])
            ->with('personalInfo:vendor_id,personal_name')
            ->get();

        // Optionally, you might want to merge the order count with the vendor data
        $bestSellingVendorsWithInfo = $vendors->map(function ($vendor) use ($bestSellingVendors) {
            $orderData = $bestSellingVendors->firstWhere('vendor_id', $vendor->vendor_id);
            $vendor->total_orders = $orderData ? $orderData->total_orders : 0;
            return $vendor;
        })->sortByDesc('total_orders')->values()->all();

        return response()->json(['best_selling_vendors' => $bestSellingVendorsWithInfo]);
    }
}