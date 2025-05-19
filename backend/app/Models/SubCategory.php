<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SubCategory extends Model
{
    use HasFactory;

    // Define the table name (optional if it's the plural form of the model name)
    protected $table = 'sub_category';
    protected $primaryKey = 'sub_category_id';
    public $timestamps = true; //new
    // Specify which columns are fillable
    protected $fillable = ['sub_category_name', 'category_id', 'admin_id'];

    // Define the relationship: Each SubCategory belongs to one Category
    public function category()
    {
        return $this->belongsTo(Category::class, 'category_id', 'category_id');
    }

    // Define the relationship: Each SubCategory belongs to one Admin
    public function admin()
    {
        return $this->belongsTo(Admin::class, 'admin_id', 'admin_id');
    }
}
