import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterExtensions } from '@nativescript/angular';
import { Page } from '@nativescript/core';
import { DataService } from '~/app/shared/data.service';

@Component({
    selector: 'app-tables',
    templateUrl: './tables.component.html',
    styleUrls: ['./tables.component.css']
})
export class TablesComponent implements OnInit,OnDestroy {

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
        this.getTables();
    }
    
    ngOnDestroy(){
    }

    update(item:any){
        this._loading = true;
        let doc = {
            id_user : this.data.getUserInfo().id_user,
            tables : item.id_table,
            assign : (item.is_assigned == '1')? '0' : '1'
        };
        this.data.log('update_table_assignment doc=>', doc);
        this.data.postCall('update_table_assignment',doc).subscribe(
            (res)=>{
                console.log('update_table_assignment result:',res);
                this._items = [];
                this.getTables();
            },(err)=>{
                console.log('update_table_assignment error',err);
                this._loading  = false;
            }
        );
    }

    getTables(){
        let doc = {
            id_user : this.data.getUserInfo().id_user
        };
        this.data.log('get_all_tables doc=>', doc);
        this.data.postCall('get_all_tables',doc).subscribe(
            (res)=>{
                console.log('get_all_tables result:',res);
                this._items = res.tables;
                this._loading = false;
            },(err)=>{
                console.log('get_all_tables error',err);
                this._loading  = false;
            }
        );
    }

    goBack(){
        this.routerExt.back();
    }

    logout(){
        this.data.logout();
        this.routerExt.navigate(['/login'], {clearHistory: true} );
    }

}
