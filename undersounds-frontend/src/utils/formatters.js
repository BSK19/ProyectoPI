export const formatPrice = (price) => {
    return `$${price.toFixed(2)}`;
};

export const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
};

export const formatTrackDuration = (durationInSeconds) => {
    const minutes = Math.floor(durationInSeconds / 60);
    const seconds = durationInSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

export const getFormattedAlbumDuration = (album) => {
    if (!album.tracks || album.tracks.length === 0) return "0m";
    const totalSeconds = album.tracks.reduce((total, track) => {
      if (!track.duration) return total;
      const parts = track.duration.split(':');
      if (parts.length !== 2) return total;
      const minutes = parseInt(parts[0], 10) || 0;
      const seconds = parseInt(parts[1], 10) || 0;
      return total + (minutes * 60 + seconds);
    }, 0);
    const minutes = Math.ceil(totalSeconds / 60);
    return `${minutes}m`;
  };

export const formatTrackReleaseDate = (releaseDate) => {
    if (!releaseDate) return '';
    const parts = releaseDate.split('-');
    if (parts.length !== 3) return releaseDate;
    const year = parts[0];
    const month = parseInt(parts[1], 10);
    const day = parts[2];
    const months = [
      "Enero", "Febrero", "Marzo", "Abril",
      "Mayo", "Junio", "Julio", "Agosto",
      "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];
    const monthName = months[month - 1] || parts[1];
    return `${day} de ${monthName}, ${year}`;
  };