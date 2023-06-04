import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './component/header/header.component';
import { FooterComponent } from './component/footer/footer.component';
import { HomeComponent } from './page/home/home.component';
import { LoginComponent } from './page/login/login.component';
import { EditorComponent } from './page/editor/editor.component';
import { StorypageComponent } from './page/storypage/storypage.component';
import { SharedComponent } from './shared/shared.component';
import { PageNotFoundComponent } from './page/page-not-found/page-not-found.component';
import { ProfileComponent } from './page/profile/profile.component';
import { BlogListComponent } from './page/blog-list/blog-list.component';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    LoginComponent,
    EditorComponent,
    StorypageComponent,
    SharedComponent,
    PageNotFoundComponent,
    BlogListComponent,
    ProfileComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    CKEditorModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
