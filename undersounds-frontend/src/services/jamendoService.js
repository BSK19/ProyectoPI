import axios from 'axios';

const JAMENDO_API_URL = 'https://api.jamendo.com/v3.0';
const API_KEY = "37a3b74b";

// Helper function to format duration
const formatDuration = (seconds) => {
    if (!seconds || isNaN(seconds)) {
        return '0:00';
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

export const fetchTracklist = async (albumId) => {
    try {
        const response = await fetch(`${JAMENDO_API_URL}/albums/tracks/?client_id=${API_KEY}&format=json&id=${albumId}&include=musicinfo+stats&imagesize=200`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            },
            mode: 'cors'
        });

        const data = await response.json();
        console.log('Track data:', data);

        if (!data.results || !data.results[0] || !data.results[0].tracks) {
            console.log('No tracks found for album:', albumId);
            return [];
        }

        const tracks = data.results[0].tracks.map(track => ({
            id: track.id,
            title: track.name,
            duration: formatDuration(parseInt(track.duration)),
            url: track.audio,
            autor: track.artist_name,
            n_reproducciones: parseInt(track.listens) || 0
        }));

        console.log('Processed tracks:', tracks);
        return tracks;
    } catch (error) {
        console.error('Error fetching tracklist:', error);
        return [];
    }
};

export const fetchAlbums = async () => {
    try {
        const response = await fetch(`${JAMENDO_API_URL}/albums/?client_id=${API_KEY}&format=json&limit=20&imagesize=200&include=musicinfo+stats+tracks`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            },
            mode: 'cors'
        });

        const data = await response.json();
        console.log('Albums data:', data);

        if (!data.results) {
            console.log('No albums found');
            return [];
        }

        const albums = data.results.map(album => {
            let genre = 'Unknown';
            if (album.tags && album.tags.length > 0) {
                genre = Array.isArray(album.tags) ? album.tags[0] : album.tags.split(',')[0].trim();
            }

            // Calculate price based on number of tracks
            const trackCount = album.tracks ? album.tracks.length : 0;
            const basePrice = 9.99;
            const pricePerTrack = 0.99;
            const price = (basePrice + (trackCount * pricePerTrack)).toFixed(2);

            const tracks = album.tracks ? album.tracks.map(track => ({
                id: track.id,
                title: track.name,
                duration: formatDuration(parseInt(track.duration)),
                url: track.audio,
                autor: track.artist_name,
                n_reproducciones: parseInt(track.listens) || 0
            })) : [];

            return {
                id: album.id,
                name: album.name,
                artist_name: album.artist_name,
                artist_id: album.artist_id,
                image: album.image || '/assets/images/default-cover.jpg',
                releasedate: album.releasedate,
                genre: genre,
                tracks: tracks,
                price: parseFloat(price)
            };
        });

        console.log('Processed albums:', albums);
        return albums;
    } catch (error) {
        console.error('Error fetching albums:', error);
        return [];
    }
};