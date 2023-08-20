import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

@Component({
  selector: 'app-view-modal',
  templateUrl: './view-modal.component.html',
})
export class ViewModalComponent implements OnInit{

  @Input() viewDetail!: any; 
  @Output() onCancelView = new EventEmitter();

  constructor(){
    console.log(this.viewDetail)
  }
  
  ngOnInit(): void {
      console.log(this.viewDetail)
  }

  cancelView() {
    this.onCancelView.emit();
  }

}
