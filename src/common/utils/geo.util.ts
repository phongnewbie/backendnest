/**
 * Tính khoảng cách giữa hai tọa độ (Haversine formula)
 * @param lat1 Vĩ độ điểm 1
 * @param lon1 Kinh độ điểm 1
 * @param lat2 Vĩ độ điểm 2
 * @param lon2 Kinh độ điểm 2
 * @returns Khoảng cách tính bằng mét (m)
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const R = 6371e3; // Bán kính Trái Đất tính bằng mét
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}
