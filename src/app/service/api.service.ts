import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  //----------------------localstorage service------------------------//
  addUser(data:any) {
    window.localStorage.setItem("currentUser", JSON.stringify(data));
  }

  async getUser() {
    let dataObj = await JSON.parse(window.localStorage.getItem("currentUser") || '{}');
    if(typeof dataObj == "string") dataObj = {};
    
    return dataObj;
  }

  async getUserItem(key:string) {
    const userObj = await this.getUser();
    return userObj[key];
  }

  updateUserItem(data:string) {
    window.localStorage.setItem("currentUser", data);
  }

  removeUser() {
    window.localStorage.setItem("currentUser", JSON.stringify("{}"));
    return true;
  }

  async saveBookmark(data:any):Promise<boolean> {
    if(await this.isBlogBookmarked(data["blog_id"])){
      await this.deleteBookmark(data["blog_id"]);
      return false;
    } else {
      const availableData = await this.getBookmark();
      availableData.push(data);
      window.localStorage.setItem("bookmark", JSON.stringify(availableData));
      return true;
    }
  }

  async getBookmark():Promise<any[]> {
    return JSON.parse(window.localStorage.getItem("bookmark") || "[]");
  }

  async deleteBookmark(id:any):Promise<any[]> {
    const bookmarks = await this.getBookmark();
    const filteredBookmark = bookmarks.filter((item:any) => item["blog_id"] != id);
    window.localStorage.setItem("bookmark", JSON.stringify(filteredBookmark));
    return await this.getBookmark();
  }

  async isBlogBookmarked(id:any):Promise<boolean> {
    const bookmarks = await this.getBookmark();
    return bookmarks.filter((item:any) => item["blog_id"] == id).length > 0;
  }
  //---------------------------------------------------------------//

  userRegister(body:any) {
    return this.http.post(`${environment.apiUrl}user/register`, body);
  }

  userLogin(body:any) {
    return this.http.post(`${environment.apiUrl}user/login`, body);
  }

  userDetailUpdate(body:any) {
    return this.http.patch(`${environment.apiUrl}user/editUser`, body);
  } 

  userPasswordUpdate(body:any) {
    return this.http.post(`${environment.apiUrl}user/editUserPass`, body);
  }

  //---------------------------------------------------------------//  

  async postBlogImage(formData:any, blogData:any) {
    blogData["userId"] = await this.getUserItem("user_id");
    if(!formData.has("userData")) formData.append("userData", JSON.stringify(blogData));
   
    return this.http.post(`${environment.apiUrl}blog/uploadBlog`, formData);
  }

  updateBlogWithoutImg(body:any) {
    return this.http.post(`${environment.apiUrl}blog/updateBlogDetails`, body);
  }

  getAllCats() {
    return this.http.get(`${environment.apiUrl}blog/getAllCats`);
  }

  async getAllUserBlogs() {
    const userId = await this.getUserItem("user_id");
    return this.http.get(`${environment.apiUrl}blog/getAllUserBlogs?userId=${userId}`);
  }

  getAllBlogs() {
    return this.http.get(`${environment.apiUrl}blog/getAllBlogs`);
  }

  getCategoryBlogs(id:any) {
    return this.http.get(`${environment.apiUrl}blog/getCategoryBlogs?catId=${id}`);
  }

  getSingleBlog(blogId:any) {
    return this.http.get(`${environment.apiUrl}blog/getSingleBlog?blogId=${blogId}`);
  }

  blogVisibilityToggle(body:any) {
    return this.http.patch(`${environment.apiUrl}blog/disableToggleBlog`, body);
  }

  deleteBlog(id:any) {
    return this.http.delete(`${environment.apiUrl}blog/delSingleBlog?blogId=${id}`);
  }
}
