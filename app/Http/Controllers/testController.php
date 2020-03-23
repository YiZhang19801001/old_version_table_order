<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class testController extends Controller
{
    public function changeConfigValue($mode)
    {
        $basePath = getcwd();
        $path = $basePath . "/css/app.css";
        if ($mode === 'light') {
            $pathCopyFrom = $basePath . "/css/app_light.css";

        } else if ($mode === 'dark') {

            $pathCopyFrom = $basePath . "/css/app_dark.css";
        }

        // file_put_contents(
        //     $path, str_replace(
        //         "'show_options' => " . var_export(\Config::get('custom.show_options'), true),
        //         "'show_options' => " . var_export($bool, true),
        //         file_get_contents($path)
        //     )
        // );

        file_put_contents($path, file_get_contents($pathCopyFrom));

        // $value = file_get_contents($path);

        /**return to client side */
        return response()->json(['message' => 'theme changed to ' . $mode . ' !'], 200);
    }

    public function changeText(Request $request)
    {
        $path_cn = "/home1/ozwearug/public_html/kidsnpartycom/table/config/language_cn.php";
        $path_en = "/home1/ozwearug/public_html/kidsnpartycom/table/config/language_en.php";
        //var_export($bool, true) how to read boolean as boolean
        file_put_contents(
            $path_cn, str_replace(
                "'preorder_title' => " . "'" . \Config::get('language_cn.preorder_title') . "'",
                "'preorder_title' => " . "'" . $request->preorder_title_cn . "'",
                file_get_contents($path_cn)
            )
        );
        file_put_contents(
            $path_en, str_replace(
                "'preorder_title' => " . "'" . \Config::get('language_en.preorder_title') . "'",
                "'preorder_title' => " . "'" . $request->preorder_title_en . "'",
                file_get_contents($path_en)
            )
        );

        $language_cn = \Config::get('language_cn.preorder_title');
        $language_en = \Config::get('language_en.preorder_title');
        return response()->json(['message' => "perorder title change to [cn:$language_cn,en:$language_en]"]);
    }

    /**
     * test laravel Pessimistic Locking
     */
    public function lockForSelect(Request $request)
    {

        if ($request->v === "aaa") {
            \DB::beginTransaction();

            $model = \DB::table('oc_user')->where("user_id", 1)->lockForUpdate()->first();
            sleep(10);

            $model->code = $request->code;
            // $model->save();
            \DB::commit();

        } else {
            \DB::beginTransaction();

            $model = \DB::table('oc_user')->where("user_id", 1)->update(["code" => $request->code]);
            // $model->code = $request->code . "aaa";
            // $model->save();
            \DB::commit();

        }

        return response()->json($model, 200);
        // $PosDB1 = new PosDB();

        // $sql = "START TRANSACTION ";

        // $PosDB1->ExcuteCmd($sql);
        // $sql = "SELECT * FROM oc_user WHERE user_id=1 FOR UPDATE";

        // $PosDB1->Query($sql);

        // $sql = "UPDATE oc_user SET code='ddaq'  WHERE user_id=1 ";
        // $PosDB1->ExcuteCmd($sql);

        // $sql = "SELECT SLEEP(10)";
        // $PosDB1->Query($sql);
        // $sql = "COMMIT ";
        // $PosDB1->ExcuteCmd($sql);

        // $PosDB1->Close();

        // echo "finish2f";

    }

    public function instanceForSelect(Request $request)
    {
        \DB::beginTransaction();

        $model = \App\TempOrder::lockForUpdate()->find("2151");

        \DB::commit();
        return response()->json($model, 200);

//         $PosDB1 = new PosDB();
        //         $sql = "START TRANSACTION ";

//         $PosDB1->ExcuteCmd($sql);
        // /*$sql="SELECT * FROM table_lock WHERE code='A01' FOR UPDATE";

// $PosDB1->Query($sql);

//  */
        //         $sql = "UPDATE oc_user SET code='acc'  WHERE user_id=1 ";
        //         $PosDB1->ExcuteCmd($sql);

//         $sql = "COMMIT ";
        //         $PosDB1->ExcuteCmd($sql);

// //$sql = "SELECT * FROM oc_order ORDER BY date_added ";
        //         /*    $sql="SELECT * FROM table_lock WHERE code='A01'  LOCK IN SHARE MODE";
        //         $result = $PosDB1->Query($sql);
        //         print_r($result );
        //          */
        //         $PosDB1->Close();

//         // return response()->json(["finished 2"], 200);
        //         echo "finish1f";

    }

}
