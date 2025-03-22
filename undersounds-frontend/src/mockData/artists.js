import imagenPFP from '../assets/images/artista.jpg';
import imagenPFP1 from '../assets/images/soundscapers.jpg';
import imagenPFP2 from '../assets/images/DJBeats.jpg';
import imagenPFP3 from '../assets/images/soulfoulvoices.jpeg';
import merch1 from '../assets/images/merch1.jpg';
import merch2 from '../assets/images/merch2.jpg';
import merch3 from '../assets/images/merch3.jpg';
import merch4 from '../assets/images/merch4.jpg';
import merch5 from '../assets/images/merch5.jpg';
import concertNY from '../assets/images/concertNY.jpg';
import concertLA from '../assets/images/concertLA.jpg';
import concertMI from '../assets/images/miami.jpg';
import concertIL from '../assets/images/concertIL.jpg';
import concertCA from '../assets/images/concertCA.jpg';

const artists = [
    {
        id: 1,
        name: "The Soundscapers",
        profileImage: imagenPFP1,
        genre: "Rock",
        bio: "Una banda de rock emergente conocida por sus actuaciones enérgicas.",
        albums: [
            {
                id: 5,
                title: "Álbum Debut",
                releaseYear: 2023,
                coverImage: "/assets/images/album1.jpg",
                price: 9.99,
            },
            {
                id: 6,
                title: "Segundo Álbum",
                releaseYear: 2024,
                coverImage: "/assets/images/album2.jpg",
                price: 11.99,
            },
        ],
        concerts: [
            {
                id: 1,
                location: "Nueva York, NY",
                date: "2025-05-15",
                concertImage: concertNY,
            },
            {
                id: 2,
                location: "Los Ángeles, CA",
                date: "2025-06-10",
                concertImage: concertLA,
            },
        ],
        merchandising: [
            {
                id: 1,
                name: "Camiseta de The Soundscapers",
                price: 19.99,
                merchImage: merch1,
                description: "Una camiseta de algodón de alta calidad con el logo de The Soundscapers.",
            },
            {
                id: 2,
                name: "Taza de The Soundscapers",
                price: 9.99,
                merchImage: merch2,
                description: "Una taza de cerámica con un diseño genial de The Soundscapers.",
            },
        ],
        socialLinks: {
            facebook: "https://facebook.com/artistone",
            instagram: "https://instagram.com/artistone",
            twitter: "https://twitter.com/artistone",
        },
    },
    {
        id: 2,
        name: "DJ Beats",
        profileImage: imagenPFP2,
        genre: "Pop",
        bio: "Una sensación del pop con melodías pegajosas y un estilo vibrante.",
        albums: [
            {
                id: 7,
                title: "Primer Éxito",
                releaseYear: 2022,
                coverImage: "/assets/images/album3.jpg",
                price: 8.99,
            },
            {
                id: 7,
                title: "Primer Éxito",
                releaseYear: 2022,
                coverImage: "/assets/images/album3.jpg",
                price: 8.99,
            },
            {
                id: 7,
                title: "Primer Éxito",
                releaseYear: 2022,
                coverImage: "/assets/images/album3.jpg",
                price: 8.99,
            },
            {
                id: 7,
                title: "Primer Éxito",
                releaseYear: 2022,
                coverImage: "/assets/images/album3.jpg",
                price: 8.99,
            },
        ],
        concerts: [
            {
                id: 1,
                location: "Miami, FL",
                date: "2025-07-20",
                concertImage: concertMI,
            },
        ],
        merchandising: [
            {
                id: 3,
                name: "Gorra de DJ Beats",
                price: 15.99,
                merchImage: merch3,
                description: "Una gorra con estilo y el logo de DJ Beats bordado.",
            },
        ],
        socialLinks: {
            facebook: "https://facebook.com/artisttwo",
            instagram: "https://instagram.com/artisttwo",
            twitter: "https://twitter.com/artisttwo",
        },
    },
    {
        id: 3,
        name: "Soulful Voices",
        profileImage: imagenPFP3, 
        genre: "Jazz",
        bio: "Un talentoso músico de jazz con un sonido único.",
        albums: [
            {
                id: 8,
                title: "Jazz Suave",
                releaseYear: 2021,
                coverImage: "/assets/images/album4.jpg",
                price: 10.99,
            },
        ],
        concerts: [
            {
                id: 1,
                location: "Chicago, IL",
                date: "2025-08-05",
                concertImage: concertIL,
            },
            {
                id: 2,
                location: "San Francisco, CA",
                date: "2025-09-12",
                concertImage: concertCA,
            },
        ],
        merchandising: [
            {
                id: 4,
                name: "Vinilo de Soulful Voices",
                price: 25.99,
                merchImage: merch4,
                description: "Edición limitada en vinilo del álbum de jazz suave de Soulful Voices.",
            },
            {
                id: 5,
                name: "Bolsa Tote de Soulful Voices",
                price: 12.99,
                merchImage: merch5,
                description: "Bolsa ecológica con un diseño único de Soulful Voices.",
            },
        ],
        socialLinks: {
            facebook: "https://facebook.com/artistthree",
            instagram: "https://instagram.com/artistthree",
            twitter: "https://twitter.com/artistthree",
        },
    },
];

export default artists;