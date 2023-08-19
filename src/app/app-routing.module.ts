import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RolesComponent } from './components/roles/roles.component';
import { EmployeesComponent } from './components/employees/employees.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { RoleDetailComponent } from './components/roles/components/role-detail/role-detail.component';

const routes: Routes = [
  {path: '', pathMatch: "full", redirectTo: "roles"},
  {path: 'roles', component: RolesComponent},
  {path: 'employees', component: EmployeesComponent},
  {path: 'roles/:id', component: RoleDetailComponent},
  {path: '**', component: NotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
