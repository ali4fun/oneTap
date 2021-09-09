import { Injectable } from '@angular/core';
import { CacheService } from './cache.service';
import { Observable } from 'rxjs';
import { Http, HttpResponse } from '@nativescript/core';
import { appConfig } from './appConfig';
import { ConnectionService } from './connection.service';


@Injectable({
  providedIn: 'root'
})
export class DataService {

  public user_info: any = {};
  public tabels : Array<any> = [];

  public debug: boolean = true;
  public checkConversation: boolean = false;

  public conn: ConnectionService;
  public cache: CacheService;

  constructor() { 
    this.conn = new ConnectionService();
    this.cache = new CacheService();
  }

  public getTables() : Array<any> {
    return this.tabels;
  }

  public saveUserInfo(user: any) {
    this.cache.put('user', JSON.stringify(user));
  }

  public getUserInfo(): any {
    if (this.cache.get('user')) return JSON.parse(this.cache.get('user'));
    else return null;
  }

  logout() {
    this.cache.removeAll();
  }

  getUpdate(){
    let doc={
        id_user : this.getUserInfo().id_user
    };
    this.log('actualizare_mese doc',doc);
    this.postCall('actualizare_mese',doc).subscribe(
        (res)=>{
            this.log('actualizare_mese result:',res);
            if(res.scorRaspuns)
            this.tabels = res.result;
        },(err)=>{
            this.log('actualizare_mese error',err);
        }
    );

}


  public postCall(endpoint: string, doc: any): Observable<any> {

    let call = new Observable<any>(
      (observer) => {
        Http.request({
          url: appConfig.apiUrl + endpoint,
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          content: JSON.stringify(doc)
        }).then(
          (response: HttpResponse) => {
            observer.next(response.content.toJSON());
          }
        ).catch((e) => {
          observer.error(e);
          observer.complete();
        });

      }
    );
    return call;
  }


  public log(...res: Array<any>) : void {
    if (this.debug) console.log(...res);
  }

}
