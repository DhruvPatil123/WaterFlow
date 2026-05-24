import React from 'react';
import * as Lucide from 'lucide-react';

interface DynamicIconProps {
  name: string;
  className?: string;
  size?: number;
}

export const DynamicIcon: React.FC<DynamicIconProps> = ({ name, className = "", size = 24 }) => {
  // Gracefully fallback to a generic spark icon if string is unknown or empty
  const IconComponent = (Lucide as any)[name] || Lucide.Sparkles;
  
  return <IconComponent className={className} size={size} />;
};

export default DynamicIcon;
