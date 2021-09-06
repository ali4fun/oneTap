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

  user_info: any = {};
  debug: boolean = false;

  checkConversation: boolean = false;

  constructor(public cache: CacheService, public conn: ConnectionService) { }

  saveUserInfo(user: any) {
    this.cache.put('user', JSON.stringify(user));
  }

  getUserInfo(): any {
    if (this.cache.get('user')) return JSON.parse(this.cache.get('user'));
    else return null;
  }

  logout() {
    this.cache.removeAll();
  }


  postCall(endpoint: string, doc: any): Observable<any> {

    let call = new Observable<any>(
      (observer) => {
        Http.request({
          url: appConfig.apiUrl + endpoint, // + '/' + appConfig.appKey,
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

  updateTables(){

  }

  log(...res: Array<any>) {
    if (this.debug) console.log(...res);
  }

}
