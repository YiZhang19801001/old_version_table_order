<?php

namespace App\Http\Controllers;

use App\Imports\SizeImports;
use App\Product;
use App\ProductExt;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;

class ExtraController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
    }

    /**
     * Import rows from  excel file
     *
     * @return \Illuminate\Http\Response
     */
    public function upload(Request $request)
    {
        try {
            # read inputs from request
            // do not worry about the SizeImports we will not use the model at all, just for syntax issues
            $collections = Excel::toCollection(new SizeImports, request()->file('extra_file'));
            // all extras should be be appended on each product
            # get all products
            $products = Product::all();

            $countUpdated = 0;
            $countCreated = 0;
            # only deal with the first sheet in the excel file which is $collections[0]
            foreach ($collections[0] as $row) {
                // there are 3 columns
                // barcode, description, sell
                // description should be saved as name and name_2
                // sell should be saved as price
                foreach ($products as $product) {
                    $productId = $product->product_id;
                    $existExt = ProductExt::where('product_id', $productId)->where('barcode', $row["barcode"])->first();
                    if ($existExt) {
                        $existExt->update([
                            "name" => $row["description"],
                            "name_2" => $row["description"],
                            "price" => $row["sell"],
                        ]);
                        $countUpdated++;
                    } else {
                        ProductExt::create([
                            "product_id" => $productId,
                            "type" => "8889",
                            "price" => $row["sell"],
                            "name" => $row["description"],
                            "name_2" => $row["description"],
                            "barcode" => $row["barcode"],
                        ]);
                        $countCreated++;
                    }
                }

            }

            return response()->json([
                "code" => "0",
                "message" => "success",
                "created" => $countCreated,
                "updated" => $countUpdated,
            ], 200);

        } catch (\Throwable $th) {
            return response()->json([
                "code" => "9000",
                "message" => $th->getMessage(),
            ], 400);
        }
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
}
