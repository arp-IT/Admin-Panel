import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import {  HttpHeaders } from "@angular/common/http";

@Component({
  selector: 'app-third-page',
  templateUrl: './third-page.component.html',
  styleUrls: ['./third-page.component.css']
})
export class ThirdPageComponent implements OnInit {
  restItems=[];
  // restItemsUrl = 'https://p3rieu2hsf.execute-api.ap-south-1.amazonaws.com/Dev/fetchuserfeedback';
  restItemsUrl = 'https://v83k1hec93.execute-api.ap-south-1.amazonaws.com/Dev/fetchuserfeedback';
  p: number = 1;
  position;
  today;
  lasttime;
  spinner:boolean=true;
  connection:boolean=false;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.today=new Date;
    this.getRestItems();
    
  }

  get disabled(): boolean {
    return this.restItems.length >= 300;
  }


  getRestItems(): void {
    
    this.restItemsServiceGetRestItems()
      .subscribe(
        restItems => {
          this.restItems = [...this.restItems,...restItems['feedbackList']];
          this.position= Object.keys(this.restItems).length;
          console.log(restItems['feedbackList']);
          console.log(this.restItems[this.position-1]);
          this.spinner=false;
          this.lasttime = this.restItems[this.position-1].createdTime;
          console.log(this.lasttime);
          console.log(this.today);
        },
        error => {
          if (error.status === 0) {
            this.connection= true;
          console.log("No Internet connection"); 
        }
        }
      )
  }

  restItemsServiceGetRestItems() {
    console.log(this.today)
    let headers: HttpHeaders = new HttpHeaders({
      beforeTime:this.today
    });
    
    return this.http.post(this.restItemsUrl,
        {
          beforeTime:this.today,
        }
      ).pipe(map(data => data));
  }
    onScrollEnd() {
      console.log(this.today);
      this.today = this.lasttime;
      console.log(this.lasttime);
      console.log(this.today);
    this.getRestItems();
    console.log("scroling");
  }
  
}