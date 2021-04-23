import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable,forkJoin } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OwnerService {
  public API = '//thawing-chamber-47973.herokuapp.com';
  public OWNER_API = this.API + '/owners';
  constructor(private http: HttpClient) { }

  getAll(){
    return this.http.get(this.OWNER_API);
  }

  getOwner(id:string){
    return this.http.get(this.OWNER_API + '/search/findByDni/?dni=' + id);
  }

 
  save(owner: any): Observable<any> {
    let result: Observable<Object>;
    if (owner['href']) {
      result = this.http.put(owner.href, owner);
    } else {
      result = this.http.post(this.OWNER_API, owner);
    }
    return result;
  }
  remove(href: string) {
    return this.http.delete(href);
  }

  removeOWners(hrefs:any){
    console.log(hrefs);
    return forkJoin(hrefs.map(href => this.remove(href)))
  }
}

