<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class ProductExt extends Model
{
    protected $table = "oc_product_ext";
    protected $primaryKey = 'product_ext_id';
    public $timestamps = false;
    protected $fillable = [
        "product_id",
        "type",
        "price",
        "name",
        "name_2",
        "barcode",
    ];

}
