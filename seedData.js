const { faker } = require('@faker-js/faker');

const createRandomAdventure = () => {
    return {
        id: faker.string.uuid(),
        title: faker.word.noun() + " en " + faker.location.city(),
        description: faker.lorem.paragraph(),
        image: faker.image.urlPicsumPhotos({ width: 800, height: 600 }),
        difficulty: faker.helpers.arrayElement(['Facil', 'Moderado', 'Dificil']),
        coordinates: {
            lat: faker.location.latitude(),
            lng: faker.location.longitude()
        }
    };
};

const adventures = faker.helpers.multiple(createRandomAdventure, { count: 5000 });
console.log(JSON.stringify(adventures, null, 2));