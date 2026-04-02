import { usePOS } from '../../../hooks/usePOS';
import { useMode } from '../../../contexts/ModeContext';
import { formatIDR } from '../../../utils/currency';
import AnimatedContent from '../../../components/ui/AnimatedContent';
import { ShoppingCart, Package, Plus, Minus, CreditCard, Search, X } from 'lucide-react';
import { useState } from 'react';

export default function MobilePOS() {
  const { mode } = useMode();
  const {
    products, cart, cartTotal, loading, error,
    addToCart, updateCartItem, removeFromCart, clearCart, placeOrder,
  } = usePOS();
  const isPersonal = mode === 'personal';
  const accentColor = isPersonal ? 'purple' : 'blue';
  const [search, setSearch] = useState('');
  const [showCart, setShowCart] = useState(false);
  const [placing, setPlacing] = useState(false);

  const filteredProducts = products.filter(p =>
    p.name?.toLowerCase().includes(search.toLowerCase())
  );

  const cartCount = cart.reduce((s, c) => s + c.quantity, 0);

  const handlePlaceOrder = async () => {
    setPlacing(true);
    try {
      await placeOrder();
      setShowCart(false);
    } catch (err) {
      console.error(err);
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="p-4 space-y-4 pb-24">
      <AnimatedContent direction="vertical" delay={0}>
        <div className="flex items-center gap-2">
          <ShoppingCart className={`w-6 h-6 text-${accentColor}-600`} />
          <h1 className="text-xl font-bold">Kasir</h1>
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
          {filteredProducts.map(product => (
            <div
              key={product.id}
              onClick={() => addToCart(product)}
              className="bg-card border border-border rounded-2xl p-3 shadow-sm active:scale-[0.98] transition-transform"
            >
              <div className="flex items-center justify-center w-full h-12 bg-muted rounded-xl mb-2">
                <Package className="w-6 h-6 text-muted-foreground/40" />
              </div>
              <p className="font-semibold text-xs truncate">{product.name}</p>
              <p className={`text-xs font-bold text-${accentColor}-600 mt-0.5`}>{formatIDR(product.price)}</p>
            </div>
          ))}
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
    </div>
  );
}
