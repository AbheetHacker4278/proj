import { SHA256 } from 'crypto-js';

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function getAvatarColor(identifier: string): string {
  const hash = SHA256(identifier).toString();
  const hue = parseInt(hash.substr(0, 8), 16) % 360;
  return `hsl(${hue}, 70%, 50%)`;
}

