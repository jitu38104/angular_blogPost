import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AlertifyService } from 'src/app/service/alertify.service';
import { ApiService } from 'src/app/service/api.service';
import CustomEditor from '../../component/build/ckeditor';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild("blogImag") blogImag!: ElementRef;

  editor = CustomEditor;
  editorConfig = {
    placeholder: "Write here...",
    simpleUpload: { uploadUrl: `${environment.apiUrl}blog/editorImageUploader` }
  }

  constructor(
    private apiService: ApiService,
    private router: Router,
    private alertService: AlertifyService,
  ) { }

  categoryArr: any[] = [];
  formData = new FormData();

  prevImg: any = "assets/preview.png";
  imgFile: any;
  blogDataObj:any = { blogTitle: "", blogSubHead: "", category: "", blogBody: "" };
  errorFlags: number[] = [0, 0, 0, 0, 0];

  editBlogData:any = {};
  editBlogId:any = false;

  ngOnInit(): void {
    this.getAllCategories();

    this.alertService.selectedBlogData.subscribe((res:any) => {
      if(Object.keys(res).length > 0) this.setAllRequired({...res});
    });
  }

  ngAfterViewInit(): void {
  }

  ngOnDestroy(): void {}

  onClickSelectImage() {
    this.blogImag.nativeElement.click();
  }

  setAllRequired(data:any) {
    this.editBlogData = data;
    this.blogDataObj.category = data["category"];
    this.blogDataObj.blogTitle = data["title"];
    this.blogDataObj.blogSubHead = data["sub_heading"];
    this.blogDataObj.blogBody = data["content"];
    this.editBlogId = data["blog_id"];
    this.prevImg = environment.imgUrl + data["blog_image"];

    setTimeout(() => this.alertService.selectedBlogData.next({}), 5000);
  }

  onSelectImage(e: any) {
    this.imgFile = e.target.files[0];
    this.formData.append("blogImg", this.imgFile);

    const reader = new FileReader();
    reader.onload = () => {
      this.prevImg = reader.result as string;
    }
    reader.readAsDataURL(this.imgFile);
  }

  onSubmitBlog() {
    if(typeof this.editBlogId == "boolean" && !this.editBlogId) this.onPostBlogImage();
    else if(typeof this.editBlogId != "boolean") {
      this.blogDataObj["blogId"] = this.editBlogId;
      if(this.formData.getAll("blogImg").length > 0) this.onPostBlogImage();
      else this.onUpdateBlog();
    }
  }

  async onPostBlogImage() {
    if (this.isValidatedForm()) {
      (await this.apiService.postBlogImage(this.formData, this.blogDataObj)).subscribe((res: any) => {
        if (!res?.error) {
          this.alertService.success(`Blog ${this.blogDataObj["blogId"]?'Added':'Updated'} Successfully!`);
          this.router.navigate(["list", "blogs"]);
        } else this.alertService.error(res.msg);
      });
    }
  }

  onUpdateBlog() {
    if(this.isValidatedForm(true)) {
      this.apiService.updateBlogWithoutImg(this.blogDataObj).subscribe((res:any) => {
        if(!res.error) {
          this.alertService.success(res.msg);
          setTimeout(() => this.router.navigate(["/home"]), 1500);
        } else this.alertService.error(res.msg);
      });
    }
  }

  isValidatedForm(isOnlyForDetails=false): boolean {
    this.errorFlags = [0, 0, 0, 0, 0];

    if (this.blogDataObj.blogTitle == "") this.errorFlags[0] = 1;
    if (this.blogDataObj.blogSubHead == "") this.errorFlags[1] = 1;
    if (this.blogDataObj.category == "") this.errorFlags[2] = 1;
    if (!isOnlyForDetails && this.formData.getAll("blogImg").length == 0) this.errorFlags[3] = 1;
    if (this.blogDataObj.blogBody == "") this.errorFlags[4] = 1;

    return !this.errorFlags.includes(1);
  }

  getAllCategories() {
    this.apiService.getAllCats().subscribe((res: any) => {
      if (!res?.error) {
        this.categoryArr = res?.result;
      }
    });
  }

}
