import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})

export class EndpointsService{
  private baseUrl = "http://localhost:8000";

  private peliculasURL = `${this.baseUrl}/api/v1`

  constructor(private http: HttpClient) {}


  PeliculasGetAll(): Observable<any> {
    const url = `${this.peliculasURL}/movie`;
    return this.http.get<any>(url);
  }

  PeliculasPost(movieData: any): Observable<any> {
    const url = `${this.peliculasURL}/movie`;
    return this.http.post<any>(url, movieData);
  }

  PeliculasDeleteById(movieId: string): Observable<any> {
    const url = `${this.peliculasURL}/movie/${movieId}`;
    return this.http.delete<any>(url);
  }

  PeliculaUpdate(movieId: string, movieData: any): Observable<any> {
    const url = `${this.peliculasURL}/movie/${movieId}`;
    return this.http.patch<any>(url, movieData);
  }


}
