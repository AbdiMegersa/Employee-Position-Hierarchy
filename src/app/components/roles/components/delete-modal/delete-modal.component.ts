import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Select } from '@ngxs/store';
import { FlatRole } from 'src/app/models/Role';
import { RoleState } from 'src/app/state/role.state';
import { Observable } from 'rxjs'
import { RoleService } from 'src/app/services/role.service';
import { NzMessageService } from 'ng-zorro-antd/message'

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

  constructor(private fb: FormBuilder, private roleService: RoleService,
    private message: NzMessageService
  ) {
    this.roleForm = this.fb.group({
      parentId: ["", Validators.required]
    })
  }

  ngOnInit(): void {
    let role: FlatRole | undefined;
    this.flatRoles$.subscribe(data => {
      role = data.find(r => r.id === this.deleteDetail.data.id)
    })
    if (role) {
      this.message.info('found role ' + role.name)
      this.deleteDetail.data = role;
      // if the role is a head role and has  a children do  not delete
      if (role.reportsTo === null && this.deleteDetail.children.length > 0) {
        this.message.info('This role is head ')
        this.deleteDetail.isHead = true;
      } else {
        // else role can be deleted
        // if role has a children find new parent by parentId
        this.message.info('this role is not head')
        this.message.info(this.deleteDetail.children.length + 'this many children')
        if (this.deleteDetail.children.length > 0) {
          // has a children 
          // form for finding new suitable parent by api call except descendants
          this.message.info('STarted fetching potentialParents')
          this.roleService.fetchRolesExceptDescendant(this.deleteDetail.data.id).subscribe(
            data => {
              this.deleteDetail.potentialParents = data
              this.message.info('finisehd fetching potentialParents')
            }
          )
          // Initialize form for choosing new parent of the children
          this.roleForm = this.fb.group({
            parentId: ["", Validators.required]
          })

        } else {
          // its a leaf role can be deleted without node
        }

      }
    }
  }

  cancelDelete() {
    this.onCancel.emit()
  }

  onDelete() {
    if (this.roleForm.value.parentId)
      this.onOk.emit(this.roleForm)
    else this.onOk.emit()
  }

}
