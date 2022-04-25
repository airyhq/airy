export function formatConversationCount(count: number): string {
  return Intl.NumberFormat('en-US').format(count);
}
