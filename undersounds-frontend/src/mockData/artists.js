import imagenPFP from '../assets/images/artista.jpg';
import merch1 from '../assets/images/merch1.jpg';
import merch2 from '../assets/images/merch2.jpg';
import merch3 from '../assets/images/merch3.jpg';
import merch4 from '../assets/images/merch4.jpg';
import merch5 from '../assets/images/merch5.jpg';

const artists = [
    {
        id: 1,
        name: "Artist One",
        profileImage: imagenPFP,
        genre: "Rock",
        bio: "An up-and-coming rock artist known for their energetic performances.",
        albums: [
            {
                id: 5,
                title: "Debut Album",
                releaseYear: 2023,
                coverImage: "/assets/images/album1.jpg",
                price: 9.99,
            },
            {
                id: 6,
                title: "Second Album",
                releaseYear: 2024,
                coverImage: "/assets/images/album2.jpg",
                price: 11.99,
            },
        ],
        concerts: [
            {
                id: 1,
                location: "New York City, NY",
                date: "2025-05-15",
                concertImage: "/assets/images/concert1.jpg",
            },
            {
                id: 2,
                location: "Los Angeles, CA",
                date: "2025-06-10",
                concertImage: "/assets/images/concert2.jpg",
            },
        ],
        merchandising: [
            {
                id: 1,
                name: "Artist One T-Shirt",
                price: 19.99,
                merchImage: merch1, // utilizando la imagen importada
                description: "A high-quality cotton t-shirt with the Artist One logo.",
            },
            {
                id: 2,
                name: "Artist One Mug",
                price: 9.99,
                merchImage: merch2,
                description: "A ceramic mug with a cool Artist One design.",
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
        name: "Artist Two",
        profileImage: imagenPFP,
        genre: "Pop",
        bio: "A pop sensation with catchy tunes and a vibrant style.",
        albums: [
            {
                id: 7,
                title: "First Hit",
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
                concertImage: "/assets/images/concert3.jpg",
            },
        ],
        merchandising: [
            {
                id: 3,
                name: "Artist Two Cap",
                price: 15.99,
                merchImage: merch3,
                description: "A stylish cap with the Artist Two logo embroidered.",
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
        name: "Artist Three",
        profileImage: imagenPFP, 
        genre: "Jazz",
        bio: "A talented jazz musician with a unique sound.",
        albums: [
            {
                id: 8,
                title: "Smooth Jazz",
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
                concertImage: "/assets/images/concert4.jpg",
            },
            {
                id: 2,
                location: "San Francisco, CA",
                date: "2025-09-12",
                concertImage: "/assets/images/concert5.jpg",
            },
        ],
        merchandising: [
            {
                id: 4,
                name: "Artist Three Vinyl Record",
                price: 25.99,
                merchImage: merch4,
                description: "Limited edition vinyl record of the Artist Three's smooth jazz album.",
            },
            {
                id: 5,
                name: "Artist Three Tote Bag",
                price: 12.99,
                merchImage: merch5,
                description: "Eco-friendly tote bag with Artist Three's unique design.",
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