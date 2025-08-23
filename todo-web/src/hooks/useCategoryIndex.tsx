// useCategoryIndex.ts
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { CategoryTrie } from '../utils/CategoriesTrie';

type Category = { id: number; name: string };

const CategoryCtx = createContext<{
  trie: CategoryTrie;
  categories: Category[];
  refresh: () => Promise<void>;
  addCategory: (name: string) => Promise<Category>;
  renameCategory: (id: number, newName: string) => Promise<void>;
  deleteCategory: (id: number) => Promise<void>;
} | null>(null);

export function CategoryProvider({ children }: { children: React.ReactNode }) {
  const [categories, setCategories] = useState<Category[]>([]);
  const trie = useMemo(() => new CategoryTrie(), []);

  const hydrate = (list: Category[]) => {
    trie.root = new CategoryTrie().root; // 轻量重建
    trie.nameToId.clear();
    list.forEach(c => trie.insert(c.name, c.id));
  };

  const refresh = async () => {
    const res = await fetch('/api/categories');
    const list: Category[] = await res.json();
    setCategories(list);
    hydrate(list);
  };

  useEffect(() => { refresh(); }, []);

  const addCategory = async (name: string) => {
    const res = await fetch('/api/categories', {
      method: 'POST', headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ name })
    });
    const created: Category = await res.json();
    setCategories(prev => {
      const next = [...prev, created];
      trie.insert(created.name, created.id);
      return next;
    });
    return created;
  };

  const renameCategory = async (id: number, newName: string) => {
    await fetch(`/api/categories/${id}`, {
      method: 'PUT', headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ id, name: newName })
    });
    setCategories(prev => {
      const old = prev.find(c => c.id === id);
      if (old) trie.remove(old.name);
      const next = prev.map(c => c.id === id ? { ...c, name: newName } : c);
      trie.insert(newName, id);
      return next;
    });
  };

  const deleteCategory = async (id: number) => {
    await fetch(`/api/categories/${id}`, { method: 'DELETE' });
    setCategories(prev => {
      const old = prev.find(c => c.id === id);
      if (old) trie.remove(old.name);
      return prev.filter(c => c.id !== id);
    });
  };

  return (
    <CategoryCtx.Provider value={{ trie, categories, refresh, addCategory, renameCategory, deleteCategory }}>
      {children}
    </CategoryCtx.Provider>
  );
}

export const useCategoryIndex = () => {
  const ctx = useContext(CategoryCtx);
  if (!ctx) throw new Error('useCategoryIndex must be used within CategoryProvider');
  return ctx;
};
