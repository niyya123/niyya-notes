import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { apiUrl } from '../../environments/environments.prod';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

constructor(private http : HttpClient,
  private afAuth: AngularFireAuth) { }
  login(data:any):Promise<any>{
    return this.http.post(`${apiUrl}/login`,data).toPromise()
  }

  register(data:any):Promise<any>{
    return this.http.post(`${apiUrl}/register`,data).toPromise()
  }

  firebaseLogin(email: string, password: string) {
    return this.afAuth.signInWithEmailAndPassword(email, password);
  }
}
