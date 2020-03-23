<?php
namespace App\Http\Controllers\Helper;

use App\Product;

class OrderControllerHelper
{
    public function checkOrderListProductStatus($orderList, $language_id)
    {

        $sold_out_items = "";
        $shortPendingList = array();
        $result = true;

        foreach ($orderList as $orderItem) {
            $orderItem = json_decode(json_encode($orderItem));
            $product_id = $orderItem->item->product_id;
            $targetProduct = Product::find($product_id);

            if ($targetProduct === null || $targetProduct->status != 1) {
                $description = $targetProduct->descriptions()->where("language_id", $language_id)->first();
                if ($description === null) {
                    $targetProduct->descriptions()->first();
                }
                $product_name = $description->name;

                $sold_out_items .= $product_name . ", ";
                $result = false;
            } else {
                array_push($shortPendingList, $orderItem);
            }
        }

        if ($result === false) {
            $sold_out_items = substr($sold_out_items, 0, -2);
        }

        $message = " $sold_out_items";
        return json_decode(json_encode([
            "result" => $result,
            "message" => $message,
            "shortPendingList" => $shortPendingList,
        ]));
    }
}
