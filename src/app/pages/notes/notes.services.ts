import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { apiUrl } from '../../environments/environments.prod';

@Injectable({
    providedIn: 'root' // Angular 6+ way of providing the service at root level
})
export class NotesService{

    constructor(private http : HttpClient) { }
    getNotes(params: { page?: number; pageSize?: number; author?:string }): Promise<any>{
        let reqParams = new HttpParams();
        if(params.page && params.pageSize){
            reqParams = reqParams.append('page', params.page.toString());
            reqParams = reqParams.append('pageSize', params.pageSize.toString());
            reqParams = reqParams.append('author', params.author.toString());
        }
        return this.http.get<any>(`${apiUrl}/todos`,{ params: reqParams }).toPromise()
    }

    searchNotes(params: { page?: number; pageSize?: number;title?:string;isDone?:boolean;author?:string;createdAt?:number;endDate?:number,text?:string }): Promise<any>{
        let reqParams = new HttpParams();

        Object.keys(params).forEach(key => {
            if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
                reqParams = reqParams.append(key, params[key].toString());
            }
        });
        return this.http.get<any>(`${apiUrl}/todos/search`,{ params: reqParams }).toPromise()
    }

    getOneNote(id:any): Promise<any>{
        return this.http.get<any>(`${apiUrl}/todos/${id}`).toPromise()
    }

    createNotes(data:any): Promise<any>{
        return this.http.post<any>(`${apiUrl}/todos`,data).toPromise()
    }

    updateNotes(data:any): Promise<any>{
        return this.http.put<any>(`${apiUrl}/todos/${data.id}`,data).toPromise()
    }

    updateStatusNotes(data:any): Promise<any>{
        return this.http.put<any>(`${apiUrl}/todos/changeStatus/${data.id}`,data).toPromise()
    }

    deleteNote(id:any): Promise<any>{
        return this.http.delete<any>(`${apiUrl}/todos/${id}`).toPromise()
    }
}