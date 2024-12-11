import { PeopleInterface } from "../../src/common/interfaces"
import { httpPlugin } from "../../src/plugins"

describe('plugins/http.plugin.ts', () => {

    test('httpPlugin.get() should return the people name', async () => {
        const data = await httpPlugin.get<PeopleInterface>(`https://swapi.dev/api/people/1`);
    
        expect(data.name).toEqual(expect.any(String));
        expect(data).toEqual(expect.objectContaining({
            name: 'Luke Skywalker'
        }));
    })

})