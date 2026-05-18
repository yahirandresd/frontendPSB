import { TestBed } from '@angular/core/testing';

import { PlaguicidaService } from './plaguicida.service';

describe('PlaguicidaService', () => {
    let service: PlaguicidaService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(PlaguicidaService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
