import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { apiUrl } from '../../../environments/environments.prod';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { catchError, from, of, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AddImagesService {

constructor(private http: HttpClient,private storage: AngularFireStorage, private afAuth: AngularFireAuth) { }
  uploadImages(file:any, userid:any):Promise<any>{
    return new Promise((res,rej)=>{
      this.afAuth.currentUser.then(user =>{
        if(user){
          const filePath = `${userid}/gallery/${file?.name}`;
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

  uploadImagesInDb(url:any,username:any,filename:any):Promise<any>{
    console.log('filename: ', filename);
    let data = {
      url : url,
      author : username,
      filename: filename
    }
    return this.http.post<any>(`${apiUrl}/gallery/upload`,data).toPromise()
  }

  checkFileExits(filePath:string){
    const fileRef = this.storage.ref(filePath);
    return from(fileRef.getMetadata()).pipe(
      switchMap((metadata) => {
        return of(true);
      }),
      catchError((error) => {
        if (error.code === 'storage/object-not-found') {
          return of(false);
        }
        // Handle other errors
        return of(false);
      })
    );
  }
}
