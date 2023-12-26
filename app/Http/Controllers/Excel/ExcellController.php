<?php

namespace App\Http\Controllers\Excel;

use App\Http\Controllers\Controller;
use App\Jobs\ImportCsvFile;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Spatie\SimpleExcel\SimpleExcelWriter;



class ExcellController extends Controller
{
    public function index()
    {         

        return Inertia::render("exports/index", [
            "userList" => User::all(),
            "total_users" => User::all()->count()
        ]);
    }

    public function Store(Request $request)
    {
        $file = $request->file("filename");
        $filepath = $file->storeAs("temp",'users.csv');
       
         dispatch(new ImportCsvFile($filepath));

        return back();
    }


    public function ExportToC()
    {
        $users = User::all()->toArray();
       $writer = SimpleExcelWriter::streamDownload("users.xlsx");
       $writer->addRows($users);
       $writer->toBrowser();
    }
}
