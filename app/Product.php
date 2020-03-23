<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $table = "oc_product";
    protected $primaryKey = "product_id";
    public $timestamps = false;

    public function descriptions()
    {
        return $this->hasMany("App\ProductDescription","product_id","product_id");
    }
}
