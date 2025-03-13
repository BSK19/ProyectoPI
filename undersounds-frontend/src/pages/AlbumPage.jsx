import React from 'react';
import { useParams } from 'react-router-dom';
import  albums  from '../mockData/albums';
import Album from '../components/Album/Album';

const AlbumPage = () => {
    const { albumId } = useParams();
    const album = albums.find((album) => album.id === parseInt(albumId));

    if (!album) {
        return <div>Album not found</div>;
    }

    return (
        <div>
            <h1>{album.title}</h1>
            <Album album={album} />
        </div>
    );
};

export default AlbumPage;