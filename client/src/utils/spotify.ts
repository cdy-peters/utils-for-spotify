export const getLargestImage = (images: any[]) => {
  return images.reduce((largestImage, image) => {
    return image.height > largestImage.height ? image : largestImage;
  }, images[0]);
};

export const getArtistString = (artists: any[]) => {
  return artists.map((artist) => artist.name).join(", ");
};
