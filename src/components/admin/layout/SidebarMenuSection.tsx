
import React from 'react';
import { Button } from '@/components/ui/button';
import { LucideIcon } from 'lucide-react';

export type MenuItemType = {
  icon: LucideIcon;
  title: string;
  path: string;
  badge?: number;
};

type SidebarMenuSectionProps = {
  title: string;
  items: MenuItemType[];
  onItemClick: (e: React.MouseEvent<HTMLAnchorElement>, path: string) => void;
  isActive: (path: string) => boolean;
  isMobile?: boolean;
};

export const SidebarMenuSection: React.FC<SidebarMenuSectionProps> = ({
  title,
  items,
  onItemClick,
  isActive,
  isMobile = false
}) => {
  if (isMobile) {
    return (
      <div className="mb-4">
        <h3 className="text-sm font-medium text-muted-foreground mb-2 px-2">{title}</h3>
        <div className="space-y-1">
          {items.map((item) => (
            <Button 
              key={item.path}
              variant={isActive(item.path) ? 'secondary' : 'ghost'} 
              className="w-full justify-start" 
              onClick={(e) => onItemClick(e as any, item.path)}
            >
              <item.icon className="h-5 w-5 mr-2" />
              <span>{item.title}</span>
              {item.badge && item.badge > 0 && (
                <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                  {item.badge}
                </span>
              )}
            </Button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="inline-flex space-x-1">
      {items.map(item => (
        <Button
          key={item.path}
          variant={isActive(item.path) ? 'secondary' : 'ghost'}
          size="sm"
          className="relative"
          onClick={(e) => onItemClick(e as any, item.path)}
        >
          <item.icon className="h-4 w-4 mr-2" />
          <span>{item.title}</span>
          {item.badge && item.badge > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
              {item.badge}
            </span>
          )}
        </Button>
      ))}
    </div>
  );
};
