import { HttpBackend, HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthToken } from '../models';
import { environment } from 'src/environments/environment';
import { ILoginPostData, ISignupPostData } from 'src/app/interfaces/auth.interfaces';
const api = environment;

@Injectable({
  providedIn: 'root'
})
export class AuthService {


  constructor(private http: HttpClient, private handler: HttpBackend) { }

  isLoggedIn() {
    return this.getCurrentUserData()?.access_token && this.getCurrentUserData()?.refresh_token;
  }

  getCurrentUserData(): AuthToken {
    return JSON.parse(localStorage.getItem('currentUser'));
  }

  clearSession() {
    localStorage.removeItem('currentUser');
  }

  orcidSigninStage1() {
    window.open(api.orcidStage1API + '?client_id=' + api.orcidClientId + '&response_type=code&scope=/authenticate&redirect_uri=' + api.orcidRedirectURL);
  }

  setToken(data: any) {
    let currentToken = this.getCurrentUserData();
    if (currentToken) {
      Object.assign(currentToken, data);
    } else {
      currentToken = data;
    }
    localStorage.setItem('currentUser', JSON.stringify(currentToken));
  }

  orcidSigninStage2(code: string): Observable<any> {
    const body = {
      client_id: api.orcidClientId,
      client_secret: api.orcidClientSecret,
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: api.orcidRedirectURL,
    }
    const httpOptions = {
      headers: new HttpHeaders({
        'accept': 'application/json'
      })
    };
    return this.http.post(
      api.API_PATH + 'token',
      // payload,
      body,
      httpOptions);
  }

  signup(data: ISignupPostData): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'accept': 'application/json'
      })
    };
    let client = new HttpClient(this.handler);
    return client.post(
      api.API_PATH + 'auth/signup',
      data,
      httpOptions);
  }

  login(data: ILoginPostData): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'accept': 'application/json'
      })
    };
    let client = new HttpClient(this.handler);
    return client.post(
      api.API_PATH + 'auth/login',
      data,
      httpOptions);
  }

  // public orcidSigninStage3(res?: any): Observable<any> {
  //   const headers = new HttpHeaders({
  //     'accept': 'application/vnd.orcid+json',
  //     'Authorization': 'Bearer ' + res.access_token
  //   })
  //   return this.http.get(this.orcidStage3API + res.orcid + '/record', {
  //     headers: headers,
  //   });
  // }

  public orcidSignOut(): Observable<any> {
    // const headers = new HttpHeaders({
    //   'accept': 'application/vnd.orcid+json',
    //   'Authorization': 'Bearer ' + res.access_token
    // })
    return this.http.jsonp(
      api.orcidSignoutProxyAPI, 'callback'
    );
  }

  // https://orcid.org/userStatus.json?logUserOut=true.
}


