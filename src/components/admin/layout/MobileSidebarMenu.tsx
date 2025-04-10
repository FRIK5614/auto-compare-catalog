
import React from 'react';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { SidebarMenuSection, MenuItemType } from './SidebarMenuSection';

type MobileSidebarMenuProps = {
  menuSections: {
    title: string;
    items: MenuItemType[];
  }[];
  onItemClick: (e: React.MouseEvent<HTMLAnchorElement>, path: string) => void;
  onLogout: () => void;
  isActive: (path: string) => boolean;
};

export const MobileSidebarMenu: React.FC<MobileSidebarMenuProps> = ({
  menuSections,
  onItemClick,
  onLogout,
  isActive
}) => {
  return (
    <div className="space-y-6">
      {menuSections.map((section, idx) => (
        <SidebarMenuSection
          key={idx}
          title={section.title}
          items={section.items}
          onItemClick={onItemClick}
          isActive={isActive}
          isMobile={true}
        />
      ))}

      <div className="mt-6">
        <Button 
          variant="default" 
          className="w-full" 
          onClick={onLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Выйти
        </Button>
      </div>
    </div>
  );
};
