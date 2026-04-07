import { usePOS } from '../../../hooks/usePOS';
import { useMode } from '../../../contexts/ModeContext';
import { useConfirm } from '../../../contexts/ConfirmContext';
import { useCategories } from '../../../hooks/useCategories';
import { productService } from '../../../services/product.service';
import { formatIDR } from '../../../utils/currency';
import AnimatedContent from '../../../components/ui/AnimatedContent';
import { ShoppingCart, Package, Plus, Minus, CreditCard, Search, X, PackagePlus, Settings2, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { createPortal } from 'react-dom';
import { toast } from 'sonner';

export default function MobilePOS() {
  const { mode } = useMode();
  const { confirmDialog } = useConfirm();
  const {
    products, cart, cartTotal, loading, error, refreshProducts,
    addToCart, updateCartItem, removeFromCart, clearCart, placeOrder,
  } = usePOS();
  const { categories } = useCategories();
  const isPersonal = mode === 'personal';
  const accentColor = isPersonal ? 'purple' : 'blue';
  const [search, setSearch] = useState('');
  const [showCart, setShowCart] = useState(false);
  const [placing, setPlacing] = useState(false);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditingMode, setIsEditingMode] = useState(false);
  const [formData, setFormData] = useState({ name: '', price: '', stock: '', category_id: '' });
  const [submitting, setSubmitting] = useState(false);

  const filteredProducts = products.filter(p =>
    p.name?.toLowerCase().includes(search.toLowerCase())
  );

  const cartCount = cart.reduce((s, c) => s + c.quantity, 0);

  const handlePlaceOrder = async () => {
    setPlacing(true);
    try {
      await placeOrder();
      setShowCart(false);
      toast.success('Pesanan berhasil dibayar!');
    } catch (err) {
      toast.error('Gagal memproses pesanan');
    } finally {
      setPlacing(false);
    }
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.category_id) return;
    setSubmitting(true);
    try {
      await productService.createProduct({
        ...formData,
        price: Number(formData.price),
        stock: Number(formData.stock) || 0,
        cost_price: 0
      });
      toast.success('Produk berhasil ditambahkan!');
      setIsModalOpen(false);
      setFormData({ name: '', price: '', stock: '', category_id: '' });
      await refreshProducts();
    } catch (err) {
      toast.error(typeof err === 'string' ? err : 'Gagal menambah produk');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteProduct = async (e, id) => {
    e.stopPropagation();
    confirmDialog({
      title: 'Hapus Produk',
      description: 'Yakin ingin menghapus produk ini dari katalog?',
      onConfirm: async () => {
        try {
          await productService.deleteProduct(id);
          toast.success('Produk dihapus');
          await refreshProducts();
          removeFromCart(id);
        } catch (err) {
          toast.error('Gagal menghapus produk');
        }
      }
    });
  };

  return (
    <div className="p-4 space-y-4 pb-24">
      <AnimatedContent direction="vertical" delay={0}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingCart className={`w-6 h-6 text-${accentColor}-600`} />
            <h1 className="text-xl font-bold">Kasir</h1>
          </div>
          <div className="flex border border-border rounded-xl overflow-hidden bg-card shadow-sm">
            <button 
              onClick={() => setIsEditingMode(!isEditingMode)}
              className={`flex items-center justify-center w-10 h-9 transition-colors ${isEditingMode ? `bg-${accentColor}-100 dark:bg-${accentColor}-900/30 text-${accentColor}-600` : 'hover:bg-accent text-muted-foreground'}`}
            >
              <Settings2 className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setIsModalOpen(true)}
              className={`flex items-center justify-center w-10 h-9 text-white bg-${accentColor}-600 hover:bg-${accentColor}-700 transition-colors border-l border-${accentColor}-700`}
            >
              <PackagePlus className="w-4 h-4" />
            </button>
          </div>
        </div>
      </AnimatedContent>

      <AnimatedContent direction="vertical" delay={100}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Cari produk..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
      </AnimatedContent>

      {loading ? (
        <div className="p-8 text-center text-muted-foreground text-sm">Memuat...</div>
      ) : error ? (
        <div className="p-8 text-center text-red-500 text-sm">Gagal memuat</div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {filteredProducts.map(product => {
            const inCart = cart.find(c => c.product_id === product.id);
            return (
              <div
                key={product.id}
                onClick={() => !isEditingMode && addToCart(product)}
                className={`relative bg-card border rounded-2xl p-3 shadow-sm transition-all ${inCart ? `border-${accentColor}-400 ring-1 ring-${accentColor}-400/30` : 'border-border'} ${isEditingMode ? 'cursor-default' : 'active:scale-[0.98]'}`}
              >
                {isEditingMode && (
                  <button 
                    onClick={(e) => handleDeleteProduct(e, product.id)}
                    className="absolute -top-2 -right-2 p-1.5 bg-red-100 text-red-600 rounded-full shadow-md z-10"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
                <div className="flex items-center justify-center w-full h-12 bg-muted rounded-xl mb-2">
                  <Package className="w-6 h-6 text-muted-foreground/40" />
                </div>
                <p className="font-semibold text-xs truncate">{product.name}</p>
                <div className="flex items-center justify-between mt-0.5">
                  <p className={`text-xs font-bold text-${accentColor}-600`}>{formatIDR(product.price)}</p>
                  {inCart && !isEditingMode && (
                    <span className={`text-[9px] font-bold text-white bg-${accentColor}-600 w-4 h-4 rounded-full flex items-center justify-center`}>
                      {inCart.quantity}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Floating Cart Button */}
      {cartCount > 0 && !showCart && (
        <button
          onClick={() => setShowCart(true)}
          className={`fixed bottom-24 right-4 z-40 flex items-center gap-2 px-5 py-3 rounded-2xl text-white font-semibold shadow-xl bg-${accentColor}-600 active:scale-95 transition-transform`}
        >
          <ShoppingCart className="w-5 h-5" />
          <span>{cartCount} item</span>
          <span className="opacity-80">•</span>
          <span>{formatIDR(cartTotal)}</span>
        </button>
      )}

      {/* Cart Bottom Sheet */}
      {showCart && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/40" onClick={() => setShowCart(false)}>
          <div className="bg-card rounded-t-3xl max-h-[80vh] flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="font-bold flex items-center gap-2">
                <ShoppingCart className="w-4 h-4" /> Keranjang ({cartCount})
              </h2>
              <button onClick={() => setShowCart(false)} className="p-1 rounded-lg hover:bg-accent">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-border">
              {cart.map(item => (
                <div key={item.product_id} className="p-3 flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{formatIDR(item.price)}</p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button onClick={() => updateCartItem(item.product_id, item.quantity - 1)} className="p-1.5 rounded-lg bg-muted">
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-sm font-bold w-5 text-center">{item.quantity}</span>
                    <button onClick={() => updateCartItem(item.product_id, item.quantity + 1)} className="p-1.5 rounded-lg bg-muted">
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                  <p className="text-sm font-bold">{formatIDR(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-border space-y-3">
              <div className="flex justify-between">
                <span className="font-medium">Total</span>
                <span className="text-lg font-bold">{formatIDR(cartTotal)}</span>
              </div>
              <div className="flex gap-2">
                <button onClick={() => { clearCart(); setShowCart(false); }} className="flex-1 py-2.5 rounded-xl border border-border text-sm font-medium">
                  Batal
                </button>
                <button
                  onClick={handlePlaceOrder}
                  disabled={placing}
                  className={`flex-[2] py-2.5 rounded-xl text-white text-sm font-semibold bg-${accentColor}-600 shadow-lg flex items-center justify-center gap-2 disabled:opacity-50`}
                >
                  <CreditCard className="w-4 h-4" />
                  {placing ? 'Proses...' : 'Bayar'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Product Modal (Mobile) */}
      {isModalOpen && createPortal(
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-end justify-center sm:items-center sm:p-4 animate-in fade-in duration-200">
          <div className="w-full sm:max-w-md bg-card border-t sm:border border-border shadow-2xl rounded-t-3xl sm:rounded-2xl animate-in slide-in-from-bottom sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 z-10 bg-card/90 backdrop-blur-md p-4 border-b border-border flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold">Produk Baru</h2>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 rounded-full hover:bg-accent text-muted-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateProduct} className="p-5 space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-bold">Nama Produk / Jasa</label>
                <input 
                  type="text" 
                  required
                  placeholder="Contoh: Kopi Susu, Kaos..."
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-bold">Harga Jual (Rp)</label>
                  <input 
                    type="number" 
                    min="0"
                    required
                    placeholder="0"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    className="w-full px-3 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-bold">Stok Awal</label>
                  <input 
                    type="number" 
                    min="0"
                    placeholder="0"
                    value={formData.stock}
                    onChange={(e) => setFormData({...formData, stock: e.target.value})}
                    className="w-full px-3 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-bold">Kategori</label>
                <select
                  required
                  value={formData.category_id}
                  onChange={(e) => setFormData({...formData, category_id: e.target.value})}
                  className="w-full px-3 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="" disabled>Pilih kategori...</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div className="pt-4 pb-2">
                <button type="submit" disabled={submitting} className={`w-full py-3.5 rounded-xl text-white text-sm font-bold bg-${accentColor}-600 active:bg-${accentColor}-700 transition-colors shadow-lg disabled:opacity-50`}>
                  {submitting ? 'Menyimpan...' : 'Simpan Produk'}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
