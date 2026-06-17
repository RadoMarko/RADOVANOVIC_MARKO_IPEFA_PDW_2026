#!/bin/bash
echo "Installation des dépendances minimums pour le projet sous NestJS"
echo "---------------------------------------------------------------"
npm i lodash @types/lodash
npm i date-fns @types/date-fns
npm i bcrypt @types/bcrypt
npm i --save @nestjs/jwt
npm i --save @nestjs/swagger swagger-ui-express
npm i dotenv
npm i --save ulid
npm i --save @nestjs/typeorm typeorm pg
npm i builder-pattern
npm i --save class-validator class-transformer