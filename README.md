### Real-time Event Broadcasting Setup (Laravel + ReactJS + InertiaJS + PusherJS)

#### Laravel Setup

1. **Create an Event:**
   ```bash
   php artisan make:event DocumentEvent


2. Create Listener 
   ```bash
   php artisan make:listener DocumentListener --event=DocumentEvent

3. inside DocumentEvent
   ```php
   class DocumentEvent implements ShouldQueue ,ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;



    /**
     * Create a new event instance.
     */
    public function __construct(public $count)
    {
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): Channel
    {
        return new Channel('notification');
    }

}


4. 