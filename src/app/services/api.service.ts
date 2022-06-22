import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SortDirection } from '@angular/material/sort';
import { Observable } from 'rxjs';
import { User, Users } from '../user';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  href = 'http://localhost:8000';

  constructor(private httpClient: HttpClient) {}

  getUsers(sort: SortDirection, page: number, quantity: number, search: string = ''): Observable<Users> {
    const requestUrl = `${this.href}/users?&sort=${sort}&page=${page + 1}&quantity=${quantity}&search=${search}`;
    return this.httpClient.get<Users>(requestUrl);
  }

  deleteUser(id: number) {
    const requestUrl = `${this.href}/deleteuser/${id}`;
    return this.httpClient.delete(requestUrl, { observe: 'response', responseType: 'text' });
  }

  addUser(body: User) {
    const requestUrl = `${this.href}/adduser/`;
    return this.httpClient.post(requestUrl, body, { observe: 'response', responseType: 'text' });
  }

  getUserById(id: number): Observable<User> {
    const requestUrl = `${this.href}/userbyid/${id}`;
    return this.httpClient.get<User>(requestUrl);
  }

  updateUser(id: number, body: User) {
    const requestUrl = `${this.href}/updateuser/${id}`;
    return this.httpClient.put(requestUrl, body, { observe: 'response', responseType: 'text' });
  }

}
