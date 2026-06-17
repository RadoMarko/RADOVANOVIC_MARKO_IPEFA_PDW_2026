import { ApiOperationOptions } from '@nestjs/swagger';

export const SecurityControllerSignIn: ApiOperationOptions = {
  summary: 'Connexion utilisateur',
  description:
    'Verifie les identifiants utilisateur et retourne un token JWT ainsi qu un refresh token.',
};

export const SecurityControllerAdminSignIn: ApiOperationOptions = {
  summary: 'Connexion administrateur',
  description:
    'Verifie les identifiants administrateur et retourne les tokens de session.',
};

export const SecurityControllerSignUp: ApiOperationOptions = {
  summary: 'Inscription utilisateur',
  description:
    'Cree un compte utilisateur puis retourne directement les tokens de session.',
};

export const SecurityControllerRefresh: ApiOperationOptions = {
  summary: 'Refresh token',
  description:
    'Genere une nouvelle paire de tokens a partir du refresh token valide.',
};

export const SecurityControllerMe: ApiOperationOptions = {
  summary: 'Utilisateur connecte',
  description:
    'Retourne les informations du compte identifie par le Bearer token.',
};

export const SecurityControllerDelete: ApiOperationOptions = {
  summary: 'Suppression utilisateur',
  description: 'Supprime un compte utilisateur et sa session associee.',
};
