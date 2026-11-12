import { QuoteWritePage } from '@/views/quote/QuoteWritePage';
import { BOARDS } from '@/views/quote/boards';

export default function Page() {
  return <QuoteWritePage board={BOARDS.design} />;
}
