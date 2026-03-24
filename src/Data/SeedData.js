import { uid } from '.././utils';

const STEAM_CDN = (id) => `https://cdn.akamai.steamstatic.com/steam/apps/${id}/header.jpg`;

function getDefaultGames(){
    const Games = [
        { id: uid(), gameName: 'Fallout 3',         developer: 'Bethesda Game Studios', price: '$9.99',  image: STEAM_CDN(22300),   releaseDate: 2008 },
        { id: uid(), gameName: 'Skyrim',            developer: 'Bethesda Game Studios', price: '$39.99', image: STEAM_CDN(489830),  releaseDate: 2016 },
        { id: uid(), gameName: 'In Stars and Time', developer: 'insertdisc5',           price: '$19.99', image: STEAM_CDN(1677310), releaseDate: 2023 },
        { id: uid(), gameName: 'Risk of Rain 2',    developer: 'Hopoo Games',           price: '$8.24',  image: STEAM_CDN(632360),  releaseDate: 2020 },
        { id: uid(), gameName: 'Apex Legends',      developer: 'Respawn',               price: 'FREE',   image: STEAM_CDN(1172470), releaseDate: 2020 },
        { id: uid(), gameName: 'Call of Duty',      developer: 'Treyarch / Raven',      price: '$69.99', image: STEAM_CDN(1938090), releaseDate: 2022 },
        { id: uid(), gameName: 'Terraria',          developer: 'Re-Logic',              price: '$9.99',  image: STEAM_CDN(105600),  releaseDate: 2011 },
        { id: uid(), gameName: 'SIGNALIS',          developer: 'rose-engine',           price: '$19.99', image: STEAM_CDN(1621720), releaseDate: 2022 },
        { id: uid(), gameName: 'Caves of Qud',      developer: 'Freehold Games',        price: '$29.99', image: STEAM_CDN(333640),  releaseDate: 2024 },
        { id: uid(), gameName: 'Civilization VI',   developer: 'Firaxis Games',         price: '$2.99',  image: STEAM_CDN(289070),  releaseDate: 2016 },
    ]
    return Games
};
export default getDefaultGames;