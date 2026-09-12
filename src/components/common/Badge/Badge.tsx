import React from 'react';
import { Cloud, Crown, Leaf, Sparkles, Gem, Tag, LucideIcon } from 'lucide-react';
import './Badge.css';

const iconMap: Record<string, LucideIcon> = {
  cloud: Cloud,
  crown: Crown,
  leaf: Leaf,
  sparkles: Sparkles,
  gem: Gem,
  tag: Tag
};

export interface BadgeProps {
  label: string;
  iconName?: string;
  color?: string;
  bg?: string;
}

export default function Badge({
  label,
  iconName = 'tag',
  color = '#3B82F6',
  bg = 'rgba(224, 242, 254, 0.9)'
}: BadgeProps) {
  return (
    <div
      className="product-category-badge"
      style={{
        backgroundColor: bg,
        color: color,
        border: `1px solid ${color}33`
      }}
    >
      <span className="badge-dot" style={{ backgroundColor: color }} />
      <span>{label}</span>
    </div>
  );
}
