import { usePOS } from '../../../hooks/usePOS';
import { useMode } from '../../../contexts/ModeContext';
import { formatIDR } from '../../../utils/currency';
import AnimatedContent from '../../../components/ui/AnimatedContent';
import { ShoppingCart, Package, Plus, Minus, Trash2, CreditCard, Search } from 'lucide-react';
import { useState } from 'react';

export default function DesktopPOS() {
  const { mode } = useMode();
  const {
    products, cart, cartTotal, loading, error,
    addToCart, updateCartItem, removeFromCart, clearCart, placeOrder,
    paymentMethods, selectedPaymentMethod, setSelectedPaymentMethod,
  } = usePOS();
  const isPersonal = mode === 'personal';
  const accentColor = isPersonal ? 'purple' : 'blue';
  const [search, setSearch] = useState('');
  const [placing, setPlacing] = useState(false);

  const filteredProducts = products.filter(p =>
    p.name?.toLowerCase().includes(search.toLowerCase())
  );

  const handlePlaceOrder = async () => {
    if (cart.length === 0) return;
    setPlacing(true);
    try {
      await placeOrder();
    } catch (err) {
      console.error(err);
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <AnimatedContent direction="vertical" delay={0}>
        <div className="flex items-center gap-3 mb-6">
          <ShoppingCart className={`w-8 h-8 text-${accentColor}-600`} />
          <h1 className="text-2xl font-bold">Kasir (POS)</h1>
        </div>
      </AnimatedContent>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Product Grid */}
        <div className="lg:col-span-2 space-y-4">
          <AnimatedContent direction="vertical" delay={100}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Cari produk..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
              />
            </div>
          </AnimatedContent>

          <AnimatedContent direction="vertical" delay={200}>
            {loading ? (
              <div className="p-12 text-center text-muted-foreground">Memuat produk...</div>
            ) : error ? (
              <div className="p-12 text-center text-red-500">Gagal memuat produk</div>
            ) : filteredProducts.length === 0 ? (
              <div className="p-12 text-center text-muted-foreground bg-card border border-border rounded-2xl">
                <Package className="w-14 h-14 mx-auto mb-3 opacity-30" />
                <p className="font-medium">Tidak ada produk ditemukan</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {filteredProducts.map(product => {
                  const inCart = cart.find(c => c.product_id === product.id);
                  return (
                    <div
                      key={product.id}
                      onClick={() => addToCart(product)}
                      className={`bg-card border rounded-2xl p-4 shadow-sm cursor-pointer hover:shadow-md transition-all hover:-translate-y-0.5 ${inCart ? `border-${accentColor}-400 ring-1 ring-${accentColor}-400/30` : 'border-border'}`}
                    >
                      <div className="flex items-center justify-center w-full h-16 bg-muted rounded-xl mb-3">
                        <Package className="w-8 h-8 text-muted-foreground/40" />
                      </div>
                      <p className="font-semibold text-sm truncate">{product.name}</p>
                      <p className={`text-sm font-bold text-${accentColor}-600 mt-1`}>{formatIDR(product.price)}</p>
                      {product.stock !== undefined && (
                        <p className="text-[10px] text-muted-foreground mt-1">Stok: {product.stock}</p>
                      )}
                      {inCart && (
                        <div className={`mt-2 text-[10px] font-bold text-${accentColor}-600 bg-${accentColor}-100 dark:bg-${accentColor}-900/30 px-2 py-0.5 rounded-full text-center`}>
                          {inCart.quantity} di keranjang
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </AnimatedContent>
        </div>

        {/* Cart Sidebar */}
        <AnimatedContent direction="vertical" delay={300}>
          <div className="bg-card border border-border rounded-2xl shadow-sm sticky top-6">
            <div className="p-4 border-b border-border">
              <h2 className="font-semibold flex items-center gap-2">
                <ShoppingCart className="w-4 h-4" /> Keranjang
                {cart.length > 0 && (
                  <span className={`ml-auto text-xs px-2 py-0.5 rounded-full bg-${accentColor}-100 dark:bg-${accentColor}-900/30 text-${accentColor}-600 font-bold`}>
                    {cart.reduce((s, c) => s + c.quantity, 0)}
                  </span>
                )}
              </h2>
            </div>

            {cart.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                <ShoppingCart className="w-10 h-10 mx-auto mb-2 opacity-30" />
                <p className="text-sm">Keranjang kosong</p>
                <p className="text-xs mt-1">Klik produk untuk menambahkan</p>
              </div>
            ) : (
              <>
                <div className="divide-y divide-border max-h-80 overflow-y-auto">
                  {cart.map(item => (
                    <div key={item.product_id} className="p-3 flex items-center gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{item.name}</p>
                        <p className="text-xs text-muted-foreground">{formatIDR(item.price)}</p>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button onClick={() => updateCartItem(item.product_id, item.quantity - 1)} className="p-1 rounded-lg hover:bg-accent transition-colors">
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-sm font-bold w-6 text-center">{item.quantity}</span>
                        <button onClick={() => updateCartItem(item.product_id, item.quantity + 1)} className="p-1 rounded-lg hover:bg-accent transition-colors">
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-sm font-bold w-20 text-right">{formatIDR(item.price * item.quantity)}</p>
                      <button onClick={() => removeFromCart(item.product_id)} className="p-1 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-muted-foreground hover:text-red-500 transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Payment Method */}
                {paymentMethods.length > 0 && (
                  <div className="p-3 border-t border-border">
                    <p className="text-xs font-medium text-muted-foreground mb-2">Metode Pembayaran</p>
                    <div className="flex flex-wrap gap-1.5">
                      {paymentMethods.map(pm => (
                        <button
                          key={pm.id}
                          onClick={() => setSelectedPaymentMethod(pm)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${selectedPaymentMethod?.id === pm.id ? `bg-${accentColor}-600 text-white` : 'bg-muted text-muted-foreground hover:text-foreground'}`}
                        >
                          {pm.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Total & Checkout */}
                <div className="p-4 border-t border-border space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Total</span>
                    <span className="text-xl font-bold">{formatIDR(cartTotal)}</span>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={clearCart} className="flex-1 py-2.5 rounded-xl border border-border text-sm font-medium hover:bg-accent transition-colors">
                      Batal
                    </button>
                    <button
                      onClick={handlePlaceOrder}
                      disabled={placing || cart.length === 0}
                      className={`flex-[2] py-2.5 rounded-xl text-white text-sm font-semibold bg-${accentColor}-600 hover:bg-${accentColor}-700 transition-colors shadow-lg flex items-center justify-center gap-2 disabled:opacity-50`}
                    >
                      <CreditCard className="w-4 h-4" />
                      {placing ? 'Memproses...' : 'Bayar'}
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </AnimatedContent>
      </div>
    </div>
  );
}
