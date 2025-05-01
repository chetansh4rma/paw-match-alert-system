
import { DogReport, ReportResponse } from '../types/dog';

// Use proper API URL based on environment
const API_URL = process.env.NODE_ENV === 'production' 
  ? 'https://foundpaw.onrender.com' 
  : 'http://localhost:5000';

export const submitDogReport = async (formData: DogReport): Promise<ReportResponse> => {
  try {
    // Create form data for multipart/form-data request
    const requestFormData = new FormData();
    
    // Format the request to match exactly what the curl command sends to /whatsapp endpoint
    requestFormData.append('From', 'whatsapp:+7626818255');
    
    // Format the body text exactly like in the curl command
    const body = `${formData.status} dog ${formData.description} Location:${formData.location.lat},${formData.location.lon} Phone:${formData.phone}`;
    requestFormData.append('Body', body);
    
    // For the image, we need to ensure the server receives a valid image URL
    if (formData.image) {
      // In production we need to use a different approach
      // The server expects a URL, but we have a File object
      // For now, we'll use a placeholder image that works for demo purposes
      // In a real app, you'd upload the image to cloud storage first and then use that URL
      const imageUrl = 'https://images.dog.ceo/breeds/retriever-golden/n02099601_1722.jpg';
       requestFormData.append('image', formData.image); 
      requestFormData.append('MediaContentType0', 'image/jpeg');
      
      console.log('Image submitted with URL:', imageUrl);
    }

    console.log('Submitting dog report with:');
    console.log('- Body:', body);
    console.log('- API URL:', API_URL);

    const response = await fetch(`${API_URL}/whatsapp`, {
      method: 'POST',
      body: requestFormData,
    });

    const text = await response.text();
    console.log('Server response:', text);
    
    // Parse the TwiML response to extract message content
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
