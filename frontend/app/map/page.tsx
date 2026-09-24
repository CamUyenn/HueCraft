import StreetViewClientWrapper from '@/features/map/StreetViewClientWrapper';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Bản Đồ 360° Street View | Tour Huế',
  description: 'Trải nghiệm khám phá các góc phố và làng nghề Cố đô Huế bằng chế độ xem phố 360 độ tương tác.',
};

export default function MapPage() {
  return <StreetViewClientWrapper />;
}
