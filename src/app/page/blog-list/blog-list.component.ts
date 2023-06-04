import { Component, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AlertifyService } from 'src/app/service/alertify.service';
import { ApiService } from 'src/app/service/api.service';

@Component({
  selector: 'app-blog-list',
  templateUrl: './blog-list.component.html',
  styleUrls: ['./blog-list.component.scss']
})
export class BlogListComponent implements OnInit, OnDestroy {

  constructor(
    private apiService: ApiService,
    private router: Router,
    private route: ActivatedRoute,
    private alertService:AlertifyService
  ) { }

  allUserArr:any[] = [];

  currentListType:any = "blogs";
  routeSubscription:Subscription = new Subscription();

  ngOnInit(): void {
    this.currentListType = this.route.snapshot.paramMap.get('type') || "blogs";
    this.getAllMyBlogs();
    
    if(this.routeSubscription) this.routeSubscription.unsubscribe();
    this.routeSubscription = this.router.events.subscribe((res:any) => {
      if(res instanceof NavigationEnd){
        const splittedPath = res.url.split("/");
        this.currentListType = splittedPath[splittedPath.length-1];
        this.getAllMyBlogs();
      }
    });
  }

  ngOnDestroy(): void {
    this.routeSubscription.unsubscribe();
  }

  async getAllMyBlogs() {
    if(this.currentListType == "blogs") {
      (await this.apiService.getAllUserBlogs()).subscribe((res:any) => {
        if(!res?.error) {
          this.allUserArr = res?.result;
        }
      });
    } else {
      this.allUserArr = await this.apiService.getBookmark();
    }
  }

  toggleBlogVisibility(event:any, id:number) {
    this.apiService.blogVisibilityToggle({
      boolFlag: event.target.checked ? 1 : 0, 
      blogId: id
    }).subscribe((res:any) => {
      if(!res.error) this.alertService.success("Blog visibility updated Successfully!");
      else this.alertService.error(res.msg);
    });
  }

  async redirectToEdit(data:any) {
    this.alertService.selectedBlogData.next(data);
    this.router.navigate(["user-edit", await this.apiService.getUserItem("user_id")]);
  }

  gotoStoryPage(id:any){
    this.router.navigate(["blog", id]);
  }

  async deleteData(type:string, elemId:string, itemId:any="") {
    const hiddenDivTag = document.getElementById(elemId) as HTMLDivElement;
    
    if(type == "blogs") {
      this.apiService.deleteBlog(itemId).subscribe((res:any) => {
        if(!res?.error) {
          this.alertService.success(res?.msg);
          this.getAllMyBlogs();
        } else this.alertService.error(res?.msg);
      });

      hiddenDivTag.focus();
    } else if(type == "bookmark") {
      this.allUserArr = await this.apiService.deleteBookmark(itemId);
      this.alertService.success("Bookmark deleted!");

      hiddenDivTag.focus();
    } else hiddenDivTag.focus(); 
  }
}
