import { ApiOperationOptions } from '@nestjs/swagger';

export const MemberControllerCreate: ApiOperationOptions = {
  summary: 'Creation membre',
  description: 'Cree une fiche membre et genere un code activation si absent.',
};

export const MemberControllerDelete: ApiOperationOptions = {
  summary: 'Suppression membre',
  description: 'Supprime une fiche membre.',
};

export const MemberControllerDetail: ApiOperationOptions = {
  summary: 'Detail membre',
  description: 'Retourne une fiche membre par identifiant.',
};

export const MemberControllerList: ApiOperationOptions = {
  summary: 'Liste membres',
  description: 'Retourne tous les membres.',
};

export const MemberControllerUpdate: ApiOperationOptions = {
  summary: 'Modification membre',
  description: 'Met a jour une fiche membre et ses relations.',
};

export const MemberPlanControllerCreate: ApiOperationOptions = {
  summary: 'Creation plan abonnement',
  description: 'Cree un plan abonnement ou une carte.',
};

export const MemberPlanControllerDelete: ApiOperationOptions = {
  summary: 'Suppression plan abonnement',
  description: 'Supprime un plan abonnement.',
};

export const MemberPlanControllerDetail: ApiOperationOptions = {
  summary: 'Detail plan abonnement',
  description: 'Retourne un plan abonnement par identifiant.',
};

export const MemberPlanControllerList: ApiOperationOptions = {
  summary: 'Liste plans abonnement',
  description: 'Retourne tous les plans abonnement.',
};

export const MemberPlanControllerUpdate: ApiOperationOptions = {
  summary: 'Modification plan abonnement',
  description: 'Met a jour un plan abonnement.',
};
