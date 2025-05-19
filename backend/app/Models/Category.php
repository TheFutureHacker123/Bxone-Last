<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory;

    // Define the table name (optional if it's the plural form of the model name)
    protected $table = 'category';
    protected $primaryKey = 'category_id';
    
    // Specify which columns are fillable
    protected $fillable = ['category_name', 'admin_id'];

    public $timestamps = true; //new
    // Define the relationship: One Category has many SubCategories
    public function subCategories()
    {
        return $this->hasMany(SubCategory::class, 'category_id', 'category_id');
    }

    // Define the relationship: One Category belongs to an Admin
    public function admin()
    {
        return $this->belongsTo(Admin::class, 'admin_id', 'admin_id');
    }
}
