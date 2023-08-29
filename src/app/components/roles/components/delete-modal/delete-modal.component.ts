import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Select, Store } from '@ngxs/store';
import { FlatRole } from 'src/app/models/Role';
import { RoleState } from 'src/app/state/role.state';
import { Observable, catchError, throwError } from 'rxjs'
import { RoleService } from 'src/app/services/role.service';
import { NzMessageService } from 'ng-zorro-antd/message'
import { FetchAll, FetchEmployees, FetchFlatRoles } from 'src/app/state/role.actions';

@Component({
  selector: 'app-delete-modal',
  templateUrl: './delete-modal.component.html',
  styleUrls: ['./delete-modal.component.css']
})

export class DeleteModalComponent implements OnInit {

  @Select(RoleState.getFlatRoles()) flatRoles$!: Observable<FlatRole[]>;

  @Input() deleteDetail!: any;
  @Output() onCancel = new EventEmitter();
  @Output() onOk = new EventEmitter<any>();

  roleForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private roleService: RoleService,
    private message: NzMessageService,
    private store: Store,
  ) {
    this.roleForm = this.fb.group({
      parentId: ["", Validators.required]
    })
  }

  ngOnInit(): void {
    let role: FlatRole | undefined;
    // fetch Role
    this.roleService.fetchSingleRole(this.deleteDetail.data.id).subscribe(
      fullRoleData => {
        this.deleteDetail.children = fullRoleData.children;
        

        this.flatRoles$.subscribe(data => {
          role = data.find(r => r.id === this.deleteDetail.data.id)
        })
        if (role) {
          // this.message.info('found role ' + role.name)
          this.deleteDetail.data = role;
          // if the role is a head role and has  a children do  not delete
          if (role.reportsTo === null && this.deleteDetail.children.length > 0) {
            // this.message.info('This role is head ')
            this.deleteDetail.isHead = true;
          } else {
            // else role can be deleted
            // if role has a children find new parent by parentId
            // this.message.info('this role is not head')
            // this.message.info(this.deleteDetail.children.length + 'this many children')
            if (this.deleteDetail.children.length > 0) {
              // has a children 
              // form for finding new suitable parent by api call except descendants
              // this.message.info('STarted fetching potentialParents')
              this.roleService.fetchRolesExceptDescendant(this.deleteDetail.data.id).subscribe(
                data => {
                  this.deleteDetail.potentialParents = data
                  this.deleteDetail.loading = false;
                  // this.message.info('finisehd fetching potentialParents')
                }
              )
              // Initialize form for choosing new parent of the children
              this.roleForm = this.fb.group({
                parentId: ["", Validators.required]
              })

            }else{
              this.deleteDetail.loading = false;
            }
          }
        }
      }
    )
  }

  cancelDelete() {
    this.onCancel.emit()
  }

  onDelete() {
    this.deleteDetail.processing = true;
    // fech except descendants if role has a children
    console.log('started deleting role ')
    this.roleService.fetchSingleRole(this.deleteDetail.data.id).subscribe(res => {

      if (res.reportsTo) {

        let newParent;
        if (this.roleForm.value.parentId !== "") {
          newParent = this.roleForm.value.parentId
        } else {
          newParent = res.reportsTo.id
        }
        console.log('delete role ' + this.deleteDetail.data.id)
        console.log('delete role parentId ' + newParent)
        console.log(newParent, res.reportsTo.id)

        this.roleService.deleteRole(this.deleteDetail.data.id, newParent).pipe(
          catchError(Err => {
            this.message.error(Err.error.message, { nzDuration: 5500 });
            this.deleteDetail.processing = false;
            return throwError([]);
          })
        ).subscribe(Ok => {
          console.log(res.name + ' deleted');
          this.store.dispatch([new FetchAll(), new FetchEmployees(), new FetchFlatRoles()]);
          this.message.success('Successfully deleted role ' + res.name, { nzDuration: 3000 });
          this.cancelDelete();
        }, error => {
          // Handle the error here if needed
          this.message.info("Role couldn't be deleted")
        })

      }
      else this.message.info('could not be deleted', { nzDuration: 4000 })
    })
  }

}
