import coverImage1 from "../assets/images/EOT.jpeg";
import Track1 from "../music/21 Questions.mp3";
import Track2 from "../music/Back In Black.mp3";
import Track3 from "../music/Believer.mp3";

const tracks = [
  {
    id: 1,
    title: "Song One",
    artist: "Artist A",
    album: "Album One",
    duration: "3:45",
    price: 1.29,
    format: ["MP3", "FLAC", "WAV"],
    releaseDate: "2023-01-15",
    genre: "Rock",
    coverImage: coverImage1,
    url: Track1,
    comments: [
      {
        user: "User1",
        comment: "Great track!",
        rating: 5,
      },
      {
        user: "User2",
        comment: "Loved the guitar solo.",
        rating: 4,
      },
    ],
  },
  {
    id: 2,
    title: "Song Two",
    artist: "Artist B",
    album: "Album Two",
    duration: "4:05",
    price: 1.49,
    format: ["MP3", "WAV"],
    releaseDate: "2023-02-20",
    genre: "Pop",
    coverImage: coverImage1,
    url: Track2,
    comments: [
      {
        user: "User3",
        comment: "Catchy tune!",
        rating: 4,
      },
    ],
  },
  {
    id: 3,
    title: "Song Three",
    artist: "Artist C",
    album: "Album Three",
    duration: "2:30",
    price: 0.99,
    format: ["MP3", "FLAC"],
    releaseDate: "2023-03-10",
    genre: "Jazz",
    coverImage: coverImage1,
    url: Track3,
    comments: [],
  },
];

export default tracks;