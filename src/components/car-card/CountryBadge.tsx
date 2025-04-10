
import { Badge } from "@/components/ui/badge";

interface CountryBadgeProps {
  country?: string;
}

const CountryBadge = ({ country }: CountryBadgeProps) => {
  if (!country) return null;
  
  return (
    <Badge className="bg-green-600">{country}</Badge>
  );
};

export default CountryBadge;
