import { ApiOperationOptions } from '@nestjs/swagger';

export const AppControllerHelloWorld: ApiOperationOptions = {
  summary: 'Hello world',
  description:
    "Route publique de test permettant de vérifier que l'API répond.",
};
