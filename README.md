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


4. Inside Listener 
   ```php
   class DocumentListener implements ShouldQueue, ShouldHandleEventsAfterCommit
   {


    use InteractsWithQueue;


    
    public $queue = "high";
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


5. Register Event and Listener inside <strong>EventServiceProvider</strong>
   ```php
    protected $listen = [
        Registered::class => [
            SendEmailVerificationNotification::class,
        ],

        DocumentEvent::class => [
            DocumentListener::class
        ],
    ];


6. set up Channel Route inside Channel Route in <strong>Laravel router folder</strong>
    ```php
    Broadcast::channel('notification', function () {
    return true; // Define your authentication logic here
    });

7. in bootstrap.js, we export WebsocketEcho for reusability in other Reactjs pages you want realtime Environment
   - make sure each env is configured successfull in .env file for each key
   ```js
   window.Pusher = Pusher;
   export const WebSocketEcho = new Echo({
    broadcaster: 'pusher',
    key: import.meta.env.VITE_PUSHER_APP_KEY,
    cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER ?? 'mt1',
    wsHost: import.meta.env.VITE_PUSHER_HOST ? import.meta.env.VITE_PUSHER_HOST : `ws-${import.meta.env.VITE_PUSHER_APP_CLUSTER}.pusher.com`,
    wsPort: import.meta.env.VITE_PUSHER_PORT ?? 80,
    wssPort: import.meta.env.VITE_PUSHER_PORT ?? 443,
    forceTLS: (import.meta.env.VITE_PUSHER_SCHEME ?? 'https') === 'https',
    enabledTransports: ['ws', 'wss'],
    }); 

8. Now , feel free to design any realtime env , mine was so simple 
      overview
      - when user click a link , application generate number of user into db , and this scenario is queued in queed Jobs , 
      - App through websocket send notification to browser without any page refresh from user
      - this happen automatically and number of users from db is calculated by aggregate function from sql query 
      - Good , now you understand the scenario , feel free to Think big on any realtime situation 
    
    <strong>Handle in this way in Javascript file</strong>
    ```js
     useEffect(()=> {
        const NotificationChannel = WebSocketEcho.channel("notification");
        NotificationChannel.listen("DocumentEvent", (event)=> {
            console.log(event);
        })
        return ()=> {
            NotificationChannel.stopListening("DocumentEvent");
        }

    }, []);
    
    ```
    
## Thanks for reading 
## regard mrwilbroad

