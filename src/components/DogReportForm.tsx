
import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { useGeolocation } from '@/hooks/use-geolocation';
import { DogReport } from '@/types/dog';
import { MapPin, AlertCircle } from 'lucide-react';

interface DogReportFormProps {
  onSubmit: (data: DogReport) => Promise<void>;
  isSubmitting: boolean;
}

const DogReportForm = ({ onSubmit, isSubmitting }: DogReportFormProps) => {
  const { toast } = useToast();
  const { 
    latitude, 
    longitude, 
    loading: loadingLocation, 
    error: locationError, 
    permissionGranted,
    requestPermission 
  } = useGeolocation();
  
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

  // Request location permission when component loads
  useEffect(() => {
    requestPermission();
  }, [requestPermission]);

  // Update location when geolocation is available
  useEffect(() => {
    if (latitude && longitude) {
      setFormData(prev => ({
        ...prev,
        location: {
          lat: latitude,
          lon: longitude
        }
      }));
    }
  }, [latitude, longitude]);

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
    
    // Use current location if coordinates are available
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
          description: "Please enable location services",
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
          <Label htmlFor="location" className="flex items-center gap-2">
            <MapPin className="h-4 w-4" /> Location
          </Label>

          <div className="p-4 mt-2 border rounded-md bg-muted/40">
            {permissionGranted ? (
              <div className="flex flex-col space-y-2">
                <div className="flex items-center text-sm text-green-600">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  Location access granted
                </div>
                {latitude && longitude ? (
                  <p className="text-sm">
                    Using your current location: {latitude.toFixed(4)}, {longitude.toFixed(4)}
                  </p>
                ) : (
                  <p className="text-sm">Getting your location...</p>
                )}
              </div>
            ) : (
              <div className="flex flex-col space-y-3">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Location access needed</p>
                    <p className="text-xs text-muted-foreground">We need your location to help find nearby dogs</p>
                  </div>
                </div>
                <Button 
                  type="button" 
                  onClick={() => requestPermission()} 
                  variant="outline"
                  size="sm"
                  className="w-full"
                >
                  Allow location access
                </Button>
              </div>
            )}
          </div>
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
