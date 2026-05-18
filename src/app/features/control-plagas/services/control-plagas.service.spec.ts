import { TestBed } from '@angular/core/testing';

import { ControlPlagasService } from './control-plagas.service';

describe('ControlPlagas', () => {
    let service: ControlPlagasService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ControlPlagasService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
