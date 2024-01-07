<?php

namespace App\Http\Controllers\Excel;

use App\Events\JobAnalysisEvent;
use App\Http\Controllers\Controller;
use App\Jobs\ImportCsvFile;
use App\Jobs\ImportCsvFileWithBaches;
use App\Models\User;
use Illuminate\Bus\Batch;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Bus;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Spatie\SimpleExcel\SimpleExcelWriter;
use Throwable;
use App\Http\Requests\ImportCsvRequest;
use Spatie\SimpleExcel\SimpleExcelReader;
use App\Jobs\ImportLargeCsvFileWithBatch;


class ExcellController extends Controller
{
    public function index()
    {
        return Inertia::render("exports/index", [
            "userList" => User::all(),
            "total_users" => User::all()->count()
        ]);
    }

    public function Store_one(ImportCsvRequest $request)
    {
        // $file = $request->file("filename");
        // $filepath = $file->storeAs("temp",'users.csv');
        //  dispatch(new ImportCsvFile($filepath));

        // dispatch Batches of Jobs
        $batch = Bus::batch([
            new ImportCsvFileWithBaches(1, 5),
            new ImportCsvFileWithBaches(6, 7),
            new ImportCsvFileWithBaches(7, 9),
            new ImportCsvFileWithBaches(9, 14),
            new ImportCsvFileWithBaches(15, 16),
        ])
            ->then(function (Batch $batch) {
                // mrwilbroadmark123@gmail.com
                JobAnalysisEvent::dispatch(
                    $batch->progress(),
                    $batch->totalJobs,
                    "success",
                    "Data successfull saved to database",
                    true
                );
            })
            ->catch(function (Batch $batch, Throwable $e) {
                // First Job failure detected ...
                JobAnalysisEvent::dispatch(
                    $batch->progress(),
                    $batch->totalJobs,
                    "danger",
                    "Something went wrong , some data not saved!",
                    true
                );
            })
            ->finally(function (Batch $batch) {
                // The batch has finnished executing ...
            })
            ->onQueue("importcsv")
            // ->name("ImportCsv")
            ->dispatch();
        // dd($batch);

        return back();
    }



    public function Store(ImportCsvRequest $request)
    {
        try {
            $file = $request->file('filename');
            $filepath = $file->storeAs("temp", 'userfile.csv');
            $fullpath = storage_path('app/' . $filepath);
            $rows = SimpleExcelReader::create($fullpath)
                ->getRows();
            $userChunks = $rows->chunk(30);
            foreach ($userChunks as $chunk) {
                ImportLargeCsvFileWithBatch::dispatch($chunk->toArray())
                      ->onQueue("importcsv");
            }
            return back();

        } catch (\Throwable $th) {
            dd($th);
        }
    }

    public function ExportToC()
    {
        $users = User::all()->toArray();
        $writer = SimpleExcelWriter::streamDownload("users.xlsx");
        $writer->addRows($users);
        $writer->toBrowser();
    }


    public function ExportToPDF()
    {
    }
}
