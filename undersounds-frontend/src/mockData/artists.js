const artists = [
    {
        id: 1,
        name: "Artist One",
        genre: "Rock",
        bio: "An up-and-coming rock artist known for their energetic performances.",
        albums: [
            {
                id: 1,
                title: "Debut Album",
                releaseYear: 2023,
                coverImage: "/assets/images/album1.jpg",
                price: 9.99,
            },
            {
                id: 2,
                title: "Second Album",
                releaseYear: 2024,
                coverImage: "/assets/images/album2.jpg",
                price: 11.99,
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
        genre: "Pop",
        bio: "A pop sensation with catchy tunes and a vibrant style.",
        albums: [
            {
                id: 3,
                title: "First Hit",
                releaseYear: 2022,
                coverImage: "/assets/images/album3.jpg",
                price: 8.99,
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
        genre: "Jazz",
        bio: "A talented jazz musician with a unique sound.",
        albums: [
            {
                id: 4,
                title: "Smooth Jazz",
                releaseYear: 2021,
                coverImage: "/assets/images/album4.jpg",
                price: 10.99,
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