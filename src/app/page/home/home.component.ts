import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/service/api.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(
    private apiService: ApiService
  ) { }

  allBlogsArr:any[] = [];
  imgPath = environment.imgUrl;

  ngOnInit(): void {
    this.getAllBlogs();
  }

  getAllBlogs() {
    this.apiService.getAllBlogs().subscribe((res:any) => {
      if(!res?.error) {
        this.allBlogsArr = res?.result;
      }
    })
  }
}
