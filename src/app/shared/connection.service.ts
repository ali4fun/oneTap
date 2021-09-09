import { Injectable, OnDestroy } from '@angular/core';
import { Connectivity } from '@nativescript/core';


@Injectable()
export class ConnectionService implements OnDestroy {

	public isConnected: boolean = false;
	public connectionType: string;
	public initialized: boolean = false;

	actConnection: boolean = true;

	constructor(
	) {
		this.monitorConnectivity();
		this.actConnection = true;
		// this.loop();
	}

	change(){
		this.isConnected = false;
	}

	// public loop(){
	// 	setTimeout(() => {
	// 		console.log('backgound connection working....');
	// 		this.loop();
	// 	}, 3000);
	// }
	getConnectionType() {
		let connectionType = Connectivity.getConnectionType();
		switch (connectionType) {
			case Connectivity.connectionType.none:
				this.connectionType = 'None';
				this.isConnected = false;
				break;
			case Connectivity.connectionType.wifi:
				this.connectionType = 'Wi-Fi';
				this.isConnected = true;
				break;
			case Connectivity.connectionType.mobile:
				this.connectionType = 'Mobile';
				this.isConnected = true;
				break;
			default:
				break;
		}
	}

	monitorConnectivity() {
		Connectivity.startMonitoring((newConnectionType: number) => {
			switch (newConnectionType) {
				case Connectivity.connectionType.none:
					this.connectionType = 'None';
					this.isConnected = false;
					break;
				case Connectivity.connectionType.wifi:
					this.connectionType = 'Wi-Fi';
					this.isConnected = true;
					break;
				case Connectivity.connectionType.mobile:
					this.connectionType = 'Mobile';
					this.isConnected = true;
					break;
				default:
					break;
			}
		});
	}

	ngOnInit() {
		this.actConnection = true;

	}
	ngOnDestroy() {
		this.initialized = false;
	}

}
