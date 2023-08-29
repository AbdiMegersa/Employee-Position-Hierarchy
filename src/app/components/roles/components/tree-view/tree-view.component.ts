import { Component, Input, Output, EventEmitter } from '@angular/core';
import { RoleTreeNode } from '../../../../models/Role'
import { TreeNode } from 'primeng/api';
import { actionTypes } from '../../roles.component';


@Component({
  selector: 'app-tree-view',
  templateUrl: './tree-view.component.html',
  styleUrls: ['./tree-view.component.css']
})
export class TreeViewComponent {

  @Input() treeData!: Array<TreeNode> | null;
  @Output() onMenu = new EventEmitter<any>();

  constructor() {}

  modal(type:any, data:any) {
    console.log('emmit data '+ type)
    this.onMenu.emit({type, data})
  }
}
