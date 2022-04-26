import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { WebinarPage } from './webinar.page';

describe('WebinarPage', () => {
  let component: WebinarPage;
  let fixture: ComponentFixture<WebinarPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WebinarPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(WebinarPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
