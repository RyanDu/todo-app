import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { CategoryTrie } from '../utils/CategoriesTrie';

export type CategoryDto = { id: number; categoryTitle: string };
type Paged<T> = { total: number; items: T[]; page: number; pageSize: number };

type Ctx = {
  trie: CategoryTrie;
  categories: CategoryDto[];
  refresh: () => Promise<void>;
  addCategory: (name: string) => Promise<CategoryDto>;
  renameCategory: (id: number, newName: string) => Promise<void>;
  deleteCategory: (id: number) => Promise<void>;
};

const CategoryCtx = createContext<Ctx | null>(null);

export function CategoryProvider({ children }: { children: React.ReactNode }) {
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const trie = useMemo(() => new CategoryTrie(), []);

  const hydrate = (list: CategoryDto[]) => {
    
    const fresh = new CategoryTrie();
    for (const c of list) {
      if (c && typeof c.id === 'number' && typeof c.categoryTitle === 'string') {
        fresh.insert(c.categoryTitle, c.id);
      }
    }
    
    (trie as any).root = (fresh as any).root;
    (trie as any).nameToId = (fresh as any).nameToId;
  };

  const refresh = async () => {
    const res = await fetch('/api/categories?page=1&pageSize=100');
    if (!res.ok) {
      console.error('fetch /api/categories failed:', res.status, await res.text());
      return;
    }
    const data = (await res.json()) as Paged<CategoryDto>;
    const items = Array.isArray(data.items) ? data.items : [];
    setCategories(items);
    hydrate(items);
  };

  useEffect(() => { void refresh(); }, []);

  const addCategory = async (name: string) => {
    const res = await fetch('/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ categoryTitle: name }),
    });
    if (!res.ok) {
      console.error('POST /api/categories failed:', res.status, await res.text());
      throw new Error('Create category failed');
    }
    const created = (await res.json()) as CategoryDto;
    setCategories(prev => {
      const next = [...prev, created];
      trie.insert(created.categoryTitle, created.id);
      return next;
    });
    return created;
  };

  const renameCategory = async (id: number, newName: string) => {
    const res = await fetch(`/api/categories/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, categoryTitle: newName }),
    });
    if (!res.ok) {
      console.error('PUT /api/categories failed:', res.status, await res.text());
      throw new Error('Rename category failed');
    }
    setCategories(prev => {
      const old = prev.find(c => c.id === id);
      const next = prev.map(c => (c.id === id ? { ...c, categoryTitle: newName } : c));
      if (old) {
        trie.remove(old.categoryTitle);
      }
      trie.insert(newName, id);
      return next;
    });
  };

  const deleteCategory = async (id: number) => {
    const res = await fetch(`/api/categories/${id}`, { method: 'DELETE' });
    if (!res.ok) {
      console.error('DELETE /api/categories failed:', res.status, await res.text());
      throw new Error('Delete category failed');
    }
    setCategories(prev => {
      const old = prev.find(c => c.id === id);
      const next = prev.filter(c => c.id !== id);
      if (old) {
        trie.remove(old.categoryTitle);
      }
      return next;
    });
  };

  const value: Ctx = { trie, categories, refresh, addCategory, renameCategory, deleteCategory };

  return <CategoryCtx.Provider value={value}>{children}</CategoryCtx.Provider>;
}

export const useCategoryIndex = (): Ctx => {
  const ctx = useContext(CategoryCtx);
  if (!ctx) throw new Error('useCategoryIndex must be used within CategoryProvider');
  return ctx;
};
