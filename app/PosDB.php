<?php
// Configuration
// if (is_file('../config.php')) {
//     require_once '../config.php';
// }
// if (is_file('PosLog.php')) {
//     require_once 'PosLog.php';
// }

namespace App;

class PosDB
{
    //private static $m_db=NULL;
    public $m_db = null;
    //private $m_bolInited=false;
    public function Init()
    {
        $this->m_db = new \mysqli("localhost", "root", "", "yx");
        //$this->m_bolInited=true;

        ///if isset()
        if (is_null($this->m_db)) {
            return false;
        }

        //echo "not isset";
        else
        //echo "isset3";
        {
            return true;
        }

    }

    public function GetError()
    {
        if (!is_null($this->m_db)) {
            return $this->m_db->connect_error;
            //echo "Close";
        } else {
            return "";
        }

/*
if ($this->m_bolInited==true)
return $m_db->connect_error;
else
return "";*/

    }

    //return: 0 -- not exist, 1--exist, <0 --error
    public function IsExist($aSql)
    {
        if (!is_null($this->m_db)) {
            $mResult = $this->m_db->query($aSql);
            if ($mResult->num_rows > 0) {
                return 1;
            } else {
                return 0;
            }

        } else {
            return -1;
        }

    }

    public function Query($aSql)
    {
        // PosLog::WriteLog(1, "Query-" . $aSql);
        /*
        if ($this->m_bolInited)  {
        $result = $this->m_db->query($aSql);
        }
        else
        return NULL;
         */
        if (!is_null($this->m_db)) {
            return $this->m_db->query($aSql);
        } else {
            return null;
        }

    }

    public function ExcuteCmd($aSql)
    {
        // PosLog::WriteLog(1, "ExcuteCmd-" . $aSql);
        if (!is_null($this->m_db)) {
            $mRet = $this->m_db->query($aSql);
            //echo "ExcuteCmd 2";
        } else {
            $mRet = null;
            //echo "ExcuteCmd NULL";
        }
        //print_r($mRet);
        return $mRet;
    }

    public function Close()
    {
        // $m_db->close();
        /*
        if (is_null($this->m_db))
        echo "not Close";
        else
        echo "Close";
         */

        if (!is_null($this->m_db)) {
            $this->m_db->close();
            //echo "CloseA";
        }
        //else
        //echo "not CloseA";

    }

    public function FixSqlValue($astrSqlValue)
    {
        return str_replace("'", "''", $astrSqlValue);
    }

    //return: next Id value, when <0 -- error
    public function GetNextId($astrTable, $astrIdFieldName)
    {
        $mSql = "SELECT MAX($astrIdFieldName)+1 AS NextId FROM $astrTable";
        $mResult = $this->Query($mSql);
        if (is_null($mResult)) {
            $mintRet = -99;
        } else {
            if ($mResult->num_rows > 0) {
                $row = $mResult->fetch_assoc();
                if (is_null($row)) {
                    $mintRet = -98;
                } else {
                    $mintRet = $row["NextId"];
                    $row = null;
                }
            } else {
                $mintRet = 1;
            }

        }
        return $mintRet;
    }
}
