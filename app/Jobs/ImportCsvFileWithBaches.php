<?php

namespace App\Jobs;

use Illuminate\Bus\Batchable;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use App\Models\User;
use Throwable;

class ImportCsvFileWithBaches implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels, Batchable;

    /**
     * Row to start importing ..
     *
     * @var integer
     */
    public int $start_row;


    /**
     * Row to End importing ..
     *
     * @var integer
     */
    public int $end_row;

    /**
     *maximum no of tries before Failed ..
     *
     * @var integer
     */
    public $tries = 3;

    // /**
    //  * Number of seconds laravel wait before retrying a Job
    //  *
    //  * @var integer
    //  */
    public $backoff = 3;


    /**
     * Create a new job instance.
     */
    public function __construct(int $start, int $end)
    {
        $this->start_row = $start;
        $this->end_row = $end;
        $this->afterCommit();
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        if ($this->batch()->canceled()) {
            // if baches is cancelled ...
        }
        // import portion of csv
        for ($i = $this->start_row; $i < $this->end_row; $i++) {
            User::create([
                'name' => 'name as :' . $i,
                'email' => "Email@email.com-" . $i,
                'password' => "passwordas" . $i * $i
            ]);
        }
    }

    public function failed(Throwable $e): void
    {
        report($e);
    }
}
