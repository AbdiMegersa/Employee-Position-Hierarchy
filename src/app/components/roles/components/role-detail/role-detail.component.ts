import { Component, OnInit } from '@angular/core'
import { RoleService } from '../../../../services/role.service'
import { ActivatedRoute, ParamMap } from '@angular/router'
import { ofAction } from '@ngxs/store';
import { RoleDetail, RoleUrl } from 'src/app/models/Role';
import { of } from 'rxjs'
import { catchError } from 'rxjs/operators'
import { NzTableFilterFn, NzTableFilterList, NzTableSortFn, NzTableSortOrder } from 'ng-zorro-antd/table';

import {
    NzSkeletonAvatarShape,
    NzSkeletonAvatarSize,
    NzSkeletonButtonShape,
    NzSkeletonButtonSize,
    NzSkeletonInputSize
} from 'ng-zorro-antd/skeleton';

interface DataItem {
    birthDate: string;
    email: string;
    fullName: string;
    gender: string;
    hireDate: string;
    id: string;
    phone: string;
  }

  interface ColumnItem {
    name: string;
    sortOrder: NzTableSortOrder | null;
    sortFn: NzTableSortFn<DataItem> | null;
    listOfFilter: NzTableFilterList;
    filterFn: NzTableFilterFn<DataItem> | null;
    filterMultiple: boolean;
    sortDirections: NzTableSortOrder[];
  }

@Component({
    selector: 'app-role-detail',
    templateUrl: './role-detail.component.html',
})

export class RoleDetailComponent implements OnInit {

    // setting up the skeleton
    avatarSize: NzSkeletonAvatarSize = 'default';
    avatarShape: NzSkeletonAvatarShape = 'circle';
    inputSize: NzSkeletonInputSize = 'default';


    // setup for table of assignemd employee
    pageIndex = 1;
    pageSize = 10;
    listOfColumns: ColumnItem[] = [
  
      {
        name: 'Name',
        sortOrder: 'ascend',
        sortFn: (a: DataItem, b: DataItem) => a.fullName.localeCompare(b.fullName),
        sortDirections: ['ascend', 'descend', null],
        filterMultiple: false,
        listOfFilter: [],
        filterFn: null
      },
      {
        name: 'Email',
        sortOrder: null,
        sortFn: null,
        sortDirections: [null],
        filterMultiple: false,
        listOfFilter: [],
        filterFn: null
      },
      {
        name: 'Gender',
        sortOrder: null,
        sortFn: null,
        sortDirections: [null],
        filterMultiple: false,
        listOfFilter: [],
        filterFn: null
      }
    ];

    constructor(private roleService: RoleService, private route: ActivatedRoute) {
    }

    id: string = ''
    role!: RoleUrl;
    employees!: Array<any>;
    NOT_FOUND_FLAG: boolean = false;
    loading: boolean = true;



    ngOnInit() {
        console.log('Initialized coponent detail')
        this.route.params.subscribe(params => {
            this.id = this.route.snapshot.paramMap.get('id') || ""
            console.log(this.id)
            this.loading = true;
            if (this.id !== '') {
                console.log('started Fetching data');
                this.roleService.fetchSingleRole(this.id).pipe(
                    catchError(Err => {
                        return of(null);
                    })
                ).subscribe(res => {
                    console.info('found data');
                    if (res) {
                        this.role = res;
                        this.employees = res.employees;
                        console.log(this.role);
                        console.log(this.employees)
                    } else {
                        this.NOT_FOUND_FLAG = true;
                    }
                    this.loading = false; // Move this line inside the subscribe block
                });
            }
        });
    }

    onPageIndexChange(pageIndex: number): void {
        this.pageIndex = pageIndex;
      }
    

}