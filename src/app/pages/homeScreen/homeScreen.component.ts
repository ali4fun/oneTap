import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterExtensions } from '@nativescript/angular';
import { knownFolders, Page } from '@nativescript/core';
import { DataService } from '~/app/shared/data.service';
import { TNSPlayer } from 'nativescript-audio';

@Component({
    selector: 'app-home-screen',
    templateUrl: './homeScreen.component.html',
    styleUrls: ['./homeScreen.component.css']
})
export class HomeScreenComponent implements OnInit,OnDestroy {

    _loading: boolean = true;
    get loading(): boolean {
        return this._loading;
    }

    _items : Array<any> =[];
    get items() : Array<any>{
        return this._items;
    }

    _tableDetails : any  = null;
    get tableDetails() : any{
        return this._tableDetails;
    }

    tableNo : string = '0';

    _tables : Array<any> =[];
    get tables() : Array<any>{
        return this._tables;
    }
    isDestroy : boolean = false;
    notification : Array<string> = [];

    private _player: TNSPlayer;

    constructor(private page: Page, private data: DataService, private routerExt: RouterExtensions) {
        this._player = new TNSPlayer();
        this._player.debug = true; // set true to enable TNSPlayer console logs for debugging.
    this._player
      .initFromFile({
        audioFile: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', // ~ = app directory
        loop: false,
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
      console.log('known folder path', knownFolders.currentApp().getFolder('sound').getFile('line.mp3').path);
     }

    ngOnInit() {
        this.page.actionBarHidden = true;
        this.getUpdate();
    }
    
    ngOnDestroy(){
        this.isDestroy = true;
    }

    getUpdate(){
        let doc={
            id_user : this.data.user_info.id_user
        };

        this.data.postCall('actualizare_mese',doc).subscribe(
            (res)=>{
                this.data.log('actualizare_mese result:',res);
                if(res.scorRaspuns)
                this._tables = res.result;
                this._loading = false;
                this.checkNotification();
                setTimeout(() => {
                   if(!this.isDestroy) this.getUpdate();
                }, 5000);
            },(err)=>{
                this.data.log('actualizare_mese error',err);
                this._loading  = false;
            }
        );

    }

    checkNotification(){
        this.notification = [];
        this.tables.forEach((tabl)=>{
            if(tabl.new_notification == '1') {
                this.notification.push(tabl.id_table);
                this.ring();
            }
        });
    }

    checkIn(id: string){
        this._loading = true;
        let doc={
            id_user : this.data.user_info.id_user,
            id_log :id
        };

        this.data.postCall('schimba_stare',doc).subscribe(
            (res)=>{
                console.log('schimba_stare result:',res);
                if(res.scorRaspuns) this.getOrders(this.tableDetails.id_table);
                this._loading = false;
            },(err)=>{
                console.log('schimba_stare error',err);
                this._loading  = false;
            }
        );
    }
    

    clearTable(){
        this._loading = true;
        let doc={
            id_user : this.data.user_info.id_user,
            id_table : this.tableDetails.id_table
        };

        this.data.postCall('close_table',doc).subscribe(
            (res)=>{
                console.log('close_table result:',res);
                if(res.scorRaspuns) this.getOrders(this.tableDetails.id_table);
                this._loading = false;
            },(err)=>{
                console.log('close_table error',err);
                this._loading  = false;
            }
        );
    }

    getOrders(id : string){
        this._loading = true;
        this._tableDetails = null;
        let doc = { 
            id_user : this.data.user_info.id_user,
            id_table : id
        };
        this.data.log('table_orders doc=>', doc);
        this.data.postCall('table_orders',doc).subscribe(
            (res)=>{
                console.log('table_orders result:',res);
                this._tableDetails = res.result;
                this._loading = false;
                this.clearNotification(id);
            },(err)=>{
                console.log('table_orders error',err);
                this._loading  = false;
            }
        );
    }

    clearNotification(id : string){
        let index = this.notification.indexOf(id);
        if (index > -1) {
            this.notification.splice(index, 1);
          }
    }

    ring(){
        if (!this._player.isAudioPlaying()) {
            this._player.play();
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
