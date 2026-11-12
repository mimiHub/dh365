import { QuoteDetailPage } from '@/views/quote/QuoteDetailPage';
import { BOARDS } from '@/views/quote/boards';

export default function Page() {
  return <QuoteDetailPage board={BOARDS.design} />;
}
