import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MycallsComponent } from './mycalls.component';

describe('MycallsComponent', () => {
  let component: MycallsComponent;
  let fixture: ComponentFixture<MycallsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MycallsComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MycallsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
