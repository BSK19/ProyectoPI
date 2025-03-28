const accounts = [
    {
        "id": 1,
        "username": "fanUser1",
        "email": "fan1@example.com",
        "password": "password123",
        "role": "fan",
        "profileImage": "../assets/images/default.jpg",
        "bio": "Soy un fanático de la música y sigo a mis artistas favoritos.",
        "socialLinks": {
            "facebook": "",
            "instagram": "",
            "twitter": ""
        },
        "purchaseHistory": [],
        "createdAt": "2023-01-15T10:00:00Z",
        "updatedAt": "2023-01-15T10:00:00Z"
    },
    {
        "id": 2,
        "username": "bandUser1",
        "email": "band1@example.com",
        "password": "password456",
        "role": "band",
        "bandName": "The Rockers",
        "genre": "Rock",
        "profileImage": "../assets/images/default.jpg",
        "bio": "Somos The Rockers, ¡listos para sacudir el escenario!",
        "socialLinks": {
            "facebook": "https://facebook.com/therockers",
            "instagram": "https://instagram.com/therockers",
            "twitter": "https://twitter.com/therockers"
        },
        "purchaseHistory": [],
        "createdAt": "2023-02-20T12:30:00Z",
        "updatedAt": "2023-02-20T12:30:00Z"
    },
    {
        "id": 3,
        "username": "labelUser1",
        "email": "label1@example.com",
        "password": "password789",
        "role": "label",
        "labelName": "Super Records",
        "website": "https://superrecords.com",
        "profileImage": "../assets/images/default.jpg",
        "bio": "En Super Records, traemos lo mejor de la música.",
        "socialLinks": {
            "facebook": "https://facebook.com/superrecords",
            "instagram": "https://instagram.com/superrecords",
            "twitter": "https://twitter.com/superrecords"
        },
        "purchaseHistory": [],
        "createdAt": "2023-03-10T15:45:00Z",
        "updatedAt": "2023-03-10T15:45:00Z"
    }
]

module.exports = accounts;