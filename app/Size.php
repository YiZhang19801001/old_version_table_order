<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Size extends Model
{
    protected $table = "oc_size";
    protected $fillable = [
        "product_id",
        "barcode",
        "name",
        "price",
        "size_level",
    ];

    public $timestamps = false;
}
