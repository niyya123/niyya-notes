import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { apiUrl } from '../../environments/environments.prod';

@Injectable({
    providedIn: 'root' // Angular 6+ way of providing the service at root level
})
export class NotesService{

    constructor(private http : HttpClient) { }
    getNotes(): Promise<any>{
        return this.http.get<any>(`${apiUrl}/todos`).toPromise()
    }
}