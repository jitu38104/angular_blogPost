import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AlertifyService } from 'src/app/service/alertify.service';
import { ApiService } from 'src/app/service/api.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  sideMenu:boolean = false;
  menuBoxVisible:boolean = false;
  usernamePrefix:string = "";
  userData:any = {};

  eventSubscription:Subscription = new Subscription();

  constructor(
    private apiService: ApiService,
    private alertService: AlertifyService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initFunction();
    this.eventSubscription = this.alertService.navSideMenu.subscribe(res => this.sideMenu = res);
  }

  ngOnDestroy() {
    this.eventSubscription.unsubscribe();
  }

  async initFunction() {
    this.userData = await this.apiService.getUser();
    console.log(typeof this.userData, this.userData);
    

    if(Object.keys(this.userData).length > 0) {
      this.sideMenu = true;
      setTimeout(() => {        
        this.usernamePrefix = `${this.userData["first_name"][0]}`.toUpperCase();
      }, 1500);
    }
  }

  onFocusMenu(elem:any) {
    elem.style.display = "none";
  }

  hideSideMenu = () => this.menuBoxVisible=false;

  logout() {
    if(this.apiService.removeUser()){
      this.sideMenu = false;
      this.router.navigate(["/login"]);
    }
  }

  redirectTo(path:string) {
    if(path == "editor") this.router.navigate(["/user-edit", this.userData?.user_id]);
    else if(["blogs","bookmarks"].includes(path)) this.router.navigate(["/list", path]);
    else this.router.navigate(["/"+path]);

    this.hideSideMenu();
  }
}
