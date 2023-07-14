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

export const getArtistString = (artists: any[]) => {
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
