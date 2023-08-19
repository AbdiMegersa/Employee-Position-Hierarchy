import { Component } from '@angular/core';
// import { TreeNode } from 'primeng/api';
import { Store } from '@ngxs/store'
import { FetchAll, FetchEmployees, FetchFlatRoles } from './state/role.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  
  constructor(private store: Store) {
    this.store.dispatch([new FetchAll, new FetchEmployees, new FetchFlatRoles])
  }
  
}
