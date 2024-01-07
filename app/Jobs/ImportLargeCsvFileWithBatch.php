<?php

namespace App\Jobs;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Throwable;
use App\Events\JobAnalysisEvent;

class ImportLargeCsvFileWithBatch  implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;



    /**
     * Array of users
     *
     * @var array
     */
    public array $userData;


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
    public function __construct(array $userdata)
    {
        $this->userData = $userdata;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        try {
            foreach ($this->userData as $key => $user) {
                User::create([
                    'name'  => $user['name'],
                    'email' => $user['email'],
                    'password' => $user['password']
                ]);
                JobAnalysisEvent::dispatch(
                    1,
                    2,
                    "success",
                    "user " . $user['name'] . " is created successfull ...",
                    true
                );
            }
        } catch (\Throwable $th) {

            report($th);
        }
    }


    public function failed(Throwable $e): void
    {
        JobAnalysisEvent::dispatch(
            1,
            2,
            "danger",
            "Something went wrong , some data not saved!",
            true
        );
        report($e);
    }
}
