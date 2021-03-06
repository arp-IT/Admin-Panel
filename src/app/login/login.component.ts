import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { UserService } from '../user.service';
import { FormControl, Validators } from '@angular/forms';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { environment } from '../../environments/environment';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  flag = true;
  login = false;
  restItems: any;
  username:  any;
  password: any;
  restItemsUrl = environment.AdminSignIn;
  mobileFormControl = new FormControl('', [
    Validators.required,
  ]);


  constructor(private router: Router, private user: UserService, private http: HttpClient,  protected localStorage: LocalStorage) {
    this.user.isUserLoggedIn = false;
   }

  ngOnInit() {
  }
  restItemsServiceGetRestItems() {
    return this.http
      .post(this.restItemsUrl,
        {
          'userName': this.username,
          'password': this.password
        }
      )
      .pipe(map(data => data));
  }

  loginUser(e) {
    this.flag = true;
    e.preventDefault();
    this.login = true;
     this.username = e.target.elements[0].value;
     this.password = e.target.elements[1].value;
     this.restItemsServiceGetRestItems()
      .subscribe(
        restItems => {
          this.restItems = restItems;
          if (this.restItems === 'SUCCESS') {
            this.user.set(true);
            this.user.get();
            this.user.setUserLoggedIn(this.user.value);
            localStorage.setItem('flag1', 'false');
            localStorage.setItem('flag2', 'false');
            localStorage.setItem('flag3', 'false');
            localStorage.setItem('flag4', 'true');
            this.router.navigate(['dashboard']);
            this.login = false;
          } else {
            this.flag = false;
            this.router.navigate(['login']);
            this.login = false;
          }
        },
        error => {
          if (error.status === 0) {
            alert('check your Internet connection');
          }
        }
      );
  }
}
