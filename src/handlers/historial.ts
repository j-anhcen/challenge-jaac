import { APIGatewayProxyEvent } from 'aws-lambda';
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { metricScope } from 'aws-embedded-metrics';
import { Auth } from '../common/auth';

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

module.exports.handler = metricScope(metrics => async (event: APIGatewayProxyEvent) => {
    metrics.setNamespace('Historial');

    const errorToken = await Auth.validateJWT(event.headers.Authorization);
    if (errorToken) {
        metrics.putDimensions({ Service: 'historial.handler' });
        metrics.putMetric(errorToken.error, 1);
        return {
            body: JSON.stringify(errorToken),
            statusCode: 400,
        };
    }

    let limit = process.env.PAGINATION_LIMIT;
    let startKey = '';
    if (event.queryStringParameters && event.queryStringParameters) {
        limit = event.queryStringParameters.limit || process.env.PAGINATION_LIMIT;
        startKey = event.queryStringParameters.startKey || ''
    }

    const ExclusiveStartKey = {
        primary_key: startKey
    };

    let results = await docClient.send(new ScanCommand({
        TableName: process.env.PEOPLE_TABLE,
        Limit: +limit!,
        ...(startKey ? { ExclusiveStartKey } : {}),
    }));

    return {
        body: JSON.stringify({
            results,
            lastkey: results?.LastEvaluatedKey?.primary_key,
        }),
        statusCode: 200,
    };
})