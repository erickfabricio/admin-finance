import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { UserModel } from 'src/app/entity/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  
  constructor(private http: HttpClient) { }

  login(user: UserModel): Observable<any> {
    
    let headers: HttpHeaders = new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8',
      'Authorization': 'Bearer ' + environment.token
    });

    let options = {
      headers: headers
    };

    return this.http.post(`${environment.api}/session/login`, user, options);
  }

  signOut(): Observable<any> {
    
    let headers: HttpHeaders = new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8',
      'Authorization': 'Bearer ' + localStorage.getItem("token")
    });

    let options = {
      headers: headers
    };
        
    return this.http.post(`${environment.api}/session/signout`, null, options);
  }

  validate(): Observable<any> {
    
    let headers: HttpHeaders = new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8',
      'Authorization': 'Bearer ' + localStorage.getItem("token")
    });

    let options = {
      headers: headers
    };
        
    return this.http.post(`${environment.api}/session/validate`, null, options);
  }


}
