const pitches = [
  "C",
  "C♯/D♭",
  "D",
  "D♯/E♭",
  "E",
  "F",
  "F♯/G♭",
  "G",
  "G♯/A♭",
  "A",
  "A♯/B♭",
  "B",
];

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "June",
  "July",
  "Aug",
  "Sept",
  "Oct",
  "Nov",
  "Dec",
];

export const getLargestImage = (images: any[]) => {
  return images.reduce((largestImage, image) => {
    return image.height > largestImage.height ? image : largestImage;
  }, images[0]);
};

export const getSmallestImage = (images: any[]) => {
  return images.reduce((smallestImage, image) => {
    return image.height < smallestImage.height ? image : smallestImage;
  }, images[0]);
};

export const getArtistString = (artists: any[], anchor: boolean = false) => {
  if (anchor) {
    return artists
      .map((artist) => {
        if (artist.id === "0LyfQWJT6nXafLPZqxe9Of") {
          return `<p>Various Artists</p>`;
        }
        return `<a href="/artist/${artist.id}" class="hover:text-gray-100 cursor-pointer">${artist.name}</a>`;
      })
      .join(", ");
  }

  return artists.map((artist) => artist.name).join(", ");
};

export const durationToString = (duration: number) => {
  const minutes = Math.floor(duration / 60000);
  const seconds = ((duration % 60000) / 1000).toFixed(0);
  return `${minutes}:${Number(seconds) < 10 ? "0" : ""}${seconds}`;
};

export const keyToPitch = (key: number) => {
  if (key === -1) return "Unknown";
  return pitches[key];
};

export const dateToString = (date: string) => {
  const [year, month, day] = date.split("-");
  return `${months[Number(month) - 1]} ${day}, ${year}`;
};

export const getAverageFeatures = (
  tracksFeatures: { id: string; features: any }[]
) => {
  const averageFeatures = {
    acousticness: 0,
    danceability: 0,
    energy: 0,
    instrumentalness: 0,
    liveness: 0,
    speechiness: 0,
    valence: 0,
  };

  tracksFeatures.forEach((trackFeatures) => {
    averageFeatures.acousticness += trackFeatures.features.acousticness;
    averageFeatures.danceability += trackFeatures.features.danceability;
    averageFeatures.energy += trackFeatures.features.energy;
    averageFeatures.instrumentalness += trackFeatures.features.instrumentalness;
    averageFeatures.liveness += trackFeatures.features.liveness;
    averageFeatures.speechiness += trackFeatures.features.speechiness;
    averageFeatures.valence += trackFeatures.features.valence;
  });

  const len = tracksFeatures.length;
  averageFeatures.acousticness /= len;
  averageFeatures.danceability /= len;
  averageFeatures.energy /= len;
  averageFeatures.instrumentalness /= len;
  averageFeatures.liveness /= len;
  averageFeatures.speechiness /= len;
  averageFeatures.valence /= len;

  return averageFeatures;
};

export const formatNumber = (num: number) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export const genresToString = (arr: string[]) => {
  return arr.map((genre) => genre[0].toUpperCase() + genre.slice(1)).join(", ");
};
