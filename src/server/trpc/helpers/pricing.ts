export function calculatePrices(poolYes: number, poolNo: number) {
  const total = Number(poolYes) + Number(poolNo);
  if (total === 0) {
    return { priceYes: 0.5, priceNo: 0.5 };
  }
  const priceYes = Number(poolNo) / total;
  const priceNo = Number(poolYes) / total;
  return { priceYes, priceNo };
}

export function calculatePayout(
  totalPool: number,
  winnerPool: number,
  amount: number
): number {
  if (winnerPool <= 0) {
    return 0;
  }
  return Number(amount) * (Number(totalPool) / Number(winnerPool));
}

