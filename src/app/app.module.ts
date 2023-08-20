import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { en_US } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IconsProviderModule } from './icons-provider.module';
import { NgZorroAntModule} from './ng-zorro-ant.module'

// Prime Ng imports
import { OrganizationChartModule } from 'primeng/organizationchart';
import { LayoutComponent } from './components/layout/layout.component';
import { RolesComponent } from './components/roles/roles.component';
import { EmployeesComponent } from './components/employees/employees.component';
import { ViewModalComponent } from './components/roles/components/view-modal/view-modal.component';
import { DeleteModalComponent } from './components/roles/components/delete-modal/delete-modal.component';
import { EditModalComponent } from './components/roles/components/edit-modal/edit-modal.component';
import { AddEmployeeModalComponent } from './components/roles/components/add-employee-modal/add-employee-modal.component'
import { AddRoleModalComponent } from './components/roles/components/add-role-modal/add-role-modal.component'

import { NgxsModule } from '@ngxs/store';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { RoleState } from './state/role.state';
import { NotFoundComponent } from './components/not-found/not-found.component'
import { RoleDetailComponent } from './components/roles/components/role-detail/role-detail.component';
// import { NgxMaskModule } from 'ngx-mask';

registerLocaleData(en);

@NgModule({
  declarations: [
    AppComponent,
    LayoutComponent,
    RolesComponent,
    EmployeesComponent,
    ViewModalComponent,
    DeleteModalComponent,
    EditModalComponent,
    RoleDetailComponent,
    NotFoundComponent,
    AddEmployeeModalComponent,
    AddRoleModalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    IconsProviderModule,
    NgZorroAntModule,
    OrganizationChartModule,
    NgxsModule.forRoot([
      RoleState
    ]),
    NgxsReduxDevtoolsPluginModule.forRoot(),
    // NgxMaskModule.forRoot()
  ],
  providers: [
    { provide: NZ_I18N, useValue: en_US }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
