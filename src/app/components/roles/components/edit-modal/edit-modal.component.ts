import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { FlatRole } from 'src/app/models/Role';
import { Observable } from 'rxjs'
import { Select } from '@ngxs/store';
import { RoleState } from 'src/app/state/role.state';

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

  constructor(private fb: FormBuilder) {
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
    this.onSave.emit(this.roleForm)
  }


}
