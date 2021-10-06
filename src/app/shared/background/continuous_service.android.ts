import { Http, HttpResponse, isAndroid } from "@nativescript/core";
import { LocalNotifications } from "@nativescript/local-notifications";
import { TNSPlayer } from "nativescript-audio";
import { appConfig } from "../appConfig";
import { CacheService } from "../cache.service";
import { ConnectionService } from "../connection.service";
import { DataService } from "../data.service";


export const CONTINUOUS_SERVICE_CLASSNAME = "org.nativescript.oneTapNotifications.Continuous_Service";

@NativeClass()
@JavaProxy("org.nativescript.oneTapNotifications.Continuous_Service")
class Continuous_Service extends android.app.Service {

     ;
    constructor(private data: DataService, private _player : TNSPlayer, private conn : ConnectionService, private cache: CacheService){
        super();
    }
    private timerId: any;
  
    onBind(): android.os.IBinder {
        return null;
    }

    onCreate(): void {
        this.data =new DataService();
        this.conn = new ConnectionService();
        this.cache = new CacheService();
        this._player = new TNSPlayer();
        
        super.onCreate();

        this._player.debug = true; // set true to enable TNSPlayer console logs for debugging.
        this._player
            .initFromFile({
                audioFile: '~/assets/sound/line.mp3', // ~ = app directory
                loop: true,
                completeCallback: this._trackComplete.bind(this),
                errorCallback: this._trackError.bind(this)
            })
            .then(() => {
                this._player.getAudioTrackDuration().then(duration => {
                    // iOS: duration is in seconds
                    // Android: duration is in milliseconds
                    console.log(`song duration:`, duration);
                });
            });
            

        console.log("SERVICE CREATED");

        if(!LocalNotifications.hasPermission())
        LocalNotifications.requestPermission().then( (res)=>{
            this.data.log('permission granted.....');
        });

        if (!this.timerId) {
            this.timerId = setInterval(() => {
                if(this.cache.getBoolean('service')) this.getUpdate();
                else this.puase();
                console.log(this.data.checkConversation, this.conn.isConnected, new Date().toTimeString());
            }, 15000);
        }
    }

    onStartCommand(intent: android.content.Intent, flags: number, startId: number): number {
        console.log("SERVICE STARTED", new Date().toTimeString());
        return android.app.Service.START_STICKY_COMPATIBILITY;
    }

    onDestroy(): void {
        console.log("SERVICE DESTROYED", new Date().toTimeString());
        super.onDestroy();
        // clearInterval(this.timerId);
        // this.cache.setBoolean('service',false);
        this._player.dispose();
    }


    getUpdate() {
        let doc = {
            id_user: this.data.getUserInfo()?.id_user
        };
        this.data.log('actualizare_mese doc', doc);
        this.data.postCall('actualizare_mese', doc).subscribe(
            (res) => {
                this.data.log('actualizare_mese result:', res);
                if (res.scorRaspuns)
                this.checkNotification(res.result);
            }, (err) => {
                this.data.log('actualizare_mese error', err);
            }
        );

    }

    checkNotification(tables : Array<any>) {
        LocalNotifications.cancelAll();
        tables.forEach((tabl) => {
            if (tabl.new_notification == '1') {
                // local notification
                LocalNotifications.schedule([
                    {
                        id: tabl.table_number, // generated id if not set
                        title: 'Tabel # ' + tabl.table_number,
                        body: 'Please check this table.',
                        ticker: 'The ticker',
                        badge: 1,
                        // groupedMessages: ['The first', 'Second', 'Keep going', 'one more..', 'OK Stop'], //android only
                        // groupSummary: 'Summary of the grouped messages above', //android only
                        ongoing: false, // makes the notification ongoing (Android only)
                        icon: 'res://logo',
                        // image: 'https://cdn-images-1.medium.com/max/1200/1*c3cQvYJrVezv_Az0CoDcbA.jpeg',
                        thumbnail: true,
                        // interval: 'minute',
                        channel: 'OneTap Channel', // default: 'Channel'
                        // sound: isAndroid ? 'customsound' : 'customsound.wav',
                        at: new Date(new Date().getTime() + 1 * 1000), // 2 seconds from now
                    },
                ]).then(
                    (scheduledIds) => {
                        console.log('Notification id(s) scheduled: ' + JSON.stringify(scheduledIds));
                        this.play();
                    },
                    (error) => {
                        console.log('scheduling error: ' + error);
                    }
                );
            }
        });
    }

    play(){
        if(!this._player.isAudioPlaying()) this._player.play();
    }

    puase(){
        if(this._player.isAudioPlaying()) {
            this._player.pause();
            this._player.dispose();
        }
    }

    private _trackComplete(args: any) {
        console.log('reference back to player:', args.player);
        // iOS only: flag indicating if completed succesfully
        console.log('whether song play completed successfully:', args.flag);
    }

    private _trackError(args: any) {
        console.log('reference back to player:', args.player);
        console.log('the error:', args.error);
        // Android only: extra detail on error
        console.log('extra info on the error:', args.extra);
    }


}
//https://dev.to/ozymandiasthegreat/android-continuous-background-services-with-nativescript-42c9
// https://github.com/OzymandiasTheGreat/Nativescript-ServiceExample/blob/master/app/service/continuous-service.android.ts