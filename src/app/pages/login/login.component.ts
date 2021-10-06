import { Component, OnInit } from '@angular/core';
import { RouterExtensions } from '@nativescript/angular';
import { Page, Utils } from '@nativescript/core';
import { CONTINUOUS_SERVICE_CLASSNAME } from '~/app/shared/background/continuous_service.android';
import { DataService } from '~/app/shared/data.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

    loginTitle: string = 'Switch to Email Log in.';
    isPinLogin: boolean = true;

    // pin: string = '1234';
    // user_code: string = '0360175';

    pin: string = '';
    user_code: string = '';

    _loading: boolean = false;
    get loading(): boolean {
        return this._loading;
    }

    constructor(private page: Page, private data: DataService, private routerExt: RouterExtensions) { }

    ngOnInit() {
        this.page.actionBarHidden = true;
    }

    submit() {
        this.loginPin();
    }

    loginPin() {
        if (this._loading) return;
        this._loading = true;

        if (!this.pin || !this.user_code) {
            alert('Please add both pin and code');
            this._loading = false;
            return;
        }


        let doc = {
            pin: this.pin,
            user_code: this.user_code
        }

        this.data.log('login =>', doc);
        this.data.postCall('login', doc).subscribe(
            (res) => {
                this.data.log('login result', res);
                if (res.scorRaspuns == 1) {
                    this.data.user_info = res.user;
                    this.data.user_info.pin = this.pin;
                    this.data.saveUserInfo(res.user);
                    this.start();
                    this.routerExt.navigate(['/home'], { clearHistory: true });
                } else {
                    alert(res.message);
                } 
                this._loading = false;
            }, (err) => {
                this.data.log('login error', err);
                alert('There are some error. please try again.')
                this._loading = false;
            }
        );
    }

    start() {
        let context = Utils.ad.getApplicationContext();
        const serviceIntent = new android.content.Intent();
        serviceIntent.setClassName(context, CONTINUOUS_SERVICE_CLASSNAME);
        context.startService(serviceIntent);
    
      }


    onCheckedChange(args) {
        console.log(args.value);
        if (args.value) {
            this.isPinLogin = false;
            this.loginTitle = 'Switch to PIN log in';
        } else {
            this.isPinLogin = true;
            this.loginTitle = 'Switch to Email Log in.';
        }

    }
}
