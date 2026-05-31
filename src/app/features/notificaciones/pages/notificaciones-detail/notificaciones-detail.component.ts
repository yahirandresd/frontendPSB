import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { CardModule } from 'primeng/card';
import { TooltipModule } from 'primeng/tooltip';
import { firstValueFrom } from 'rxjs';
import { NotificacionService } from '../../services/notificacion.service';
import { Notificacion } from '../../models/notificacion.interface';

@Component({
    selector: 'app-notificaciones-detail',
    standalone: true,
    imports: [CommonModule, RouterModule, ButtonModule, TagModule, CardModule, TooltipModule],
    template: `
        <div class="card">
            <div class="flex items-center justify-between mb-6">
                <button pButton type="button" icon="pi pi-arrow-left" label="Volver"
                    class="p-button-text" (click)="router.navigate(['/notificaciones'])"></button>
            </div>

            @if (cargando()) {
                <div class="flex items-center justify-center py-8">
                    <i class="pi pi-spin pi-spinner text-3xl text-muted-color"></i>
                </div>
            } @else if (!notificacion()) {
                <div class="flex flex-col items-center py-8 text-muted-color">
                    <i class="pi pi-exclamation-circle text-4xl mb-3 opacity-50"></i>
                    <p>Notificación no encontrada</p>
                </div>
            } @else {
                @let n = notificacion()!;

                <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div class="lg:col-span-2">
                        <div class="flex items-center gap-3 mb-4">
                            <p-tag [value]="n.tipo"
                                [severity]="n.tipo === 'alerta' ? 'danger' : n.tipo === 'vencimiento' ? 'warn' : 'info'"
                                [rounded]="true" />
                            @if (!n.leida) {
                                <span class="bg-primary text-primary-contrast text-xs font-semibold px-2 py-1 rounded-full">
                                    Nueva
                                </span>
                            }
                            <span class="text-sm text-muted-color ml-auto">
                                {{ formatearFecha(n.fechaEnvio) }}
                            </span>
                        </div>

                        <h2 class="text-surface-900 dark:text-surface-0 font-semibold text-2xl mb-4">
                            {{ n.titulo }}
                        </h2>

                        <div class="bg-surface-50 dark:bg-surface-900 rounded-lg p-5 mb-6">
                            <p class="text-surface-700 dark:text-surface-200 leading-relaxed whitespace-pre-line">
                                {{ n.mensaje }}
                            </p>
                        </div>

                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                            <div>
                                <span class="block text-xs text-muted-color font-medium uppercase tracking-wider mb-1">Estado</span>
                                <p-tag [value]="n.estado"
                                    [severity]="n.estado === 'pendiente' ? 'warn' : 'success'"
                                    [rounded]="true" />
                            </div>
                            <div>
                                <span class="block text-xs text-muted-color font-medium uppercase tracking-wider mb-1">Leída</span>
                                <span [class]="n.leida ? 'text-green-600' : 'text-orange-600'">
                                    {{ n.leida ? 'Sí' : 'No' }}
                                </span>
                            </div>
                            @if (n.fechaLimite) {
                                <div>
                                    <span class="block text-xs text-muted-color font-medium uppercase tracking-wider mb-1">Fecha límite</span>
                                    <span>{{ n.fechaLimite | date:'dd/MM/yyyy' }}</span>
                                </div>
                            }
                            @if (n.remitenteId) {
                                <div>
                                    <span class="block text-xs text-muted-color font-medium uppercase tracking-wider mb-1">Remitente</span>
                                    <span>{{ n.remitenteId }}</span>
                                </div>
                            }
                            @if (n.programaId) {
                                <div>
                                    <span class="block text-xs text-muted-color font-medium uppercase tracking-wider mb-1">Programa relacionado</span>
                                    <span class="text-primary font-mono text-sm">{{ n.programaId }}</span>
                                </div>
                            }
                            @if (n.registroId) {
                                <div>
                                    <span class="block text-xs text-muted-color font-medium uppercase tracking-wider mb-1">Registro relacionado</span>
                                    <span class="text-primary font-mono text-sm">{{ n.registroId }}</span>
                                </div>
                            }
                        </div>
                    </div>

                    <div class="lg:col-span-1">
                        <div class="flex flex-col gap-3">
                            @if (!n.leida) {
                                <button pButton type="button" icon="pi pi-check" label="Marcar como leída"
                                    class="p-button-sm w-full" (click)="marcarLeida(n.id)"
                                    [loading]="marcando()"></button>
                            }
                            <button pButton type="button" icon="pi pi-trash" label="Eliminar"
                                class="p-button-sm p-button-danger w-full" (click)="eliminar(n.id)"
                                [loading]="eliminando()"></button>
                        </div>
                    </div>
                </div>
            }
        </div>
    `
})
export class NotificacionesDetailComponent implements OnInit {
    private route = inject(ActivatedRoute);
    private notificacionService = inject(NotificacionService);
    router = inject(Router);

    notificacion = signal<Notificacion | undefined>(undefined);
    cargando = signal(false);
    marcando = signal(false);
    eliminando = signal(false);

    async ngOnInit() {
        const id = this.route.snapshot.paramMap.get('id');
        if (!id) return;
        await this.cargar(id);
    }

    async cargar(id: string) {
        this.cargando.set(true);
        try {
            const n = await firstValueFrom(this.notificacionService.getById(id));
            this.notificacion.set(n);
        } catch {
            this.notificacion.set(undefined);
        } finally {
            this.cargando.set(false);
        }
    }

    async marcarLeida(id: string) {
        this.marcando.set(true);
        try {
            const actualizada = await firstValueFrom(this.notificacionService.marcarLeida(id));
            this.notificacion.set(actualizada);
        } catch { }
        finally { this.marcando.set(false); }
    }

    async eliminar(id: string) {
        this.eliminando.set(true);
        try {
            await firstValueFrom(this.notificacionService.remove(id));
            this.router.navigate(['/notificaciones']);
        } catch { }
        finally { this.eliminando.set(false); }
    }

    formatearFecha(fecha: string): string {
        return new Date(fecha).toLocaleDateString('es-CO', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
}
