import { Injectable, signal } from '@angular/core';
import { DashboardResponse } from './dashboard.service';

@Injectable({ providedIn: 'root' })
export class DashboardStore {
    readonly data = signal<DashboardResponse | null>(null);
}
