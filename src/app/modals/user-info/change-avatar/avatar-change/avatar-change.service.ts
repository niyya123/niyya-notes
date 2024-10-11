import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { apiUrl } from '../../../../environments/environments.prod';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AngularFireAuth } from '@angular/fire/compat/auth';


@Injectable({
  providedIn: 'root'
})
export class AvatarChangeService {

constructor(private http: HttpClient,private storage: AngularFireStorage, private afAuth: AngularFireAuth) { }
  changeAvatar(file:any,userid:any):Promise<any>{
    return new Promise((res,rej)=>{
      this.afAuth.currentUser.then(user =>{
        if(user){
          const filePath = `${userid}/avatar/${file?.name}`;
          const storageRef  = this.storage.ref(filePath);
          const uploadTask  = this.storage.upload(filePath, file);


          uploadTask
          .then(()=>storageRef.getDownloadURL().subscribe(url =>{res(url)}))
          .catch(rej)
        }else{
          rej('No authenticated user.');
        }
      })
    })
  }

  changeAvatarInDb(url:any,userid:any):Promise<any>{
    let data = {
      avatarUrl : url
    }
    return this.http.patch<any>(`${apiUrl}/user/avatar/${userid}`,data).toPromise()
  }
}
