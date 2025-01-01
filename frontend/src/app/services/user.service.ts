  import { Injectable } from '@angular/core';
  import { HttpClient } from '@angular/common/http';
  import { Observable } from 'rxjs';
  import { EnvironmentService } from './environment.service';
import { AuthService } from './auth.service';

  @Injectable({
    providedIn: 'root'
  })
  export class UserService {
    private adminUrl = this.envService;

    constructor( private http: HttpClient ,  private envService: EnvironmentService,private authService: AuthService) {}

    getUsers(): Observable<User[]> {
      const headers = this.authService.addTokenToHeaders();
      return this.http.get<User[]>(this.envService.getUserProfilesUrl(), { headers });

  }
  getCurrentUser(): Observable<any> {
    const headers = this.authService.addTokenToHeaders();
    return this.http.get<any>(`${this.envService.getProfileUrl()}`, { headers });
  }
}
  export interface User {
    _id: string;
    userName: string;
    userSurname: string;
    userTC: string;
    userPassword: string;
    userMail: string;
    userTel: string;
    isAdmin:boolean;
  }
