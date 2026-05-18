import { TestBed } from '@angular/core/testing';

import { Hallazgo } from './hallazgo.service';

describe('Hallazgo', () => {
    let service: Hallazgo;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(Hallazgo);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
