<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class JobAnalysisEvent implements ShouldBroadcastNow    
{
    use Dispatchable, InteractsWithSockets, SerializesModels;


    /**
     * The completion percentage of the batch (0-100)...
     *
     * @var int
     */
    public $progress;   


    /**
     * // The number of jobs assigned to the batch...
     *
     * @var int
     */
    public $totalJobs;


    public $output;

    public $messageType;

    /**
     * 
     *
     * @var boolean
     */
    public bool $isJobComplete;


    /**
     * Create a new event instance.
     */
    public function __construct($progress, $totalJobs, $messageType = "", $output = '', $isJobComplete = false)
    {
        $this->progress = $progress;
        $this->totalJobs = $totalJobs;
        $this->output = $output;
        $this->isJobComplete = $isJobComplete;
        $this->messageType = $messageType;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn()
    {
        return new Channel("JobImportAnalysis");
    }

    public function broadcastWith(): array
    {
        return [
            'totalJobs' => $this->totalJobs,
            "progress" => $this->progress,
            'output' => [
                'messageType' => $this->messageType,
                "message" => $this->output
            ],
            'isJobComplete' => $this->isJobComplete,

        ];
    }
}
