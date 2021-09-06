import { Component, OnInit } from '@angular/core';
import { RouterExtensions } from '@nativescript/angular';
import { Page } from '@nativescript/core';
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

    email: string = 'parvinder704@yopmail.com';
    password: string = 'admin123';

    _loading: boolean = false;
    get loading(): boolean {
        return this._loading;
    }

    constructor(private page: Page, private data: DataService, private routerExt: RouterExtensions) { }

    ngOnInit() {
        this.page.actionBarHidden = true;
    }

    submit() {
        if (this.isPinLogin) this.loginPin();
        else this.loginEmail();
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
                if (res.user) {
                    this.data.user_info = res.user;
                    this.data.user_info.pin = this.pin;
                    this.data.saveUserInfo(res.user);
                    this.routerExt.navigate(['/home'], { clearHistory: true });
                } else if (res.errors) {
                    alert('pin error');
                }
                this._loading = false;
            }, (err) => {
                this.data.log('login error', err);
                alert('There are some error. please try again.')
                this._loading = false;
            }
        );
    }

    loginEmail() {
        if (this._loading) return;
        this._loading = true;
        console.log(this.email, this.password);
        if (!this.email || !this.password) {
            alert('Please add both email and password');
            this._loading = false;
            return;
        }

        let doc = {
            email_username: this.email,
            password: this.password
        };

        this.data.log('loginbyEmail =>', doc);
        this.data.postCall('loginbyEmail', doc).subscribe(
            (res) => {
                this.data.log('loginByEmail result', res);
                if (res.user) {
                    this.data.user_info = res.user;
                    this.data.saveUserInfo(res.user);
                    this.routerExt.navigate(['/dashboard'], { clearHistory: true });
                } else if (res.errors) {
                    alert('pin error');
                }
                this._loading = false;
            }, (err) => {
                this.data.log('loginByEmail error', err);
                this._loading = false;
            }
        );
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
