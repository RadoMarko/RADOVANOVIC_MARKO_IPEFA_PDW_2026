import { ApiOperationOptions } from '@nestjs/swagger';

export const StudyControllerCreate: ApiOperationOptions = {
  summary: 'Création étude clinique',
  description:
    'Crée une étude clinique avec son code, ses dates et son statut.',
};

export const StudyControllerDelete: ApiOperationOptions = {
  summary: 'Suppression étude clinique',
  description: 'Supprime une étude clinique par identifiant.',
};

export const StudyControllerDetail: ApiOperationOptions = {
  summary: 'Détail étude clinique',
  description: "Retourne les informations complètes d'une étude clinique.",
};

export const StudyControllerList: ApiOperationOptions = {
  summary: 'Liste études cliniques',
  description: 'Retourne toutes les études cliniques encodées.',
};

export const StudyControllerUpdate: ApiOperationOptions = {
  summary: 'Modification étude clinique',
  description: "Met à jour les informations d'une étude clinique existante.",
};
