import { Injectable } from '@angular/core';
import * as alertify from 'alertifyjs';
import { Subject, BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AlertifyService {

  constructor() { }

  success(message: string) {
    alertify.success(message);
  }

  error(message: string) {
    alertify.error(message);
  }

  warning(message: string) {
    alertify.warning(message);
  }

  message(message: string) {
    alertify.message(message);
  }



  //event emitters services
  navSideMenu:Subject<boolean> = new Subject<boolean>();
  selectedBlogData:Subject<any> = new BehaviorSubject<any>({});
}
