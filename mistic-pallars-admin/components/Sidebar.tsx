// Sidebar de navegació
// Data: 2025-08-13

'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  ScrollText, 
  Users, 
  MapPin, 
  BarChart3, 
  Mountain,
  Settings
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Llegendes', href: '/llegendes', icon: ScrollText },
  { name: 'Usuaris', href: '/usuaris', icon: Users },
  { name: 'Mapa', href: '/mapa', icon: MapPin },
  { name: 'Estadístiques', href: '/estadistiques', icon: BarChart3 },
  { name: 'Configuració', href: '/configuracio', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
      <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white border-r border-gray-200 px-6 py-4">
        <div className="flex h-16 shrink-0 items-center">
          <div className="flex items-center">
            <div className="inline-flex items-center justify-center w-10 h-10 bg-primary-100 rounded-lg mr-3">
              <Mountain className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">Mistic Pallars</h1>
              <p className="text-xs text-gray-500">Administració</p>
            </div>
          </div>
        </div>
        
        <nav className="flex flex-1 flex-col">
          <ul role="list" className="flex flex-1 flex-col gap-y-7">
            <li>
              <ul role="list" className="-mx-2 space-y-1">
                {navigation.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className={`
                          group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-medium transition-colors
                          ${
                            isActive
                              ? 'bg-primary-50 text-primary-700'
                              : 'text-gray-700 hover:text-primary-700 hover:bg-gray-50'
                          }
                        `}
                      >
                        <item.icon
                          className={`h-5 w-5 shrink-0 ${
                            isActive ? 'text-primary-600' : 'text-gray-400 group-hover:text-primary-600'
                          }`}
                          aria-hidden="true"
                        />
                        {item.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}