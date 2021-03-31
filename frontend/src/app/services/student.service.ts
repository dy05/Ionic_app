import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

export interface Student {
  id: string;
  name: string;
  email: string;
  password: string;
  created_at: string;
}

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private url = 'http://app.test/School/ionic_app/backend/api/students';

  constructor(private http: HttpClient) { }

  getAll() {
    return this.http.get<[Student]>(this.url);
  }

  create(student: Student) {
    return this.http.post(this.url, student);
  }

  get(id: string) {
    return this.http.get<Student>(this.url + '/' + id);
  }

  update(id: string, student: Student) {
    return this.http.put(this.url + '/' + id, student);
  }

  delete(id: string) {
    return this.http.delete(this.url + '/' + id);
  }
}
