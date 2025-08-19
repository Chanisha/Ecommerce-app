import { fetchProductById } from '@/data/products';
import { notFound } from 'next/navigation';
import ProductDetailsWrapper from './ProductDetailsWrapper';
import RecentlyViewed from '@/components/RecentlyViewed'; // ✅ import it

export default async function ProductPage(props) {
  const { id } = (await props.params);
  const product = await fetchProductById(id);

  if (!product) {
    notFound();
  }

  return (
    <div className="p-8 bg-white rounded-lg shadow-xl">
      <ProductDetailsWrapper product={product} />

      <RecentlyViewed />
    </div>
  );
}
