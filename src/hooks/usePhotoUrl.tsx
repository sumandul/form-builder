import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const imgUrl = 'http://victoryapi.citizensciencenepal.com/victory-bucket/';

function usePhotoUrl(photo: string) {
  const [photoUrl, setPhotoUrl] = useState<string>(''); // Typing state
  const [loading, setLoading] = useState<boolean>(false); // Typing state
  const [error, setError] = useState<string | null>(null); // Typing state

  // Memoized function to fetch the image
  // eslint-disable-next-line no-shadow
  const fetchImage = useCallback(async (photo: string) => {
    const regex = /privateuploads\/([^.]+)\.jpg/;
    const match = regex.exec(photo);
    const extractedWords = match ? `privateuploads/${match[1]}.jpg` : null;

    try {
      setLoading(true); // Start loading
      const response = await axios.get(photo, {
        responseType: 'arraybuffer',
      });

      if (response.status === 200) {
        return photo;
      }
      if (extractedWords) {
        return extractedWords;
      }
      return ''; // Return an empty string if both conditions fail
    } catch (err) {
      setError('Failed to load image');
      return extractedWords || ''; // Fallback to extracted words or empty string
    } finally {
      setLoading(false); // End loading
    }
  }, []);

  // useEffect to fetch and set the photo URL whenever the photo changes
  useEffect(() => {
    const updatePhoto = async () => {
      if (photo) {
        const newImage = await fetchImage(photo);
        if (photoUrl !== newImage) {
          setPhotoUrl(newImage);
        }
      }
    };

    updatePhoto();
  }, [fetchImage, photo, photoUrl]);

  // Return the full image URL and the loading status
  return { PhotoUrl: imgUrl + photoUrl, loading, error };
}

export default usePhotoUrl;
