import albumPrueba from '../assets/images/albumPrueba.jpeg';
import albumPrueba2 from '../assets/images/MOTH.jpg';
import albumPrueba3 from '../assets/images/ROTN.jpg';
import albumPrueba4 from '../assets/images/EOT.jpeg';
import albumPrueba5 from '../assets/images/EOT1.webp'; // Asegúrate de agregar esta imagen
import albumPrueba6 from '../assets/images/EOT2.jpg'; // Asegúrate de agregar esta imagen
import albumPrueba7 from '../assets/images/EOT3.jpg'; // Asegúrate de agregar esta imagen
import albumPrueba8 from '../assets/images/EOT4jpeg.jpeg'; // Asegúrate de agregar esta imagen
import albumPrueba9 from '../assets/images/EOT5.jpg'; // Asegúrate de agregar esta imagen
import albumPrueba10 from '../assets/images/EOT6.jpg'; // Asegúrate de agregar esta imagen

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
            { id: 1, title: "Whispers in the Wind", duration: "4:05", url: "../music/21 Questions.mp3" },
            { id: 2, title: "Reflections", duration: "5:30", url: "../music/Back In Black.mp3" },
            { id: 3, title: "Distant Shores", duration: "6:15", url: "../music/Believer.mp3" },
        ],
        ratings: [
            { userId: 1, rating: 5, comment: "Absolutely beautiful!" },
            { userId: 2, rating: 4, comment: "Very calming and relaxing." },
        ],
        vinyl: true,
        cd: true,
        cassettes: false,
    },
    {
        id: 4, // Nuevo álbum para "The Soundscapers"
        title: "Whispers of the Forest",
        artist: "The Soundscapers",
        coverImage: albumPrueba5,
        price: 10.99,
        releaseYear: 2024,
        genre: "Ambient",
        tracks: [
            { id: 1, title: "Forest Breeze", duration: "4:10", url: "../music/21 Questions.mp3" },
            { id: 2, title: "Morning Dew", duration: "5:20", url: "../music/Back In Black.mp3" },
            { id: 3, title: "The Calm Before the Storm", duration: "6:00", url: "../music/Believer.mp3" },
        ],
        ratings: [
            { userId: 3, rating: 5, comment: "Another breathtaking masterpiece!" },
            { userId: 4, rating: 4, comment: "Very peaceful and serene." },
        ],
        vinyl: true,
        cd: true,
        cassettes: true,
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
            { id: 1, title: "Nightfall", duration: "3:45", url: "../music/21 Questions.mp3" },
            { id: 2, title: "Starlight", duration: "4:20", url: "../music/Back In Black.mp3" },
            { id: 3, title: "Dance of Shadows", duration: "5:10", url: "../music/Believer.mp3" },
        ],
        ratings: [
            { userId: 3, rating: 4, comment: "Great beats for a party!" },
            { userId: 4, rating: 5, comment: "Loved every track!" },
        ],
        vinyl: false,
        cd: true,
        cassettes: true,
    },
    {
        id: 5, // Nuevo álbum para "DJ Beats"
        title: "Electric Dreams",
        artist: "DJ Beats",
        coverImage: albumPrueba6,
        price: 13.99,
        releaseYear: 2023,
        genre: "Electronic",
        tracks: [
            { id: 1, title: "Neon Lights", duration: "4:00", url: "../music/21 Questions.mp3" },
            { id: 2, title: "Pulse of the City", duration: "4:50", url: "../music/Back In Black.mp3" },
            { id: 3, title: "Midnight Rave", duration: "5:30", url: "../music/Believer.mp3" },
        ],
        ratings: [
            { userId: 5, rating: 4, comment: "The beats are really strong on this one!" },
            { userId: 6, rating: 5, comment: "I love the energy in every track." },
        ],
        vinyl: false,
        cd: true,
        cassettes: true,
        
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
            { id: 1, title: "Love's Embrace", duration: "3:30", url: "../music/21 Questions.mp3" },
            { id: 2, title: "Heartbeats", duration: "4:00", url: "../music/Back In Black.mp3" },
            { id: 3, title: "Forever Yours", duration: "4:50", url: "../music/Believer.mp3" },
        ],
        ratings: [
            { userId: 5, rating: 5, comment: "A masterpiece!" },
            { userId: 6, rating: 3, comment: "Some songs are a bit slow." },
        ],
        vinyl: true,
        cd: false,
        cassettes: false,
        destacado: true,
    },
    {
        id: 6, // Nuevo álbum para "Soulful Voices"
        title: "Songs of the Soul",
        artist: "Soulful Voices",
        coverImage: albumPrueba7,
        price: 9.49,
        releaseYear: 2022,
        genre: "Pop",
        tracks: [
            { id: 1, title: "In the Stillness", duration: "4:20", url: "../music/21 Questions.mp3" },
            { id: 2, title: "Echoes of Love", duration: "4:40", url: "../music/Back In Black.mp3" },
            { id: 3, title: "Together Forever", duration: "5:10", url: "../music/Believer.mp3" },
        ],
        ratings: [
            { userId: 7, rating: 4, comment: "Beautiful vocals and lyrics." },
            { userId: 8, rating: 4, comment: "Perfect for a relaxed evening." },
        ],
        vinyl: true,
        cd: false,
        cassettes: true,
        destacado: true,
    },
    {
        id: 7,
        title: "Ethereal Skies",
        artist: "The Soundscapers",
        coverImage: albumPrueba8,
        price: 11.99,
        releaseYear: 2025,
        genre: "Ambient",
        tracks: [
            { id: 1, title: "Skyward Bound", duration: "4:30", url: "../music/21 Questions.mp3" },
            { id: 2, title: "Cloud Reflections", duration: "5:10", url: "../music/Back In Black.mp3" },
            { id: 3, title: "Endless Horizon", duration: "6:00", url: "../music/Believer.mp3" },
        ],
        ratings: [
            { userId: 9, rating: 5, comment: "Another stunning album!" },
            { userId: 10, rating: 4, comment: "Very peaceful and dreamy." },
        ],
        vinyl: true,
        cd: true,
        cassettes: false,
        destacado: true,
    },

    // Nuevo álbum para "DJ Beats"
    {
        id: 8,
        title: "Neon Vibes",
        artist: "DJ Beats",
        coverImage: albumPrueba9,
        price: 14.49,
        releaseYear: 2025,
        genre: "Electronic",
        tracks: [
            { id: 1, title: "Electric Pulse", duration: "4:00", url: "../music/21 Questions.mp3" },
            { id: 2, title: "Rave Night", duration: "5:00", url: "../music/Back In Black.mp3" },
            { id: 3, title: "City Lights", duration: "5:40", url: "../music/Believer.mp3" },
        ],
        ratings: [
            { userId: 11, rating: 5, comment: "High energy throughout!" },
            { userId: 12, rating: 4, comment: "Perfect for club nights." },
        ],
        vinyl: false,
        cd: true,
        cassettes: true,
        destacado: true,
    },

    // Nuevo álbum para "Soulful Voices"
    {
        id: 9,
        title: "Voices in the Wind",
        artist: "Soulful Voices",
        coverImage: albumPrueba10,
        price: 10.99,
        releaseYear: 2025,
        genre: "Pop",
        tracks: [
            { id: 1, title: "Whispering Winds", duration: "3:45", url: "../music/21 Questions.mp3" },
            { id: 2, title: "Falling Leaves", duration: "4:30", url: "../music/Back In Black.mp3" },
            { id: 3, title: "A Song for You", duration: "5:00", url: "../music/Believer.mp3" },
        ],
        ratings: [
            { userId: 13, rating: 5, comment: "Beautiful and emotional!" },
            { userId: 14, rating: 4, comment: "A soulful album." },
        ],
        vinyl: true,
        cd: false,
        cassettes: true,
        destacado: true,
    },
];

export default albums;
