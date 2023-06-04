import { Component, OnInit } from '@angular/core';
import { AlertifyService } from 'src/app/service/alertify.service';
import { ApiService } from 'src/app/service/api.service';
import { Countries } from 'src/assets/countries';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  constructor(
    private apiService: ApiService,
    private alertService: AlertifyService
  ) { }

  allCountries:any[] = new Countries().countriesArr;
  isResetPassForm:boolean = false;
  isUsernameReset:boolean = false;
  isCountryReset:boolean = false;

  userEmail:string = "";
  fullName:string = "";
  firstName:string = "";
  lastName:string = "";
  country:string = "";
  password = {old: "", new: "", repeat: ""};

  ngOnInit(): void {
    this.getUserDetails();
  }

  async getUserDetails() {
    const userDetails = await this.apiService.getUser();
    this.firstName = userDetails["first_name"];
    this.lastName = userDetails["last_name"];
    this.userEmail = userDetails["email"];
    this.country = userDetails["country"];
    this.fullName = `${this.firstName} ${this.lastName}`;
  }

  async updateUserDetail(type:string) {
    if(this.fullName == "" || this.country == "") return;

    let sqlString = "";

    if(type == "name") {
      this.firstName = this.fullName.split(" ")[0];
      this.lastName = this.fullName.split(" ")[1];
      sqlString = `first_name='${this.firstName}', last_name='${this.lastName}'`;
    } else if(type == "country") sqlString = `country='${this.country}'`;
    
    const body = { sqlString, userId: await this.apiService.getUserItem("user_id") };

    this.apiService.userDetailUpdate(body).subscribe(async(res:any) => {
      if(!res.error) {
        this.alertService.success(res.msg);

        const userDetails = await this.apiService.getUser();
        if(type == "name") {
          userDetails["first_name"] = this.firstName;
          userDetails["last_name"] = this.lastName;
          this.isUsernameReset = false;
        } else {
          userDetails["country"] = this.country;
          this.isCountryReset = false;
        }
        this.apiService.updateUserItem(JSON.stringify(userDetails));
      } else this.alertService.error(res.msg);
    });
  }

  async updateUserPassword() {
    if(this.password.new == "" && this.password.old == "" && this.password.repeat == "") return;

    const dataObj = {
      newPassword: this.password.new, 
      oldPassword: this.password.old, 
      userId: await this.apiService.getUserItem("user_id")
    };

    this.apiService.userPasswordUpdate(dataObj).subscribe((res:any) => {
      if(!res.error) {
        this.alertService.success(res.msg);
        this.isResetPassForm = false;
        this.password = {old: "", new: "", repeat: ""};   
      } else this.alertService.error(res.msg);
    });
  }
}
