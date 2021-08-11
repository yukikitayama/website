import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';

import { environment } from '../../environments/environment';

const API_URL = environment.apiUrl;

@Injectable({providedIn: 'root'})
export class AuthService {
  constructor(private http: HttpClient) {}

  login(email: string, password: string) {
    const authData = {
      email: email,
      password: password
    }
    this.http.post(API_URL + '/login', authData)
      .subscribe(response => {
        console.log(response);
      });
  }
}
