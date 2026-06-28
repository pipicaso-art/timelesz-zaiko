export const size = { width: 32, height: 32 };
export const contentType = 'image/svg+xml';

export default function Icon() {
  return new Response(
    `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
      <rect width="32" height="32" rx="6" fill="#2DD4BF"/>
      <text x="16" y="23" text-anchor="middle" font-family="Arial" font-size="16" font-weight="bold" fill="white">tz</text>
    </svg>`,
    { headers: { 'Content-Type': 'image/svg+xml' } }
  );
}
