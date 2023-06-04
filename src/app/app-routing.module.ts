import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BlogListComponent } from './page/blog-list/blog-list.component';
import { EditorComponent } from './page/editor/editor.component';
import { HomeComponent } from './page/home/home.component';
import { LoginComponent } from './page/login/login.component';
import { PageNotFoundComponent } from './page/page-not-found/page-not-found.component';
import { ProfileComponent } from './page/profile/profile.component';
import { SharedComponent } from './shared/shared.component';
import { StorypageComponent } from './page/storypage/storypage.component';

const routes: Routes = [
  {
    path: "", component: SharedComponent, children: [
      {path: "login", component: LoginComponent},
      {path: "home", component: HomeComponent},
      {path: "blog/:blogid", component: StorypageComponent},
      {path: "profile", component: ProfileComponent},
      {path: "list/:type", component: BlogListComponent},
      {path: "user-edit/:userid", component: EditorComponent},
      {path: "", pathMatch: "full", redirectTo: "login"},
      {path: "**", component: PageNotFoundComponent}
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
