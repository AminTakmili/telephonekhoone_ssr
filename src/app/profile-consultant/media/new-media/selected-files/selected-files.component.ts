import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
	selector: 'app-selected-files',
	templateUrl: './selected-files.component.html',
	styleUrls: ['./selected-files.component.scss'],
})
export class SelectedFilesComponent implements OnInit {
	@Input() selectedFiles;
	@Output() removeFileEmitter = new EventEmitter<string>();
	constructor() { }

	ngOnInit() { }

}
