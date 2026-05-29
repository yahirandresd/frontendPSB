import { inject } from '@angular/core';
import { CanDeactivateFn } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { HasUnsavedChanges } from '../interfaces/has-unsaved-changes.interface';

export const unsavedChangesGuard: CanDeactivateFn<HasUnsavedChanges> = async (component) => {
  if (typeof component.hasUnsavedChanges !== 'function') return true;
  if (!component.hasUnsavedChanges()) return true;

  const confirmationService = inject(ConfirmationService);

  return new Promise<boolean>((resolve) => {
    confirmationService.confirm({
      message: 'Tiene cambios sin guardar. ¿Está seguro de que desea salir?',
      header: 'Cambios sin guardar',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Salir',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-secondary',
      accept: () => resolve(true),
      reject: () => resolve(false),
    });
  });
};
