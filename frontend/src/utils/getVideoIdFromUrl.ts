export const getVideoIdFromUrl = (url: string): string | null => {
  const regularVideoMatch = url.match(
    /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\\/\s]{11})/
  );
  const shortsVideoMatch = url.match(/youtube\.com\/shorts\/([^"&?\\/\s]{11})/);

  if (regularVideoMatch) {
    return regularVideoMatch[1];
  } else if (shortsVideoMatch) {
    return shortsVideoMatch[1];
  }

  return null;
};
