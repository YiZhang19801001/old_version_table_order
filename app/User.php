<?php

namespace App;

use Illuminate\Foundation\Auth\User as Authenticatable;

// use Illuminate\Notifications\Notifiable;

// use \Reshadman\OptimisticLocking\OptimisticLocking;

class User extends Authenticatable
{
    // use Notifiable;
    // use OptimisticLocking;

    protected $table = "oc_user";
    protected $primaryKey = "user_id";
    public $timestamps = false;

}
