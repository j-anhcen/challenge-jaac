import { APIGatewayProxyEvent } from 'aws-lambda';
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { GetCommand, PutCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { metricScope } from 'aws-embedded-metrics';
import { PeopleInterface, PlanetInterface } from "../common/interfaces"
import { httpPlugin } from "../plugins";
import { getIdFromUrl, personFormat, planetFormat } from '../common/utils';
import { Auth } from '../common/auth';

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

module.exports.handler = metricScope(metrics => async (event: APIGatewayProxyEvent) => {

    metrics.setNamespace('Fusionados');

    const errorToken = await Auth.validateJWT(event.headers.Authorization);
    if (errorToken) {
        metrics.putDimensions({ Service: 'fusionadoa.handler' });
        metrics.putMetric(errorToken.error, 1);

        return {
            body: JSON.stringify(errorToken),
            statusCode: 400,
        };
    }

    const { id } = event.pathParameters!;


    let cacheDb = await docClient.send(new GetCommand({
        TableName: process.env.CACHE_TABLE,
        Key: { id }
    }));
    if (cacheDb.Item) {
        return {
            body: JSON.stringify({ ...cacheDb.Item }),
            statusCode: 200,
        };
    }


    let person;
    let personDb = await docClient.send(new GetCommand({
        TableName: process.env.PEOPLE_TABLE,
        Key: { id }
    }));

    if (!personDb.Item) {
        person = await httpPlugin.get<PeopleInterface>(`${process.env.SWAPI_URL!}/${id}`);
        
        if (!person) {
            return {
                body: JSON.stringify({ error: `Person with ID ${id} not exist` }),
                statusCode: 404,
            };
        }

        const personItem = { id, ...personFormat(person) }

        await docClient.send(new PutCommand({
            TableName: process.env.PEOPLE_TABLE,
            Item: personItem,
        }));

        person = personItem;
    }
    else {
        person = personDb.Item;
    }

    const planetId = getIdFromUrl(person.homeworld);
    let planet;

    let planetDb = await docClient.send(new GetCommand({
        TableName: process.env.PLANET_TABLE,
        Key: { id: planetId }
    }));

    if (!planetDb.Item) {
        planet = await httpPlugin.get<PlanetInterface>(person.homeworld);
        
        if (!planet) {
            return {
                body: JSON.stringify({ error: 'Planet ID not exist' }),
                statusCode: 404,
            };
        }

        const planetItem = {
            id: planetId,
            ...planetFormat(planet)
        }

        await docClient.send(new PutCommand({
            TableName: process.env.PLANET_TABLE,
            Item: planetItem
        }));

        planet = planetItem;
    }
    else {
        planet = planetDb.Item;
    }

    const response = {
        ...person,
        homeworld_detail: planet
    }

    
    const expireAt = Math.floor((new Date().getTime() + (+process.env.TTL_CACHE!) * 60 * 1000) / 1000);
    await docClient.send(new PutCommand({
        TableName: process.env.CACHE_TABLE,
        Item: { ...response, expireAt }
    }));

    return {
        body: JSON.stringify(response),
        statusCode: 200,
    };
})
