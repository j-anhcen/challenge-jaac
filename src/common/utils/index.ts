import { PeopleInterface, PlanetInterface } from "../interfaces";

export const getIdFromUrl = (url: string) => {
    try {
        const elements = url.split('/');
        return elements[elements.length-2];
    } catch (error) {
        return null;
    }
}

export const personFormat = (person: PeopleInterface) => {
    return {
        createdAt: (new Date().getTime()),
        name: person.name,
        height: person.height,
        mass: person.mass,
        hair_color: person.hair_color,
        skin_color: person.skin_color,
        eye_color: person.eye_color,
        birth_year: person.birth_year,
        gender: person.gender,
        homeworld: person.homeworld
    }
}

export const planetFormat = (planet: PlanetInterface) => {
    return {
        name: planet.name,
        rotation_period: planet.rotation_period,
        orbital_period: planet.orbital_period,
        diameter: planet.diameter,
        climate: planet.climate,
        gravity: planet.gravity,
        terrain: planet.terrain,
        surface_water: planet.surface_water,
        population: planet.population,
    }
}