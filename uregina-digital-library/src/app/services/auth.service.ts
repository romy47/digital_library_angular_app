import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthToken } from '../Models';
import * as api from './../../environments/custom/sandbox-localhost';

@Injectable({
  providedIn: 'root'
})
export class AuthService {


  constructor(private http: HttpClient) { }

  isLoggedIn() {
    return (this.getCurrentUserData() && this.getCurrentUserData().orcid);
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
    // const payload = new HttpParams()
    //   .set('client_id', this.orcidClientId)
    //   .set('client_secret', this.orcidClientSecret)
    //   .set('grant_type', 'authorization_code')
    //   .set('code', code)
    //   .set('redirect_uri', this.orcidRedirectURL);

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


