import { Component, OnDestroy, OnInit } from '@angular/core'
import { RouterExtensions } from '@nativescript/angular';
import { CONTINUOUS_SERVICE_CLASSNAME } from './shared/background/continuous_service.android';
import { ApplicationEventData, Application, Page, Utils } from '@nativescript/core';
import { resumeEvent, suspendEvent } from '@nativescript/core/application';

import { DataService } from './shared/data.service';

@Component({
  selector: 'ns-app',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit, OnDestroy {
  constructor(private data: DataService, private routerExt: RouterExtensions) {
    if (this.data.getUserInfo()) {
      this.start();
      this.routerExt.navigate(['/home'], { clearHistory: true });
    }
  }
  ngOnInit() {
    Application.on(suspendEvent, (args: ApplicationEventData) => {
      if (args.android) {
        // For Android applications, args.android is an android activity class.
        console.log("Activity: on pouse " + args.android);
        this.data.cache.setBoolean('service', true);
      } else if (args.ios) {
        // For iOS applications, args.ios is UIApplication.
        console.log("UIApplication: " + args.ios);
      }
    });

    Application.on(resumeEvent, (args: ApplicationEventData) => {
      if (args.android) {
        // For Android applications, args.android is an android activity class.
        console.log("Activity: on resume " + args.android);
        this.data.cache.setBoolean('service', false);
      } else if (args.ios) {
        // For iOS applications, args.ios is UIApplication.
        console.log("UIApplication: " + args.ios);
      }
    });
  }

  ngOnDestroy() {
    // this.destroy();
  }

  start() {
    let context = Utils.ad.getApplicationContext();
    const serviceIntent = new android.content.Intent();
    serviceIntent.setClassName(context, CONTINUOUS_SERVICE_CLASSNAME);
    context.startService(serviceIntent);
  }

  destroy() {
    let context = Utils.ad.getApplicationContext();
    const serviceIntent = new android.content.Intent();
    serviceIntent.setClassName(context, CONTINUOUS_SERVICE_CLASSNAME);
    context.stopService(serviceIntent);
  }
}
