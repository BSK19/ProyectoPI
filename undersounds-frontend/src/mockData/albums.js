import albumPrueba from '../assets/images/albumPrueba.jpeg';
import albumPrueba2 from '../assets/images/MOTH.jpg';
import albumPrueba3 from '../assets/images/ROTN.jpg';
import albumPrueba4 from '../assets/images/EOT.jpeg';

const albums = [
    {
        id: 1,
        title: "Echoes of Time",
        artist: "The Soundscapers",
        coverImage: albumPrueba4,
        price: 9.99,
        releaseYear: 2023,
        genre: "Ambient",
        tracks: [
            { id: 1, title: "Whispers in the Wind", duration: "4:05" },
            { id: 2, title: "Reflections", duration: "5:30" },
            { id: 3, title: "Distant Shores", duration: "6:15" },
        ],
        ratings: [
            { userId: 1, rating: 5, comment: "Absolutely beautiful!" },
            { userId: 2, rating: 4, comment: "Very calming and relaxing." },
        ],
    },
    {
        id: 2,
        title: "Rhythms of the Night",
        artist: "DJ Beats",
        coverImage: albumPrueba3,
        price: 12.99,
        releaseYear: 2022,
        genre: "Electronic",
        tracks: [
            { id: 1, title: "Nightfall", duration: "3:45" },
            { id: 2, title: "Starlight", duration: "4:20" },
            { id: 3, title: "Dance of Shadows", duration: "5:10" },
        ],
        ratings: [
            { userId: 3, rating: 4, comment: "Great beats for a party!" },
            { userId: 4, rating: 5, comment: "Loved every track!" },
        ],
    },
    {
        id: 3,
        title: "Melodies of the Heart",
        artist: "Soulful Voices",
        coverImage: albumPrueba2,
        price: 8.99,
        releaseYear: 2021,
        genre: "Pop",
        tracks: [
            { id: 1, title: "Love's Embrace", duration: "3:30" },
            { id: 2, title: "Heartbeats", duration: "4:00" },
            { id: 3, title: "Forever Yours", duration: "4:50" },
        ],
        ratings: [
            { userId: 5, rating: 5, comment: "A masterpiece!" },
            { userId: 6, rating: 3, comment: "Some songs are a bit slow." },
        ],
    },
    {
        id: 4,
        title: "Scaled and Icyt",
        artist: "Twenty One Pilots",
        coverImage: albumPrueba,
        price: 8.99,
        releaseYear: 2021,
        genre: "Pop",
        tracks: [
            { id: 1, title: "Good Day", duration: "3:30" },
            { id: 2, title: "Shy Away", duration: "4:00" },
            { id: 3, title: "Saturday", duration: "4:50" },
        ],
        ratings: [
            { userId: 5, rating: 5, comment: "A masterpiece!" },
            { userId: 6, rating: 3, comment: "Some songs are a bit slow." },
        ],
    }
];

export default albums;