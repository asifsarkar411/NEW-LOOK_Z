import '@/styles/globals.css';
import { StoreProvider } from '@/context/StoreContext';
import StorefrontLayoutWrapper from '@/components/StorefrontLayoutWrapper';
import dbConnect from '@/lib/mongodb';
import Category from '@/models/Category';
import Setting from '@/models/Setting';

export const metadata = {
  title: 'NEW LOOK_Z | Trending Lifestyle & Fashion Store',
  description:
    'Discover the latest in mens fashion, womens fashion, footwear, leather belts, wallets, and accessories at NEW LOOK_Z.',
  keywords: 'fashion, online shopping, bd ecommerce, mens fashion, womens fashion, new look z',
};

async function getLayoutData() {
  try {
    await dbConnect();
    const [categories, setting] = await Promise.all([
      Category.find({}).sort({ order: 1, createdAt: 1 }).lean(),
      Setting.findOne({}).lean(),
    ]);

    return {
      categories: JSON.parse(JSON.stringify(categories || [])),
      setting: JSON.parse(JSON.stringify(setting || {})),
    };
  } catch (error) {
    console.error('Error fetching layout data:', error);
    return { categories: [], setting: {} };
  }
}

export default async function RootLayout({ children }) {
  const { categories, setting } = await getLayoutData();

  return (
    <html lang="en">
      <head>
        <link rel="icon" href="https://img.icons8.com/color/96/shopping-bag.png" />
      </head>
      <body>
        <StoreProvider>
          <StorefrontLayoutWrapper categories={categories} setting={setting}>
            {children}
          </StorefrontLayoutWrapper>
        </StoreProvider>
      </body>
    </html>
  );
}
