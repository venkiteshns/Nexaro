export const formatDistance = function (metres) {
  if (!metres && metres !== 0) return null;
  if (metres < 1000) return `${Math.round(metres)} m away`;
  return `${(metres / 1000).toFixed(1)} km away`;
}