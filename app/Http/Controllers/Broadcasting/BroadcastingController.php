<?php

namespace App\Http\Controllers\Broadcasting;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Events\DocumentEvent;
use App\Models\User;
use Inertia\Inertia;

class BroadcastingController extends Controller
{
    


    public function home()
    {
        return Inertia::render("Dashboard", [
            "totaluser" => User::all()->count()
        ]);
    }


    public function index()
    {
        DocumentEvent::dispatch(10);
        return back()->with("success","is processing ...");
    }
}
