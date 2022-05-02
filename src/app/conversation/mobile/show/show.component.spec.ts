import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MobileShowComponent } from './show.component';

describe('ShowComponent', () => {
  let component: MobileShowComponent;
  let fixture: ComponentFixture<MobileShowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MobileShowComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MobileShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
