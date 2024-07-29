import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
	providedIn: 'root',
})

export class MsaluserService {
	private userObs$: BehaviorSubject<IUserData> = new BehaviorSubject(null);

	paramObs$ = this.userObs$.asObservable();



	private user: IUserData = {
		AccessToken: '',
		Email: '',
		GivenName: '',
		Group: '',
		IsAuthenticated: false,
		LastName: '',
		Username: '',
		Name: '',
		UserFirstAndLastName: '',
		IsExternal: false
	};

	constructor(private http: HttpClient) {
		this.paramObs$.subscribe((data) => {
			if (data != null) {
				this.user = data;
				this.user.Username = this.user.Name;
				this.user.FullName = (`${this.user.GivenName} ${this.user.LastName}`).trim();
			}
		});
	}

	get getUser() {
		return this.user;
	}

	getAccessToken() {
		let token: string;

		if (this.user) {
			token = this.user.AccessToken;
		} else {
			token = null;
		}

		return token;
	}

	setUserObs(userData: IUserData) {
		this.userObs$.next(userData);
	}
}

export declare type IUserData = {
	AccessToken: string;
	Email: string;
	GivenName: string;
	Group: string;
	IsAuthenticated: boolean;
	LastName: string;
	Username: string;
	Name: string;
	UserFirstAndLastName: string;
	IsExternal: boolean;
	FullName?: string;
};

