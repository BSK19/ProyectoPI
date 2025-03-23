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
import banner1 from '../assets/images/banner1.webp';
import banner2 from '../assets/images/banner2.jpeg';
import banner3 from '../assets/images/banner1.jpg';

const artists = [
    {
        id: 1,
        name: "The Soundscapers",
        profileImage: imagenPFP1,
        genre: "Rock",
        bio: "Una banda de rock emergente conocida por sus actuaciones enérgicas.",
        banner: banner1,
        seguidores: "2.5M",
        ubicacion: "Londres, RU",
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
                time: "20:30",
                venue: "Madison Square Garden",
                concertImage: concertNY,
                description: "Únete a The Soundscapers en una noche épica de rock alternativo en el corazón de Nueva York. Este concierto marca el inicio de su gira mundial 2025, donde presentarán su nuevo álbum junto con sus mayores éxitos. La banda promete una experiencia inmersiva con una producción visual espectacular, efectos especiales de última generación y algunas sorpresas especiales para los fans. Además, contaremos con artistas invitados que se unirán a la banda en el escenario para crear momentos únicos e irrepetibles."
            },
            {
                id: 2,
                location: "Los Ángeles, CA",
                date: "2025-06-10",
                time: "21:00",
                venue: "Hollywood Bowl",
                concertImage: concertLA,
                description: "The Soundscapers llega a Los Ángeles para ofrecer un espectáculo inolvidable bajo las estrellas. Esta presentación especial incluirá una orquesta en vivo que acompañará a la banda en nuevas versiones de sus canciones más emblemáticas. El concierto también celebrará el 5º aniversario de su álbum debut con una interpretación completa del mismo. La producción incluirá un impresionante show de luces, proyecciones mapped sobre el anfiteatro y una sección acústica íntima que mostrará el lado más personal de la banda."
            }
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
        banner: banner2,
        seguidores: "963K",
        ubicacion: "Madrid, ES",
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
                time: "22:00",
                venue: "Space Miami",
                concertImage: concertMI,
                description: "DJ Beats presenta su nuevo show 'Electronic Dreams' en una noche que promete revolucionar la escena electrónica de Miami. Este evento único combinará música electrónica de vanguardia con elementos visuales innovadores y tecnología interactiva. Los asistentes podrán experimentar un viaje musical a través de diferentes géneros electrónicos, desde house progresivo hasta techno melódico. El show incluirá bailarines, artistas visuales en vivo y una instalación de luz inmersiva que transformará completamente el espacio. Además, DJ Beats estrenará exclusivamente nuevos tracks de su próximo álbum."
            }
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
        seguidores: "1.5M",
        ubicacion: "Nueva York, EE. UU.",
        banner: banner3,
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
                time: "19:30",
                venue: "Chicago Symphony Center",
                concertImage: concertIL,
                description: "Soulful Voices presenta una velada única de jazz contemporáneo en el prestigioso Chicago Symphony Center. Esta actuación especial fusionará el jazz tradicional con elementos de música clásica y world music. El grupo estará acompañado por una sección de cuerdas de la Orquesta Sinfónica de Chicago, creando texturas sonoras nunca antes exploradas. El programa incluirá nuevas composiciones originales, así como interpretaciones innovadoras de clásicos del jazz. La acústica excepcional del venue permitirá apreciar cada matiz y detalle de las complejas armonías y improvisaciones que caracterizan el estilo único de Soulful Voices."
            },
            {
                id: 2,
                location: "San Francisco, CA",
                date: "2025-09-12",
                time: "20:00",
                venue: "SFJAZZ Center",
                concertImage: concertCA,
                description: "En esta noche especial, Soulful Voices transformará el SFJAZZ Center en un viaje musical a través de la historia del jazz. El concierto explorará la evolución del género desde sus raíces hasta las fronteras más contemporáneas. La banda presentará material de su próximo álbum, mezclando elementos de jazz modal, fusion y música experimental. La actuación incluirá colaboraciones sorpresa con leyendas locales del jazz de San Francisco, creando un diálogo musical único entre generaciones. El espectáculo también contará con una exposición fotográfica en el lobby que documenta el proceso creativo detrás de su último trabajo."
            }
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