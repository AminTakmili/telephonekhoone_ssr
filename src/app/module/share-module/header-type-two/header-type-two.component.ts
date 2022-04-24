import { Component, OnInit , Input} from '@angular/core';

@Component({
  selector: 'header-type-two',
  templateUrl: './header-type-two.component.html',
  styleUrls: ['./header-type-two.component.scss'],
})
export class HeaderTypeTwoComponent implements OnInit {

  @Input() breadCrumb;
  constructor() { }

  ngOnInit() {}

}
