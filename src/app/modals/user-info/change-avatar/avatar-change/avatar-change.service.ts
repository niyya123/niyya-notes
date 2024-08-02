import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { apiUrl } from '../../../../environments/environments.prod';


@Injectable({
  providedIn: 'root'
})
export class AvatarChangeService {

constructor(private http: HttpClient) { }
  changeAvatar(file:any, id:any):Promise<any>{
    const formData = new FormData();
    formData.append('image', file);
    return this.http.patch<any>(`${apiUrl}/user/avatar/${id}`,formData).toPromise()
  }
}
