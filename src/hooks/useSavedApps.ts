import { useState, useEffect } from 'react';

export interface SavedApp {
  id: string;
  displayName: string;
  url: string;
  aliases?: string[];
  createdAt: number;
}

const STORAGE_KEY = 'jarvis_saved_apps';

export const useSavedApps = () => {
  const [apps, setApps] = useState<SavedApp[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setApps(JSON.parse(stored));
      } catch (error) {
        console.error('Error loading saved apps:', error);
      }
    }
  }, []);

  const saveToStorage = (newApps: SavedApp[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newApps));
    setApps(newApps);
  };

  const addApp = (displayName: string, url: string, aliases: string[] = []) => {
    const newApp: SavedApp = {
      id: `app_${Date.now()}`,
      displayName,
      url,
      aliases,
      createdAt: Date.now(),
    };
    saveToStorage([...apps, newApp]);
  };

  const deleteApp = (id: string) => {
    saveToStorage(apps.filter(app => app.id !== id));
  };

  const updateApp = (id: string, updates: Partial<SavedApp>) => {
    saveToStorage(apps.map(app => app.id === id ? { ...app, ...updates } : app));
  };

  const findAppByName = (name: string): SavedApp | null => {
    const lowerName = name.toLowerCase().trim();
    
    // Exact match first
    let found = apps.find(app => 
      app.displayName.toLowerCase() === lowerName
    );
    
    if (found) return found;
    
    // Check aliases
    found = apps.find(app => 
      app.aliases?.some(alias => alias.toLowerCase() === lowerName)
    );
    
    if (found) return found;
    
    // Partial match
    found = apps.find(app => 
      app.displayName.toLowerCase().includes(lowerName) ||
      lowerName.includes(app.displayName.toLowerCase())
    );
    
    return found || null;
  };

  return {
    apps,
    addApp,
    deleteApp,
    updateApp,
    findAppByName,
  };
};
