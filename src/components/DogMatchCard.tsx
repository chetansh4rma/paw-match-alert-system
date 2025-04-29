
import { DogMatch } from '@/types/dog';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface DogMatchCardProps {
  match: DogMatch;
}

const DogMatchCard = ({ match }: DogMatchCardProps) => {
  const openMap = () => {
    window.open(`https://www.google.com/maps/search/?api=1&query=${match.lat},${match.lon}`, '_blank');
  };

  const callPhone = () => {
    window.location.href = `tel:${match.phone}`;
  };

  const matchPercentage = Math.round(match.score * 100);

  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg">
      <div className="relative h-48">
        <img
          src={`http://localhost:5000/uploads/${match.image_name}`}
          alt="Dog"
          className="w-full h-full object-cover"
          onError={(e) => {
            // Fallback image if the server image fails to load
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1535268647677-300dbf3d78d1';
          }}
        />
        <div className="absolute top-2 right-2 bg-pawmatch-purple text-white rounded-full px-2 py-1 text-xs font-bold">
          {matchPercentage}% Match
        </div>
      </div>
      
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{match.text.split(' ').slice(0, 2).join(' ')}</CardTitle>
        <CardDescription className="line-clamp-2">{match.text}</CardDescription>
      </CardHeader>
      
      <CardContent className="pb-2">
        <div className="flex items-center space-x-1 text-sm text-gray-500">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="truncate">
            {match.lat.toFixed(3)}, {match.lon.toFixed(3)}
          </span>
        </div>
      </CardContent>
      
      <CardFooter className="pt-0 flex space-x-2">
        <Button 
          variant="outline" 
          className="flex-1 text-xs sm:text-sm border-pawmatch-purple text-pawmatch-purple hover:bg-pawmatch-purple/10"
          onClick={openMap}
        >
          View Location
        </Button>
        <Button 
          className="flex-1 text-xs sm:text-sm bg-pawmatch-purple hover:bg-pawmatch-purple/90"
          onClick={callPhone}
        >
          Call Owner
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DogMatchCard;
