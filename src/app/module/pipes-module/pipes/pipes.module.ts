import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MimeTypeIconPipe } from 'src/app/pipes/file-type.pipe';



@NgModule({
	declarations: [MimeTypeIconPipe],
	imports: [
		CommonModule,

	],
	exports: [MimeTypeIconPipe]
})
export class PipesModule { }
