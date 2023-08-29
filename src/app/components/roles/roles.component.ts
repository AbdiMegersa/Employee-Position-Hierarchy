import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { TreeNode } from 'primeng/api';
import { FormGroup } from '@angular/forms';
import { data } from './data'
import { Store } from '@ngxs/store'
import { of} from 'rxjs'
import { RoleTreeNode, RoleDetail, RoleTreeNodeData } from '../../models/Role'
import { RoleService } from '../../services/role.service'
import { catchError } from 'rxjs/operators'
import { FetchAll, FetchEmployees, FetchFlatRoles } from '../../state/role.actions'
import { FlatRole, RoleUrl } from '../../models/Role'
import { NzMessageService } from 'ng-zorro-antd/message';


interface ModalDetail {
  selected: RoleDetail | RoleUrl | null;
  loading: boolean;
  visible: boolean;
  data: any;
  flatData?: FlatRole;
  children?: Array<RoleTreeNode> | null;
  potentialParents?: Array<any>;
  isHead?: boolean;
  processing?: boolean;
}

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.css']
})


export class RolesComponent implements OnInit {

  roleEditForm!: FormGroup;
  mockData = data;
  flatRoles!: Array<FlatRole>;
  scaleClass: number = 0.8;


  isOkLoading: boolean = false;
  isRoleFormVisible: boolean = false;
  isEmployeeFormVisible: boolean = false;
  selectedNodes: TreeNode[] = [];
  rolesError: string = "";

  isRoleEditLoading: boolean = false
  isAddEmployeeLoading: boolean = false;
  isEditLoading: boolean = false;

  roleView: "ORGCHART" | "TREE" = "ORGCHART"

  addRoleDetail: ModalDetail = {
    selected: null,
    loading: false,
    visible: false,
    data: null
  }

  addEmployeeDetail: ModalDetail = {
    selected: null,
    loading: false,
    visible: false,
    data: null
  }

  viewDetail: ModalDetail = {
    selected: null,
    loading: false,
    visible: false,
    data: null
  }

  editDetail: ModalDetail = {
    selected: null,
    loading: false,
    visible: false,
    data: null
  }

  deleteDetail: ModalDetail = {
    selected: null,
    loading: false,
    visible: false,
    data: null,
    isHead: false
  }

  // the data for the organization chart!
  data!: TreeNode[];
  chartDetail!: {
    data: TreeNode[] | null;
    loading: boolean;
    error: string;
  } 
  constructor(
    private store: Store,
    private roleService: RoleService,
    private message: NzMessageService,
    private cdr: ChangeDetectorRef
  ){}


  ngOnInit(): void {
    this.chartDetail = {
      data: null,
      loading: true,
      error: ''
    }
    this.roleView = "ORGCHART"

    this.store.select(state => state.role).subscribe(data => {
      console.log('HERE IT IS: ', data.roles)
      this.chartDetail.loading = data.loading;
      this.flatRoles = data.flatRoles;
      this.rolesError = data.rolesError;
      if (!this.chartDetail.loading && !this.chartDetail.error) {
        this.chartDetail.data = null
        this.chartDetail.data = data.roles
      } else if (data.error) {
        this.chartDetail.error = data.rolesError
      }
    })
  }

  // zoomin
  scaleUp() {
    this.scaleClass = Math.round((this.scaleClass + 0.05) * 100) / 100
    console.log(this.scaleClass)
  }

  //zoomout
  scaleDown() {
    if (this.scaleClass > 0.48) {
      this.scaleClass = Math.round((this.scaleClass - 0.05) * 100) / 100
    }
    console.log(this.scaleClass)
  }

  // reload nested roles
  refetchRoles() {
    this.store.dispatch(new FetchAll())
  }

  //toggle role view
  toggleRoleView() {
    this.roleView = this.roleView === "ORGCHART" ? "TREE" : "ORGCHART"
  }


  // display modal to add new role
  showRoleAddModal() {
    this.addRoleDetail.visible = true;
    this.isRoleFormVisible = true;
  }

  // hide role add modal
  handleRoleCancel() {
    this.addRoleDetail = {
      visible: false,
      loading: false,
      selected: null,
      data: null
    }
  }

  // display add new employee modal
  showEmployeeModal() {
    this.roleService.fetchFlatRoles().subscribe(res => {
      this.addEmployeeDetail.data = res
    })
    this.addEmployeeDetail.visible = true;
  }

  // hide add new employee modal
  handleEmployeeCancel() {
    this.addEmployeeDetail = {
      visible: false,
      loading: false,
      selected: null,
      data: null
    }
  }

  // handle different types of display modal request
  displayModal(info : {type: string, data: any}) {
    // VIEW_DATA EDIT_DATA DELETE_DATA
    

    switch (info.type) {
      case actionTypes.edit: {
        this.showRoleEdit(info.data);
        break;
      }
      case actionTypes.delete: {
        this.showRoleDelete(info.data);
        break;
      }
      case actionTypes.view: {
        this.showRoleView(info.data);
        break;
      }
      default: {
        console.log('INVALID MODAL DISPLAY REQUESTED :' + info.type);
      }
    }
  }

  // display edit role modal
  showRoleEdit(node: RoleTreeNodeData) {

    this.editDetail = {
      ...this.editDetail,
      loading: true,
      visible: true,
      data: node
    }

    this.roleService.fetchRolesExceptDescendant(node.id).subscribe(ppRoles => {
      console.log('started Fetchinf potential parents')
      this.editDetail.potentialParents = ppRoles.filter(role => role.id !== node.id)
      console.info('Finished fetching potential parents', ppRoles)
    })
    this.editDetail.loading = false;
  }

  // hide edit role modal
  handleRoleEditCancel() {
    this.editDetail = {
      ...this.editDetail,
      selected: null,
      loading: false,
      visible: false,
      data: null,
      processing: false,
    }
    this.editDetail.processing = false;
    this.isRoleEditLoading = false;
  }

  
  showRoleDelete(node: RoleTreeNodeData) {

    this.deleteDetail = {
      ...this.deleteDetail,
      visible: true,
      data: node,
      loading: true,
      // children: node.children
    }
    console.log(this.deleteDetail)

  }

  
  handleRoleDeleteCancel() {
    this.deleteDetail = {
      visible: false,
      loading: false,
      selected: null,
      data: null,
      isHead: false
    }
  }

  showRoleView(node: RoleTreeNode) {
    // fech thd data from 
    console.log('displaying role ',node)
    this.viewDetail.data = node;
    this.viewDetail.visible = true;

  }
  handleRoleViewCancel() {
    this.viewDetail = {
      selected: null,
      loading: false,
      visible: false,
      data: null
    }
  }
  handleRoleViewOk() {
    this.handleRoleViewCancel();
  }

}

export const actionTypes = {
  edit: "EDIT_DATA",
  delete: "DELETE_DATA",
  view: "VIEW_DATA"
}