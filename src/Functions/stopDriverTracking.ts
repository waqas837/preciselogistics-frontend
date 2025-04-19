export function stopDriverTracking(interval: ReturnType<typeof setInterval>) {
  clearInterval(interval);
}
