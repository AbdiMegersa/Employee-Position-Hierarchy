import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TreeNode } from 'primeng/api';

@Component({
  selector: 'app-org-chart',
  templateUrl: './org-chart.component.html',
  styleUrls: ['./org-chart.component.css']
})
export class OrgChartComponent {

  @Input() chartData!: Array<TreeNode> | undefined;
  @Output() onMenu = new EventEmitter<any>();
  @Input() scaleClass!: number;
  constructor() {}



  modal(type:any, data:any) {
    console.log('emmit data '+ type)
    this.onMenu.emit({type, data})
  }

}
