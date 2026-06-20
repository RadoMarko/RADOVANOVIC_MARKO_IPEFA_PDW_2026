import { ApiOperationOptions } from '@nestjs/swagger';

export const SecurityControllerSignIn: ApiOperationOptions = {
  summary: 'Connexion utilisateur',
  description:
    "Vérifie les identifiants utilisateur et retourne un token JWT ainsi qu'un refresh token.",
};

export const SecurityControllerAdminSignIn: ApiOperationOptions = {
  summary: 'Connexion administrateur',
  description:
    'Vérifie les identifiants administrateur et retourne les tokens de session.',
};

export const SecurityControllerSignUp: ApiOperationOptions = {
  summary: 'Inscription utilisateur',
  description:
    'Crée un compte utilisateur puis retourne directement les tokens de session.',
};

export const SecurityControllerRefresh: ApiOperationOptions = {
  summary: 'Refresh token',
  description:
    'Génère une nouvelle paire de tokens à partir du refresh token valide.',
};

export const SecurityControllerMe: ApiOperationOptions = {
  summary: 'Utilisateur connecté',
  description:
    'Retourne les informations du compte identifié par le Bearer token.',
};

export const SecurityControllerChangePassword: ApiOperationOptions = {
  summary: 'Modification du mot de passe',
  description:
    "Modifie le mot de passe de l'utilisateur connecté après vérification de l'ancien mot de passe.",
};

export const SecurityControllerDelete: ApiOperationOptions = {
  summary: 'Suppression utilisateur',
  description: 'Supprime un compte utilisateur et sa session associée.',
};
