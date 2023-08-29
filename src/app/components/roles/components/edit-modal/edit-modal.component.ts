import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { FlatRole } from 'src/app/models/Role';
import { Observable, of, catchError } from 'rxjs'
import { Select, Store } from '@ngxs/store';
import { RoleState } from 'src/app/state/role.state';
import { RoleService } from 'src/app/services/role.service';
import { FetchAll, FetchEmployees, FetchFlatRoles } from 'src/app/state/role.actions';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-edit-modal',
  templateUrl: './edit-modal.component.html',
  styleUrls: ['./edit-modal.component.css']
})
export class EditModalComponent implements OnInit {

  @Input() editDetail!: any;
  @Output() onCancel = new EventEmitter();
  @Output() onSave = new EventEmitter<any>();

  roleForm!: FormGroup;

  @Select(RoleState.getFlatRoles()) flatRoles$!: Observable<FlatRole[]>;

  constructor(
    private fb: FormBuilder, 
    private roleService: RoleService, 
    private store: Store,
    private message: NzMessageService) {
  }

  ngOnInit(): void {
    console.log('edit view initialized')
    console.log(this.editDetail)
    const roleData = this.editDetail.data;
    let role: FlatRole | undefined;
    this.flatRoles$.subscribe(data => {
      role = data.find(r => r.id === roleData.id)
    })
    if (role) {
      this.roleForm = this.fb.group({
        name: [role.name, Validators.required],
        description: [role.description, Validators.required],
        parentId: [role.reportsTo?.id ?? null]
      })
    }
  }

  cancelEdit() {
    this.onCancel.emit()
  }

  okEdit() {
    if (this.roleForm.valid) {
      this.editDetail.processing = true;
      if (this.editDetail.data) {
        let id = this.editDetail.data.id;
        this.roleService.updateRole(id, this.roleForm.value).pipe(
          catchError((Err) => {
            this.message.error(Err.error.message)
            return of(null)
          })
        ).subscribe(
          res => {
            if (res) {
              this.store.dispatch([new FetchAll(), new FetchEmployees(), new FetchFlatRoles()]);
              this.message.success('Successfully updated role ' + res.name)
              this.cancelEdit();
            } else {
              this.message.error("Role Could not be updated")
            }
          }
        )

      } else {
        // console.log('Some problem in update');
        this.editDetail.processing = false;
      }
    } else {
      this.message.warning('Invalid Form')
    }
  }


}
