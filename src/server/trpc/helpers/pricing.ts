export function calculatePrices(poolYes: number, poolNo: number) {
  const yes = Number(poolYes) || 0;
  const no = Number(poolNo) || 0;
  const total = yes + no;
  if (total === 0) {
    return { priceYes: 0.5, priceNo: 0.5 };
  }
  const priceYes = yes / total;
  const priceNo = no / total;
  return { priceYes, priceNo };
}
