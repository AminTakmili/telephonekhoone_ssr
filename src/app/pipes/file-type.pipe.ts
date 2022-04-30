import { Pipe, PipeTransform } from '@angular/core';
import { ThumbnailService } from '../services/thumbnail.service';

@Pipe({
	name: 'fileTypeIcon'
})
export class MimeTypeIconPipe implements PipeTransform {

	constructor(private thumbnailService: ThumbnailService) { }

	transform(text: string): string {
		return this.thumbnailService.getMimeTypeIcon(text);
	}
}