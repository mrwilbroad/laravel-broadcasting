<?php

namespace App\Jobs;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Spatie\SimpleExcel\SimpleExcelReader;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use DateTime;

class ImportCsvFile implements ShouldQueue, ShouldBeUnique
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;




    /**
     * Create a new job instance.
     */
    public function __construct(
        public $filepath
    ) {
        //
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        try {

            $rows = SimpleExcelReader::create(storage_path("app/" . $this->filepath))
                ->useDelimiter(",")
                ->useHeaders(['name', 'email', 'password'])
                ->getRows();

            $rows->each(function ($user) {
                User::create([
                    'name' => $user['name'],
                    'email' => $user['email'],
                    'password' => $user['password'],
                ]);
            });

            Storage::delete($this->filepath);
        } catch (\Throwable $e) {
           
            $this->fail($e);
        }
    }

    public function retryUntil(): DateTime
    {
        return now()->addMinutes(2);
    }
}
