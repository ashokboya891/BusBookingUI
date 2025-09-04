import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-pager',
  templateUrl: './pager.component.html',
  styleUrls: ['./pager.component.scss']
})
export class PagerComponent implements OnInit {
 @Input() totalCount?: number;
  @Input() pageSize?: number;
  @Input() pageNumber?: number;

  @Output() pageChanged = new EventEmitter<number>();

  ngOnInit(): void {
    console.log("Pager initialized", this.totalCount, this.pageSize, this.pageNumber);
  }

  onPagerChanged(event: any) {
    console.log('Page changed to:', event.page);
    this.pageChanged.emit(event.page); // ✅ emit just the page number
  }

}
