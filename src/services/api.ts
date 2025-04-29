import { DogReport, ReportResponse } from '../types/dog';

const API_URL = 'https://foundpaw.onrender.com';

export const submitDogReport = async (formData: DogReport): Promise<ReportResponse> => {
  try {
    // Create form data for multipart/form-data request
    const requestFormData = new FormData();

    // Format the request to match what the /whatsapp endpoint expects
    const body = `${formData.status} dog ${formData.description} Location: ${formData.location.lat},${formData.location.lon} Phone: ${formData.phone}`;

    requestFormData.append('From', '+1234567890'); // This is ignored by the backend but needed for format
    requestFormData.append('Body', body);

    // ✅ FIX: append image with correct field name
    if (formData.image) {
      requestFormData.append('image', formData.image); // Corrected
      requestFormData.append('MediaContentType0', formData.image.type);
    }

    console.log('Sending FormData:', {
      body,
      image: formData.image,
      type: formData.image?.type
    });

    const response = await fetch(`${API_URL}/whatsapp`, {
      method: 'POST',
      body: requestFormData,
    });

    const text = await response.text();

    // Parse the TwiML-like response to extract message content
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(text, "text/xml");
    const messageNodes = xmlDoc.getElementsByTagName("Message");

    if (messageNodes.length === 0) {
      throw new Error('Invalid response from server');
    }

    const message = messageNodes[0].textContent || '';

    // Check if the message contains match information
    if (message.includes("Possible match found")) {
      const matches = parseMatchesFromMessage(message);
      return {
        message: "Matches found!",
        matches
      };
    }

    return {
      message
    };

  } catch (error) {
    console.error('Error submitting dog report:', error);
    throw error;
  }
};

// Helper function to parse matches from the TwiML-like response
function parseMatchesFromMessage(message: string): any[] {
  const matches = [];
  const sections = message.split('\n\n').slice(1); // Skip header

  for (const section of sections) {
    if (!section.trim()) continue;

    const descriptionMatch = section.match(/📍 \*Description\*: (.*)/);
    const phoneMatch = section.match(/📞 \*Phone\*: (.*)/);
    const locationMatch = section.match(/🌍 \*Location\*: (.*),(.*)/);
    const imageMatch = section.match(/🖼️ Image: .*\/uploads\/(.*)/);

    if (descriptionMatch && phoneMatch && locationMatch && imageMatch) {
      matches.push({
        _id: Math.random().toString(36).substr(2, 9),
        text: descriptionMatch[1],
        phone: phoneMatch[1],
        lat: parseFloat(locationMatch[1]),
        lon: parseFloat(locationMatch[2]),
        image_name: imageMatch[1],
        score: 1.0
      });
    }
  }

  return matches;
}
