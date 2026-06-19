"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { LayoutDashboard, Package, BarChart3, Image as ImageIcon, LogOut, Plus, Search, ChevronDown, Trash2, Edit, Save, X, Share2, Check } from 'lucide-react';

const API = '/api/admin/products';
const PWD_KEY = 'fs_admin_pwd';
const CATEGORY_OPTIONS = ['Camisetas', 'Moletons', 'Acessórios', 'Oversized'];

export default function AdminPage() {
  const [mobile, setMobile] = useState(false);
  const [password, setPassword] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState<any>(null);
  const [success, setSuccess] = useState('');
  const [tab, setTab] = useState<'produtos' | 'relatorios' | 'arte'>('produtos');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCat, setFilterCat] = useState('');
  const router = useRouter();

  useEffect(() => {
    setMobile(window.innerWidth <= 768);
    const handler = () => setMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handler);
    const savedToken = localStorage.getItem(PWD_KEY);
    if (savedToken) setLoggedIn(true);
    return () => window.removeEventListener('resize', handler);
  }, []);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const r = await fetch(API);
      if (!r.ok) throw new Error('Falha ao carregar produtos');
      const data = await r.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (loggedIn) fetchProducts();
  }, [loggedIn, fetchProducts]);

  const handleLogin = async () => {
    // Implement simple login logic or check against env/api
    if (password === 'admin123') { // Simple placeholder
      localStorage.setItem(PWD_KEY, 'fractalsys-admin-token');
      setLoggedIn(true);
      setError('');
    } else {
      setError('Senha incorreta');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem(PWD_KEY);
    setLoggedIn(false);
    router.push('/');
  };

  const handleSave = async (product: any) => {
    try {
      const isNew = !product.id;
      const r = await fetch(API, {
        method: isNew ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product)
      });
      if (!r.ok) throw new Error('Falha ao salvar produto');
      setSuccess(isNew ? 'Produto criado!' : 'Produto atualizado!');
      setEditing(null);
      fetchProducts();
    } catch (e: any) {
      setError(e.message);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Deseja excluir este produto?')) return;
    try {
      const r = await fetch(`${API}?id=${id}`, { method: 'DELETE' });
      if (!r.ok) throw new Error('Falha ao excluir');
      setSuccess('Produto excluído!');
      fetchProducts();
    } catch (e: any) {
      setError(e.message);
    }
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = !filterCat || (p.categories || '').includes(filterCat);
    return matchesSearch && matchesCat;
  });

  if (!loggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] text-white font-mono p-4">
        <div className="w-full max-w-md p-8 border border-cyan-500/30 bg-zinc-900/50 backdrop-blur-xl rounded-2xl">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-cyan-500/10 border border-cyan-500 rounded-2xl flex items-center justify-center mb-4">
              <LayoutDashboard className="text-cyan-400" size={32} />
            </div>
            <h1 className="text-2xl font-bold tracking-tighter text-cyan-400">ADMIN PANEL</h1>
            <p className="text-zinc-500 text-sm">FractalSyS Store Management</p>
          </div>
          
          {error && <div className="p-3 mb-4 bg-red-500/10 border border-red-500/50 text-red-500 text-sm rounded-lg text-center">{error}</div>}
          
          <div className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-widest text-zinc-500 mb-2">Access Key</label>
              <input 
                type="password" 
                placeholder="••••••••" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleLogin()}
                className="w-full bg-black/50 border border-zinc-800 rounded-xl px-4 py-3 text-cyan-400 focus:outline-none focus:border-cyan-500/50 transition-all"
              />
            </div>
            <button 
              onClick={handleLogin}
              className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 rounded-xl transition-all shadow-[0_0_20px_rgba(8,145,178,0.3)]"
            >
              INITIALIZE SESSION
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-300 font-sans">
      {/* Sidebar / Topbar */}
      <header className="border-b border-zinc-800 bg-black/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-cyan-500/10 border border-cyan-500/50 rounded-lg flex items-center justify-center">
              <LayoutDashboard className="text-cyan-400" size={18} />
            </div>
            <span className="font-bold tracking-tight text-white">Fractal<span className="text-cyan-400">Store</span> Admin</span>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="bg-zinc-800 text-zinc-400 text-[10px] px-2 py-1 rounded-full uppercase tracking-widest font-bold">Production Mode</span>
            <button onClick={handleLogout} className="text-zinc-500 hover:text-red-400 transition-colors">
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Navigation Tabs */}
        <div className="flex bg-zinc-900/50 border border-zinc-800 p-1 rounded-2xl mb-8 w-fit">
          <button 
            onClick={() => setTab('produtos')}
            className={`flex items-center gap-2 px-6 py-2 rounded-xl transition-all ${tab === 'produtos' ? 'bg-cyan-600 text-white shadow-lg' : 'hover:bg-zinc-800 text-zinc-500'}`}
          >
            <Package size={18} />
            <span className="font-medium">Inventory</span>
          </button>
          <button 
            onClick={() => setTab('relatorios')}
            className={`flex items-center gap-2 px-6 py-2 rounded-xl transition-all ${tab === 'relatorios' ? 'bg-cyan-600 text-white shadow-lg' : 'hover:bg-zinc-800 text-zinc-500'}`}
          >
            <BarChart3 size={18} />
            <span className="font-medium">Analytics</span>
          </button>
          <button 
            onClick={() => setTab('arte')}
            className={`flex items-center gap-2 px-6 py-2 rounded-xl transition-all ${tab === 'arte' ? 'bg-cyan-600 text-white shadow-lg' : 'hover:bg-zinc-800 text-zinc-500'}`}
          >
            <ImageIcon size={18} />
            <span className="font-medium">Art Engine</span>
          </button>
        </div>

        {success && <div className="p-4 mb-6 bg-green-500/10 border border-green-500/50 text-green-400 rounded-xl flex justify-between items-center animate-in fade-in slide-in-from-top-4">
          <div className="flex items-center gap-2"><Check size={18} /> {success}</div>
          <button onClick={() => setSuccess('')}><X size={18} /></button>
        </div>}

        {tab === 'produtos' && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
              <div className="flex flex-wrap gap-3 w-full md:w-auto">
                <div className="relative flex-1 md:w-80">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                  <input 
                    type="text" 
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 outline-none focus:border-cyan-500/50 transition-all"
                  />
                </div>
                <select 
                  value={filterCat}
                  onChange={(e) => setFilterCat(e.target.value)}
                  className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 outline-none focus:border-cyan-500/50 text-zinc-400 transition-all appearance-none pr-10 relative cursor-pointer"
                >
                  <option value="">All Categories</option>
                  {CATEGORY_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <button 
                onClick={() => setEditing({})}
                className="bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(8,145,178,0.2)]"
              >
                <Plus size={18} /> NEW PRODUCT
              </button>
            </div>

            {editing && (
              <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm shadow-2xl">
                <div className="w-full max-w-4xl bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden animate-in zoom-in-95 fade-in duration-200">
                  <div className="px-8 py-6 border-b border-zinc-800 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-white uppercase tracking-tight">{editing.id ? 'Edit Product' : 'Register New Hardware'}</h2>
                    <button onClick={() => setEditing(null)} className="text-zinc-500 hover:text-white"><X size={24} /></button>
                  </div>
                  <div className="p-8 max-h-[70vh] overflow-y-auto">
                    <ProductForm product={editing} onSave={handleSave} onCancel={() => setEditing(null)} />
                  </div>
                </div>
              </div>
            )}

            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 text-zinc-500 italic">
                <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                Syncing sequence...
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-20 border border-dashed border-zinc-800 rounded-3xl">
                <Package size={48} className="mx-auto text-zinc-700 mb-4" />
                <p className="text-zinc-500">No active entities found in current sector.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((p) => (
                  <div key={p.id} className="group bg-zinc-900/30 border border-zinc-800 hover:border-cyan-500/50 rounded-2xl overflow-hidden transition-all duration-300">
                    <div className="aspect-square bg-zinc-800 relative group-hover:opacity-80 transition-opacity flex items-center justify-center p-4">
                      {p.image ? (
                        <img src={p.image} alt={p.name} className="w-full h-full object-contain" />
                      ) : (
                        <ImageIcon size={48} className="text-zinc-700" />
                      )}
                    </div>
                    <div className="p-5">
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-widest">{p.categories || 'Hardware'}</span>
                        <span className="text-zinc-500 text-[10px] font-mono">ID: {p.id}</span>
                      </div>
                      <h3 className="text-white font-bold truncate mb-3">{p.name}</h3>
                      <div className="flex items-center justify-between mt-auto">
                        <span className="text-xl font-bold text-white font-mono">{p.price}</span>
                        <div className="flex gap-2">
                          <button onClick={() => setEditing(p)} className="p-2 bg-zinc-800 hover:bg-cyan-500/20 text-zinc-400 hover:text-cyan-400 rounded-lg transition-all"><Edit size={16} /></button>
                          <button onClick={() => handleDelete(p.id)} className="p-2 bg-zinc-800 hover:bg-red-500/20 text-zinc-400 hover:text-red-400 rounded-lg transition-all"><Trash2 size={16} /></button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === 'relatorios' && <div className="text-center py-20 text-zinc-600 uppercase tracking-widest font-bold border border-zinc-800 rounded-3xl">Analytics Module Offline. Connecting to Neural Bridge...</div>}
        {tab === 'arte' && <div className="text-center py-20 text-zinc-600 uppercase tracking-widest font-bold border border-zinc-800 rounded-3xl">Art Generator initializing...</div>}
      </main>
    </div>
  );
}

function ProductForm({ product, onSave, onCancel }: { product: any, onSave: (p: any) => void, onCancel: () => void }) {
  const [form, setForm] = useState({
    ...product,
    images: product.images ? (typeof product.images === 'string' ? JSON.parse(product.images) : product.images) : []
  });

  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setForm((f: any) => ({ ...f, [name]: value }));
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) return;
    
    setUploading(true);
    try {
      const file = event.target.files[0];
      const response = await fetch(`/api/upload?filename=${file.name}`, {
        method: 'POST',
        body: file,
      });

      if (!response.ok) throw new Error('Falha no upload');
      
      const newBlob = await response.json();
      
      // Se não tem imagem principal, define esta como principal
      if (!form.image) {
        setForm((f: any) => ({ ...f, image: newBlob.url }));
      } else {
        setForm((f: any) => ({ ...f, images: [...f.images, newBlob.url] }));
      }
    } catch (error) {
      alert('Erro ao fazer upload da imagem');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = (idx: number) => {
    const next = [...form.images];
    next.splice(idx, 1);
    setForm((f: any) => ({ ...f, images: next }));
  };

  const inputClass = "w-full bg-black/30 border border-zinc-800 rounded-xl px-4 py-3 text-white outline-none focus:border-cyan-500/50 transition-all placeholder:text-zinc-700";
  const labelClass = "block text-[10px] uppercase tracking-widest text-zinc-500 mb-2 font-bold";

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className={labelClass}>Entity Name</label>
          <input name="name" value={form.name || ''} onChange={handleChange} className={inputClass} placeholder="e.g. Fractal Core Tee" />
        </div>
        <div>
          <label className={labelClass}>Access Slug</label>
          <input name="slug" value={form.slug || ''} onChange={handleChange} className={inputClass} placeholder="fractal-core-tee" />
        </div>
        <div>
          <label className={labelClass}>Sector / Brand</label>
          <input name="brand" value={form.brand || ''} onChange={handleChange} className={inputClass} placeholder="FractalSyS Wear" />
        </div>
        <div>
          <label className={labelClass}>Class / Categories</label>
          <input name="categories" value={form.categories || ''} onChange={handleChange} className={inputClass} placeholder="Camisetas" />
        </div>
        <div>
          <label className={labelClass}>Credit Value (Price)</label>
          <input name="price" value={form.price || ''} onChange={handleChange} className={inputClass} placeholder="R$ 119,90" />
        </div>
        <div>
          <label className={labelClass}>Discount Percent (%)</label>
          <input name="off" type="number" value={form.off || 0} onChange={handleChange} className={inputClass} />
        </div>
      </div>

      <div>
        <label className={labelClass}>Visual Assets (Imagens)</label>
        <div className="flex flex-wrap gap-4 mb-4">
          <div 
            onClick={() => !uploading && fileInputRef.current?.click()}
            className={`w-32 h-32 border-2 border-dashed border-zinc-800 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-cyan-500/50 hover:bg-cyan-500/5 transition-all text-zinc-500 hover:text-cyan-400 ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {uploading ? (
              <div className="w-6 h-6 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <Plus size={24} />
                <span className="text-[10px] mt-2 font-bold uppercase">Upload</span>
              </>
            )}
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileUpload} 
              className="hidden" 
              accept="image/*"
            />
          </div>

          {form.image && (
            <div className="relative w-32 h-32 bg-zinc-900 rounded-2xl overflow-hidden border border-cyan-500/30 group">
              <img src={form.image} alt="Main" className="w-full h-full object-cover" />
              <div className="absolute top-1 left-1 bg-cyan-600 text-[8px] text-white px-1.5 py-0.5 rounded-full font-bold uppercase">Principal</div>
              <button 
                onClick={() => setForm((f: any) => ({ ...f, image: '' }))}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              ><X size={12} /></button>
            </div>
          )}

          {form.images.map((img: string, i: number) => (
            <div key={i} className="relative w-32 h-32 bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800 group">
              <img src={img} alt={`Asset ${i}`} className="w-full h-full object-cover" />
              <button 
                onClick={() => handleRemoveImage(i)}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              ><X size={12} /></button>
            </div>
          ))}
        </div>
      </div>

      <div>
        <label className={labelClass}>Technical Description</label>
        <textarea name="description" value={form.description || ''} onChange={handleChange} className={inputClass} rows={3} placeholder="Arte digital, fractais e tecnologia..." />
      </div>

      <div className="flex justify-end gap-4 pt-8">
        <button onClick={onCancel} className="px-8 py-3 text-zinc-500 hover:text-white transition-colors">ABORT</button>
        <button 
          onClick={() => onSave({ ...form, images: JSON.stringify(form.images) })}
          className="bg-cyan-600 hover:bg-cyan-500 text-white px-10 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(8,145,178,0.2)]"
        >
          <Save size={18} /> SECURE DATA
        </button>
      </div>
    </div>
  );
}
