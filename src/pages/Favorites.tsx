
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FavoritesPanel from "@/components/FavoritesPanel";
import ComparePanel from "@/components/ComparePanel";

const Favorites = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 bg-auto-gray-50 py-8">
        <div className="container mx-auto px-4">
          <FavoritesPanel />
        </div>
      </div>
      <ComparePanel />
      <Footer />
    </div>
  );
};

export default Favorites;
