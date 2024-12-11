# Serverless Framework Node HTTP API on AWS

Este repositorio implementa el consumo de dos apis públicas (del mismo servicio) para una demostración de funciones Lambda de AWS.

### Especificaciones / consideraciones

1. Se implementaron 3 endpoints:

```GET - https://xxxxxxxxxx.execute-api.us-east-1.amazonaws.com/dev/fusionados/{id}```
* Unfica los resultados de dos endpoints externos Personajes e información del planeta.
* Requiere del *id* personaje (valor entero a partir del 1)
* Requiere del token generado por el tercer endpoint implementado (login) como información del header de Authorization (Bearer token).

```GET - https://xxxxxxxxxx.execute-api.us-east-1.amazonaws.com/dev/historial```
* Lista los personajes grabados en el endpoint anterior (fusionados)
* Requiere del token generado por el tercer endpoint implementado (login) como información del header de Authorization (Bearer token).
  
```POST - https://xxxxxxxxxx.execute-api.us-east-1.amazonaws.com/dev/login```
* Permite generar el token de autorización.
* Se requiere que el body de la petición se propocione (en formato json) únicamente el dato "email" con un valor correcto.
* El procedimiento de esta petición es simple con el objetivo de implementar el uso protección de rutas bajo JWT.


2. Algunas características técnicas y/o servicios utilizados

* Serverless Framework versión 4.4.14
* DynamoDB, se generan dos tablas: PeopleTable-_stage_ y PlanetTable-_stage_.
* JsonWebToken (JWT), para la protección de rutas.
* aws-embedded-metrics, como componente para las características de Logging con AWS CloudWatch y métricas. Su implementación se encuentra cuando hay errores en la validación de tokens de autorización.
* Algunas características del patrón adaptador como wraper de algunos componentes utilizados (plugins para fetch y jwt).
* Interfaces para el tipado estricto de los resultados que se reciben en el llamado a los endpoints externos.
* Se adjunta el archivo `swagger-documentacion.yaml` con la documentación para `Swagger`.

## Uso

### Deployment

Para desplegar esta solución se necesita ejecutar el siguiente comando:

```
serverless deploy
```

Después de ejecutar el deploy, se obtendrá una salida similar a lo siguiente:

```
Deploying "challenge-jaac" to stage "dev" (us-east-1)

✔ Service deployed to stack challenge-jaac-dev (31s)

endpoints:
  GET - https:/xxxxxxxxxx.execute-api.us-east-1.amazonaws.com/yyy/fusionados/{id}
  GET - https:/xxxxxxxxxx.execute-api.us-east-1.amazonaws.com/yyy/historial
  POST - https:/xxxxxxxxxx.execute-api.us-east-1.amazonaws.com/yyy-stage/login
  (donde yyy representa al stage)
functions:
  fusionados: challenge-jaac-dev-fusionados (388 kB)
  historial: challenge-jaac-dev-historial (388 kB)
  login: challenge-jaac-dev-login (388 kB)

```


_Note_: In current form, after deployment, your API is public and can be invoked by anyone. For production deployments, you might want to configure an authorizer. For details on how to do that, refer to [HTTP API (API Gateway V2) event docs](https://www.serverless.com/framework/docs/providers/aws/events/http-api).

### Invocation

After successful deployment, you can call the created application via HTTP:

```
curl https://xxxxxxx.execute-api.us-east-1.amazonaws.com/
```

Which should result in response similar to:

```json
{ "message": "Go Serverless v4! Your function executed successfully!" }
```

### Local development

The easiest way to develop and test your function is to use the `dev` command:

```
serverless dev
```

This will start a local emulator of AWS Lambda and tunnel your requests to and from AWS Lambda, allowing you to interact with your function as if it were running in the cloud.

Now you can invoke the function as before, but this time the function will be executed locally. Now you can develop your function locally, invoke it, and see the results immediately without having to re-deploy.

When you are done developing, don't forget to run `serverless deploy` to deploy the function to the cloud.
