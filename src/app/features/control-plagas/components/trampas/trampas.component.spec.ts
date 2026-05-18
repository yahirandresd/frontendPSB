import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrampasComponent } from './trampas.component';

describe('Trampas', () => {
    let component: TrampasComponent;
    let fixture: ComponentFixture<TrampasComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TrampasComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(TrampasComponent);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
