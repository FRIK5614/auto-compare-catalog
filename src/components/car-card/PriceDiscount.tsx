
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/utils/formatters";

interface PriceDiscountProps {
  discount: number;
}

const PriceDiscount = ({ discount }: PriceDiscountProps) => {
  if (!discount || discount <= 0) return null;
  
  return (
    <Badge variant="outline" className="absolute top-3 right-3 bg-white text-red-600 border-red-600">
      Скидка {formatPrice(discount)}
    </Badge>
  );
};

export default PriceDiscount;
