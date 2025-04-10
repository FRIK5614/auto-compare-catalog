
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload } from "lucide-react";

interface CarFormImageProps {
  imagePreview: string | null;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const CarFormImage = ({ imagePreview, handleImageUpload }: CarFormImageProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Изображение</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {imagePreview && (
          <div className="mb-4">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-full h-48 object-cover rounded-md"
            />
          </div>
        )}
        <Label htmlFor="image" className="cursor-pointer">
          <Button variant="outline" className="w-full" asChild>
            <div>
              <Upload className="h-4 w-4 mr-2" />
              Загрузить изображение
            </div>
          </Button>
          <Input
            id="image"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </Label>
      </CardContent>
    </Card>
  );
};

export default CarFormImage;
