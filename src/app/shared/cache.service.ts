import { Injectable } from '@angular/core';
import { ApplicationSettings } from '@nativescript/core';


@Injectable({
	providedIn: 'root'
})
export class CacheService {

	constructor() { }

	get(key: string): string {
		return ApplicationSettings.getString(key);
	}
	setBoolean(key: string, val: boolean) {
		ApplicationSettings.setBoolean(key, val);
	}
	getBoolean(key): boolean {
		return ApplicationSettings.getBoolean(key);
	}
	put(key: string, val: string): void {
		ApplicationSettings.setString(key, val);
	}

	remove(key: string): void {
		ApplicationSettings.remove(key);
	}
	removeAll(): void {
		ApplicationSettings.clear();
	}
}