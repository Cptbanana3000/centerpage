'use client';

import { CreditPacks } from '@/components/pricing/CreditPacks';
import { useRouter } from 'next/navigation';

export default function PurchaseCreditsPage() {
  const router = useRouter();

  const handleClose = () => {
    router.back();
  };

  return <CreditPacks onClose={handleClose} />;
} 