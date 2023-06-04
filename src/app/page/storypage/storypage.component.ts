import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/service/api.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-storypage',
  templateUrl: './storypage.component.html',
  styleUrls: ['./storypage.component.scss']
})
export class StorypageComponent implements OnInit, OnChanges {
  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService
  ) { }

  isBookmarked:boolean = false;
  currentBlogId:any = "";
  moreOtherBlogs:any[] = [];
  allBlogsArr:any[] = [];
  imageUrl:string = environment.imgUrl;
  currentBlogData:any = {};

  ngOnChanges(changes: SimpleChanges): void {
    this.currentBlogId = this.route.snapshot.paramMap.get('blogid');
  }

  ngOnInit(): void {
    this.currentBlogId = this.route.snapshot.paramMap.get('blogid');
    this.getSingleBlog();
  }

  getSingleBlog() {
    this.apiService.getSingleBlog(this.currentBlogId).subscribe((res:any) => {
      if(!res?.error) {
        this.currentBlogData = res?.result[0];
        this.getOtherBlogs(this.currentBlogData["category"]);
      }
    });
  }

  getOtherBlogs(catId:any) {
    this.apiService.getCategoryBlogs(catId).subscribe((res:any) => {
      if(!res?.error) {
        this.allBlogsArr = res?.result;
        this.moreOtherBlogs = this.allBlogsArr.filter((item:any) => item?.blog_id != this.currentBlogId);
      }
    });
  }


  async changeBlogState(data:any) {
    this.currentBlogData = data;
    this.isBookmarked = await this.apiService.isBlogBookmarked(data["blog_id"]);
    this.moreOtherBlogs = this.allBlogsArr.filter((item:any) => item?.blog_id != data["blog_id"]);
    window.scroll({behavior: "smooth", top: 0});
  }

  async toggleBookmarkSave(data:any) {
    this.isBookmarked = await this.apiService.saveBookmark(data);
  }
}
