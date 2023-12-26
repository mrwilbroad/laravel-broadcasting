<?php

namespace App\Listeners;

use App\Events\DocumentEvent;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use App\Models\User;
use DateTime;
use Illuminate\Contracts\Events\ShouldHandleEventsAfterCommit;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Throwable;

class DocumentListener implements ShouldQueue, ShouldHandleEventsAfterCommit
{


    use InteractsWithQueue;


    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(DocumentEvent $event): void
    {
        for ($i=0; $i < $event->count; $i++) { 
            User::create([
                'name' => fake()->name(),
                'email' => fake()->unique()->safeEmail(),
                'email_verified_at' => now(),
                'password' => Hash::make("password")
            ]);
        }
    }


    public function failed(DocumentEvent $event , Throwable $th)
    {
        report($th);
    }

    public function retryUntill(): DateTime
    {
        return now()->addMinute(3);
    }

    
}
