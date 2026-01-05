import React, { useMemo } from 'react';
import { useData } from '../hooks/useData';
import { Button } from '../components/ui/Button'; // Assuming Button component is used

// --- Type Definition Simulation (Should ideally come from src/types/global.d.ts) ---
interface MediaItem {
  id: number;
  title: string;
  category: string;
  description: string;
  rating: number;
  imageUrl: string;
}

interface DataResponse {
  data: MediaItem[] | undefined;
  isLoading: boolean;
  error: Error | null;
}

// --- Mock Data Generation ---
const generateMockData = (): MediaItem[] => {
  const categories = ['Trending Now', 'Recently Added', 'Action Thrillers', 'Comedies', 'Sci-Fi Adventures', 'Drama for You'];
  const data: MediaItem[] = [];
  let currentId = 1;

  for (let i = 0; i < 60; i++) {
    const categoryIndex = i % categories.length;
    data.push({
      id: currentId++,
      title: `ملف نتفلكس ${i + 1}`, // "Netflix File X"
      category: categories[categoryIndex],
      description: `وصف تفصيلي للفيلم أو المسلسل رقم ${i + 1}، محاكاة لمحتوى جذاب يشاهده الملايين الآن.`,
      rating: Math.floor(Math.random() * 50) / 10 + 3.5,
      // Using a consistent placeholder size for posters
      imageUrl: `https://picsum.photos/seed/${i * 123}/300/450`,
    });
  }
  return data;
};

// --- Helper Components ---

const MediaCard: React.FC<{ item: MediaItem }> = ({ item }) => (
  <div
    className="w-48 h-72 flex-shrink-0 cursor-pointer transition duration-300 transform hover:scale-110 hover:z-30 bg-gray-800 rounded overflow-hidden shadow-xl"
    role="img"
    aria-label={item.title}
  >
    <img
      src={item.imageUrl}
      alt={item.title}
      className="w-full h-full object-cover transition duration-300 group-hover:opacity-80"
    />
  </div>
);

const MediaRow: React.FC<{ title: string; items: MediaItem[] }> = ({ title, items }) => (
  <div className="mb-10">
    <h2 className="text-3xl font-bold text-white mb-4 px-8 pt-4">{title}</h2>
    <div className="flex overflow-x-scroll space-x-4 pb-4 px-8 scrollbar-hide">
      {items.map(item => (
        <MediaCard key={item.id} item={item} />
      ))}
    </div>
  </div>
);

const HeroSection: React.FC<{ featuredItem: MediaItem }> = ({ featuredItem }) => (
  <div
    className="relative h-[85vh] bg-cover bg-center flex items-end p-16"
    style={{ backgroundImage: `url(${featuredItem.imageUrl.replace('300/450', '1920/800')})` }}
  >
    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent"></div>
    <div className="relative z-10 max-w-3xl text-white">
      <p className="text-xl font-semibold text-red-500 mb-2">{featuredItem.category}</p>
      <h1 className="text-7xl font-extrabold mb-4 drop-shadow-lg" dir="rtl">{featuredItem.title}</h1>
      <p className="text-lg mb-8 line-clamp-3 text-gray-200" dir="rtl">{featuredItem.description}</p>
      <div className="flex space-x-4 space-x-reverse">
        <Button variant="primary" className="text-lg px-8 py-3">
          ▶ تشغيل
        </Button>
        <Button variant="secondary" className="text-lg px-8 py-3 bg-gray-600 bg-opacity-70">
          مزيد من المعلومات
        </Button>
      </div>
    </div>
  </div>
);

// --- Main Page Component ---

const HomePage: React.FC = () => {
  // Simulate fetching all 60 items
  const mockData = useMemo(() => generateMockData(), []);

  // In a real scenario, useData might handle filtering, but here we simulate the raw fetch.
  // We mock the return structure of useData hook.
  const { data, isLoading, error } = useData<MediaItem[]>('/api/netflix-catalogue', mockData) as DataResponse;

  // Group data by category
  const categorizedData = useMemo(() => {
    if (!data) return {};
    return data.reduce((acc, item) => {
      const categoryKey = item.category;
      if (!acc[categoryKey]) {
        acc[categoryKey] = [];
      }
      acc[categoryKey].push(item);
      return acc;
    }, {} as Record<string, MediaItem[]>);
  }, [data]);

  const categoryTitles = Object.keys(categorizedData);

  if (isLoading) {
    return <div className="bg-black text-white min-h-screen flex justify-center items-center text-2xl">جاري تحميل المحتوى...</div>;
  }

  if (error) {
    return <div className="bg-black text-red-500 min-h-screen p-10 text-center">خطأ في تحميل البيانات: {error.message}</div>;
  }

  if (!data || data.length === 0) {
    return <div className="bg-black text-white min-h-screen p-10 text-center text-xl">لا يوجد محتوى متاح حالياً.</div>;
  }

  // Ensure 60 items are always accounted for in the rows structure
  const featuredItem = data[0]; // Always use the first item as the feature

  return (
    <div className="min-h-screen bg-black text-white font-sans overflow-hidden">
      
      {/* Hero Section */}
      <HeroSection featuredItem={featuredItem} />

      {/* Content Rows - Shifted up */}
      <main className="pb-10 -mt-36 relative z-20">
        {categoryTitles.map((category) => (
          <MediaRow
            key={category}
            title={category}
            items={categorizedData[category]}
          />
        ))}

        {/* Example: If we wanted a single row showing the count */}
        {/* <div className="px-8 mt-10 text-gray-400">
            <p>Total items available: {data.length}</p> 
        </div> */}
      </main>
    </div>
  );
};

export default HomePage;