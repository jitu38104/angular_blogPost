import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataModel } from 'src/app/model/dataModel';
import { AlertifyService } from 'src/app/service/alertify.service';
import { ApiService } from 'src/app/service/api.service';
import { Countries } from 'src/assets/countries';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  allCountries = new Countries().countriesArr;
  registerObj:any = new DataModel().register;
  loginObj:any = new DataModel().login;

  errorFlags = {
    register: [0,0,0,0,0,0],
    login: [0, 0]
  }
  errorMsg = {
    email: "Email field is required",
    repeatP: "Repeat password field is required"
  }

  constructor(
    private apiService: ApiService, 
    private alertService: AlertifyService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.isUserAlreadyExist();
  }

  async isUserAlreadyExist(){
    const dataObj = await this.apiService.getUser();
    
    console.log(typeof dataObj, dataObj);
    if(Object.keys(dataObj).length > 0) this.router.navigate(["/home"]);
  }

  onEnter(e:any) {
    if(e.key == "Enter") this.onSubmit("login");
  }


  onSubmit(type:string) {
    if(this.isValidated(type)) {
      if(type == "register") {
        const apiBody = {...this.registerObj};
        delete apiBody["repeatPassword"];
        this.apiService.userRegister(apiBody).subscribe((res:any) => {
          if(!res.error && res?.msg == "OK") {
            this.alertService.success("User Registered Successfully!");
            this.registerObj = new DataModel().register;
          } else {
            this.alertService.error(res?.msg)
          }
        });
      } else {
        this.apiService.userLogin({...this.loginObj}).subscribe((res:any) => {
          if(!res?.error && res?.msg == "OK" && res?.results.length>0) {
            this.alertService.navSideMenu.next(true);
            this.alertService.success("Login Successfully");
            this.loginObj = new DataModel().login;
            this.apiService.addUser(res?.results[0]);
            this.router.navigate(["/home"]);
          } else {
            this.alertService.error(res?.msg);
          }
        });
      }  
    }
  }

  refreshFormError() {
    this.errorFlags = {
      register: [0,0,0,0,0,0],
      login: [0, 0]
    };
    this.errorMsg = {
      email: "Email field is required",
      repeatP: "Repeat password field is required"
    }
  }

  isValidated(type:string):boolean {
    let errorCounter = 0;

    this.refreshFormError();

    if(type == "register") {
      const keys = Object.keys(this.registerObj);

      keys.forEach((key, index) => {
        if(key == "email" && this.registerObj[key] != "") {
          if(!this.registerObj[key].includes("@") || !this.registerObj[key].includes(".com")) {
            this.errorFlags.register[index] = 1;
            this.errorMsg.email = "Email is in invalid format";
            errorCounter++;
          }
        } else if(key == "repeatPassword" && this.registerObj[key] != "") {
          if(this.registerObj.password !== this.registerObj[key]) {
            this.errorFlags.register[index] = 1;
            this.errorMsg.repeatP = "Password are mismatched";
            errorCounter++;
          }
        } else {
          if(this.registerObj[key] == "") {
            if(key == "email") this.errorMsg.email = "Email field is required";
            else if(key == "repeatPassword") this.errorMsg.repeatP = "Repeat Password feild is required";

            this.errorFlags.register[index] = 1;

            errorCounter++;
          }
        }
      });
    } else {
      const keys = Object.keys(this.loginObj);
      keys.forEach((key, index) => {
        if(this.loginObj[key] == "") {
          this.errorFlags.login[index] = 1;
          errorCounter++;
        }
      });
    }

    return errorCounter==0;
  }

}
