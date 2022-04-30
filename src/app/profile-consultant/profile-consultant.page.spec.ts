import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ProfileConsultantPage } from './profile-consultant.page';

describe('ProfileConsultantPage', () => {
  let component: ProfileConsultantPage;
  let fixture: ComponentFixture<ProfileConsultantPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileConsultantPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileConsultantPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
