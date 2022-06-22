import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './components/main.component';
import { UserDetailsComponent } from './components/user-details.component';

const routes: Routes = [
  {
    path: '', component: MainComponent
  },
  {
    path:'user/:id', component: UserDetailsComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
