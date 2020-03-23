<?php

namespace App\Http\Controllers;

use App\Imports\SizeImports;
use App\Product;
use App\Size;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;

class SizeController extends Controller
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
            $collections = Excel::toCollection(new SizeImports, request()->file('size_file'));
            $countUpdated = 0;
            $countCreated = 0;
            # only deal with the first sheet in the excel file which is $collections[0]
            foreach ($collections[0] as $row) {
                // count($row) return the header length of a row
                // numbers of size value parirs always equal to halve count($row) according to excel template structure
                for ($i = 1; $i <= (count($row) / 2); $i++) {
                    if ($row["custom" . $i]) { // check cell has available value or not
                        // if value is vaild
                        // found the product in "oc_product" table
                        // and then insert row into Size table
                        // using product_id as foreign keys
                        $product = Product::where("upc", $row["barcode"])->first();
                        if ($product) {
                            // try to find existing Size
                            $existSize = Size::where("product_id", $product->product_id)->where("size_level", $i)->first();
                            if ($existSize) {
                                $existSize->update([
                                    "name" => $row["custom" . $i],
                                    "price" => $row["sell" . $i],
                                ]);
                                $countUpdated++;
                            } else {

                                Size::create([
                                    "product_id" => $product->product_id,
                                    "barcode" => $row["barcode"],
                                    "name" => $row["custom" . $i],
                                    "price" => $row["sell" . $i],
                                    "size_level" => $i,
                                ]);
                                $countCreated++;
                            }
                        }

                    }
                }
            }

            return response()->json(["code" => "0", "message" => "success", "created" => $countCreated, "updated" => $countUpdated], 200);
        } catch (\Throwable $th) {
            return response()->json(["code" => "9000", "message" => $th->getMessage()], 400);
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
