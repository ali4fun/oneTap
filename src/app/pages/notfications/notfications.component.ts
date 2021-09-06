import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterExtensions } from '@nativescript/angular';
import { Page } from '@nativescript/core';
import { DataService } from '~/app/shared/data.service';

@Component({
    selector: 'app-notfications',
    templateUrl: './notfications.component.html',
    styleUrls: ['./notfications.component.css']
})
export class NotficationsComponent implements OnInit,OnDestroy {

    _loading: boolean = true;
    get loading(): boolean {
        return this._loading;
    }

    _items : Array<any> =[];
    get items() : Array<any>{
        return this._items;
    }

    constructor(private page: Page, private data: DataService, private routerExt: RouterExtensions) { }

    ngOnInit() {
        this.page.actionBarHidden = true;
        this.getNotification();
    }
    
    ngOnDestroy(){
    }

    getNotification(){
        let doc = {
            id_user : this.data.user_info.id_user
        };
        this.data.log('get_notifications doc=>', doc);
        this.data.postCall('get_notifications',doc).subscribe(
            (res)=>{
                console.log('get_notifications result:',res);
                this._items = res.rezultat;
                this._loading = false;
            },(err)=>{
                console.log('get_notifications error',err);
                this._loading  = false;
            }
        );
    }

    goBack(){
        this.routerExt.back();
    }

}
