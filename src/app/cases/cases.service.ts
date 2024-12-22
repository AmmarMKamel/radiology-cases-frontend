import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface Case {
  _id?: string;
  title: string;
  thumbnail: string;
  data: { title: string; _id: string; thumbnail: string; images: string[] }[];
  createdAt: string;
  updatedAt: string;
}

export interface APIResponse {
  message: string;
}

export interface CaseAPIResponse {
  case: Case;
  message: string;
}

export interface CasesAPIResponse {
  cases: Case[];
  message: string;
  total: number;
}

@Injectable({
  providedIn: 'root', // Makes the service available throughout the app
})
export class CasesService {
  private apiUrl = environment.apiUrl + '/cases';

  constructor(private http: HttpClient) {}

  getCases(page: number): Observable<CasesAPIResponse> {
    const url = `${this.apiUrl}?page=${page}`;

    return this.http
      .get<CasesAPIResponse>(url)
      .pipe(catchError(this.handleError('getCases')));
  }

  getCase(id: string): Observable<CaseAPIResponse> {
    const url = `${this.apiUrl}/${id}`;
    return this.http
      .get<CaseAPIResponse>(url)
      .pipe(catchError(this.handleError(`getCase id=${id}`)));
  }

  addCase(url: string): Observable<APIResponse> {
    return this.http
      .post<APIResponse>(this.apiUrl, { url })
      .pipe(catchError(this.handleError('addCase')));
  }

  updateCase(id: string, updatedCase: Case): Observable<any> {
    // Returns Observable<any> for successful updates
    const url = `${this.apiUrl}/${id}`;
    return this.http.put(url, updatedCase).pipe(
      tap((_) => console.log(`updated case id=${id}`)),
      catchError(this.handleError('updateCase'))
    );
  }

  deleteCase(id: string): Observable<Case> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<Case>(url).pipe(
      tap((_) => console.log(`deleted case id=${id}`)),
      catchError(this.handleError('deleteCase'))
    );
  }

  private handleError(operation = 'operation') {
    return (error: HttpErrorResponse): Observable<never> => {
      // Return Observable<never>
      if (error.error instanceof ErrorEvent) {
        // A client-side or network error occurred. Handle it accordingly.
        console.error('An error occurred:', error.error.message);
      } else {
        // The backend returned an unsuccessful response code.
        // The response body may contain clues as to what went wrong,
        console.error(
          `Backend returned code ${error.status}, ` + `body was: ${error.error}`
        );
      }

      // Return an observable with a user-facing error message.
      const errorMessage =
        error.error?.message ||
        `Operation '${operation}' failed: ${error.message}`;
      return throwError(() => new Error(errorMessage));
    };
  }
}
