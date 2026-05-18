import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HallazgosComponent } from './hallazgos.component';

describe('Hallazgos', () => {
    let component: HallazgosComponent;
    let fixture: ComponentFixture<HallazgosComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [HallazgosComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(HallazgosComponent);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
