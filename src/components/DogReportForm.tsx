import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { useGeolocation } from '@/hooks/use-geolocation';
import { DogReport } from '@/types/dog';
import LeafletMap from './LeafletMap';

interface DogReportFormProps {
  onSubmit: (data: DogReport) => Promise<void>;
  isSubmitting: boolean;
}

const DogReportForm = ({ onSubmit, isSubmitting }: DogReportFormProps) => {
  const { toast } = useToast();
  const { latitude, longitude, loading: loadingLocation, error: locationError } = useGeolocation();
  
  const [formData, setFormData] = useState<DogReport>({
    status: 'lost',
    description: '',
    location: {
      lat: 0,
      lon: 0
    },
    phone: '',
    image: undefined
  });
  
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [locationChanged, setLocationChanged] = useState(false);

  // Update location when geolocation is available
  useEffect(() => {
    if (latitude && longitude && !locationChanged) {
      setFormData(prev => ({
        ...prev,
        location: {
          lat: latitude,
          lon: longitude
        }
      }));
    }
  }, [latitude, longitude, locationChanged]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleStatusChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      status: value as 'lost' | 'found'
    }));
  };

  const handleLocationChange = (lat: number, lng: number) => {
    setLocationChanged(true);
    setFormData(prev => ({
      ...prev,
      location: {
        lat,
        lon: lng
      }
    }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (file) {
      if (file.type.startsWith('image/')) {
        setFormData(prev => ({
          ...prev,
          image: file
        }));
        
        // Create preview
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewUrl(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        toast({
          title: "Invalid file type",
          description: "Please select an image file",
          variant: "destructive"
        });
      }
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.description) {
      toast({
        title: "Missing description",
        description: "Please provide a description of the dog",
        variant: "destructive"
      });
      return;
    }
    
    if (!formData.phone) {
      toast({
        title: "Missing phone number",
        description: "Please provide a contact phone number",
        variant: "destructive"
      });
      return;
    }
    
    if (!formData.image) {
      toast({
        title: "Missing image",
        description: "Please upload an image of the dog",
        variant: "destructive"
      });
      return;
    }
    
    // Use current location if not manually set and coordinates are available
    if (formData.location.lat === 0 && formData.location.lon === 0) {
      if (latitude && longitude) {
        setFormData(prev => ({
          ...prev,
          location: {
            lat: latitude,
            lon: longitude
          }
        }));
        // Submit with the updated location
        onSubmit({
          ...formData,
          location: {
            lat: latitude,
            lon: longitude
          }
        });
        return;
      } else {
        toast({
          title: "Missing location",
          description: "Please provide a location or enable location services",
          variant: "destructive"
        });
        return;
      }
    }
    
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="status">Dog Status</Label>
          <RadioGroup 
            value={formData.status} 
            onValueChange={handleStatusChange}
            className="flex space-x-4 mt-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="lost" id="lost" />
              <Label htmlFor="lost" className="font-normal cursor-pointer">I Lost My Dog</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="found" id="found" />
              <Label htmlFor="found" className="font-normal cursor-pointer">I Found A Dog</Label>
            </div>
          </RadioGroup>
        </div>
        
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea 
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder={`Please describe the dog (breed, color, size, distinguishing features, etc.)`}
            className="min-h-[120px]"
          />
        </div>
        
        <div>
          <Label htmlFor="phone">Contact Phone Number</Label>
          <Input 
            id="phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="Your contact number"
          />
        </div>
        
        <div>
          <Label htmlFor="location">Location</Label>
          <div className="h-[300px] rounded-md overflow-hidden border mt-2">
            {(latitude || longitude || locationChanged) ? (
              <LeafletMap 
                center={[formData.location.lat || latitude || 0, formData.location.lon || longitude || 0]}
                onChange={handleLocationChange}
              />
            ) : (
              <div className="h-full flex items-center justify-center bg-muted">
                {loadingLocation ? (
                  <p>Loading location...</p>
                ) : (
                  <p className="text-muted-foreground">
                    {locationError || "Location unavailable. Please allow location access."}
                  </p>
                )}
              </div>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-1">Drag the marker to adjust the exact location</p>
        </div>
        
        <div>
          <Label htmlFor="image">Dog Photo</Label>
          <div className="mt-2">
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="cursor-pointer"
            />
          </div>
          {previewUrl && (
            <div className="mt-4">
              <img 
                src={previewUrl} 
                alt="Dog preview" 
                className="max-h-[200px] rounded-lg object-cover"
              />
            </div>
          )}
        </div>
      </div>
      
      <Button 
        type="submit" 
        className="w-full bg-pawmatch-purple hover:bg-pawmatch-purple/90" 
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Submitting...' : `Submit ${formData.status === 'lost' ? 'Lost' : 'Found'} Dog Report`}
      </Button>
    </form>
  );
};

export default DogReportForm;
