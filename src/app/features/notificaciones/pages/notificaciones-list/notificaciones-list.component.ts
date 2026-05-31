import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { BadgeModule } from 'primeng/badge';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '@/app/features/auth/services/auth.service';
import { NotificacionService } from '../../services/notificacion.service';
import { Notificacion } from '../../models/notificacion.interface';

@Component({
    selector: 'app-notificaciones-list',
    standalone: true,
    imports: [CommonModule, RouterModule, TableModule, ButtonModule, TagModule, TooltipModule, BadgeModule],
    template: `
        <div class="card">
            <div class="flex items-center justify-between mb-6">
                <div>
                    <h2 class="text-surface-900 dark:text-surface-0 font-semibold text-xl mb-1">Notificaciones</h2>
                    <p class="text-muted-color text-sm">
                        @if (cargando()) {
                            Cargando...
                        } @else {
                            {{ noLeidas() }} sin leer · {{ notificaciones().length }} total
                        }
                    </p>
                </div>
                <button pButton type="button" icon="pi pi-refresh" (click)="cargarNotificaciones()"
                    [loading]="cargando()" class="p-button-rounded p-button-text p-button-plain"
                    pTooltip="Refrescar"></button>
            </div>

            @if (cargando()) {
                <div class="flex items-center justify-center py-8">
                    <i class="pi pi-spin pi-spinner text-3xl text-muted-color"></i>
                </div>
            } @else if (notificaciones().length === 0) {
                <div class="flex flex-col items-center justify-center py-8 text-muted-color">
                    <i class="pi pi-bell text-4xl mb-3 opacity-50"></i>
                    <p>No hay notificaciones</p>
                </div>
            } @else {
                <p-table [value]="notificaciones()" [rows]="20" [paginator]="true"
                    sortField="fechaEnvio" [sortOrder]="-1"
                    [tableStyle]="{ 'min-width': '50rem' }">
                    <ng-template #header>
                        <tr>
                            <th pSortableColumn="leida" style="width:4rem">
                                <i class="pi pi-circle"></i>
                            </th>
                            <th pSortableColumn="tipo" style="width:8rem">Tipo</th>
                            <th pSortableColumn="titulo">Título</th>
                            <th pSortableColumn="mensaje">Mensaje</th>
                            <th pSortableColumn="fechaEnvio" style="width:12rem">Fecha</th>
                            <th pSortableColumn="estado" style="width:8rem">Estado</th>
                            <th style="width:10rem">Acciones</th>
                        </tr>
                    </ng-template>
                    <ng-template #body let-n>
                        <tr [class.opacity-50]="n.leida">
                            <td>
                                @if (!n.leida) {
                                    <i class="pi pi-circle-fill text-primary text-sm"></i>
                                }
                            </td>
                            <td>
                                <p-tag [value]="n.tipo"
                                    [severity]="n.tipo === 'alerta' ? 'danger' : n.tipo === 'vencimiento' ? 'warn' : 'info'"
                                    [rounded]="true" />
                            </td>
                            <td class="font-medium">{{ n.titulo }}</td>
                            <td class="text-muted-color">{{ n.mensaje }}</td>
                            <td>{{ n.fechaEnvio | date:'dd/MM/yyyy h:mm a' }}</td>
                            <td>
                                <p-tag [value]="n.estado"
                                    [severity]="n.estado === 'pendiente' ? 'warn' : 'success'"
                                    [rounded]="true" />
                            </td>
                            <td style="width:10rem">
                                <button pButton type="button" icon="pi pi-eye"
                                    class="p-button-rounded p-button-text p-button-sm"
                                    (click)="verDetalle(n)"
                                    pTooltip="Ver detalle"></button>
                                @if (!n.leida) {
                                    <button pButton type="button" icon="pi pi-check"
                                        class="p-button-rounded p-button-text p-button-sm"
                                        (click)="marcarLeida(n)"
                                        pTooltip="Marcar como leída"></button>
                                }
                                <button pButton type="button" icon="pi pi-trash"
                                    class="p-button-rounded p-button-text p-button-sm p-button-danger"
                                    (click)="eliminar(n)"
                                    pTooltip="Eliminar"></button>
                            </td>
                        </tr>
                    </ng-template>
                </p-table>
            }
        </div>
    `
})
export class NotificacionesListComponent implements OnInit {
    private auth = inject(AuthService);
    private notificacionService = inject(NotificacionService);
    private router = inject(Router);

    notificaciones = signal<Notificacion[]>([]);
    cargando = signal(false);

    noLeidas = computed(() => this.notificaciones().filter(n => !n.leida).length);

    async ngOnInit() {
        await this.cargarNotificaciones();
    }

    async cargarNotificaciones() {
        this.cargando.set(true);
        try {
            const { data } = await this.auth.getSession();
            const userId = data.session?.user?.id;
            if (!userId) return;
            const notis = await firstValueFrom(this.notificacionService.getByUsuario(userId));
            this.notificaciones.set(notis);
        } catch {
            this.notificaciones.set([]);
        } finally {
            this.cargando.set(false);
        }
    }

    verDetalle(n: Notificacion) {
        this.router.navigate(['/notificaciones', n.id]);
    }

    async marcarLeida(n: Notificacion) {
        try {
            await firstValueFrom(this.notificacionService.marcarLeida(n.id));
            this.notificaciones.update(list =>
                list.map(item => item.id === n.id ? { ...item, leida: true } : item)
            );
        } catch { }
    }

    async eliminar(n: Notificacion) {
        try {
            await firstValueFrom(this.notificacionService.remove(n.id));
            this.notificaciones.update(list => list.filter(item => item.id !== n.id));
        } catch { }
    }
}
