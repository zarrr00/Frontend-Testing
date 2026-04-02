import { useState, useEffect, useCallback } from 'react';
import { posService } from '../services/pos.service';
import { productService } from '../services/product.service';
import { customerService } from '../services/customer.service';

export const usePOS = () => {
  // Products
  const [products, setProducts] = useState([]);
  // Customers
  const [customers, setCustomers] = useState([]);
  // Orders
  const [orders, setOrders] = useState([]);
  // Payment Methods
  const [paymentMethods, setPaymentMethods] = useState([]);
  // Vouchers
  const [vouchers, setVouchers] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Cart State
  const [cart, setCart] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [appliedVoucher, setAppliedVoucher] = useState(null);

  const fetchProducts = useCallback(async () => {
    try {
      const data = await productService.getProducts();
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err);
    }
  }, []);

  const fetchCustomers = useCallback(async () => {
    try {
      const data = await customerService.getCustomers();
      setCustomers(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err);
    }
  }, []);

  const fetchOrders = useCallback(async (params = {}) => {
    try {
      const data = await posService.getOrders(params);
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err);
    }
  }, []);

  const fetchPaymentMethods = useCallback(async () => {
    try {
      const data = await posService.getPaymentMethods();
      setPaymentMethods(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err);
    }
  }, []);

  const fetchVouchers = useCallback(async () => {
    try {
      const data = await posService.getVouchers();
      setVouchers(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err);
    }
  }, []);

  const initPOS = useCallback(async () => {
    setLoading(true);
    setError(null);
    await Promise.all([
      fetchProducts(),
      fetchCustomers(),
      fetchPaymentMethods(),
      fetchVouchers(),
    ]);
    setLoading(false);
  }, [fetchProducts, fetchCustomers, fetchPaymentMethods, fetchVouchers]);

  useEffect(() => {
    initPOS();
  }, [initPOS]);

  // Cart Operations
  const addToCart = (product, qty = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.product_id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product_id === product.id
            ? { ...item, quantity: item.quantity + qty }
            : item
        );
      }
      return [...prev, { product_id: product.id, name: product.name, price: product.price, quantity: qty }];
    });
  };

  const updateCartItem = (productId, qty) => {
    if (qty <= 0) {
      setCart(prev => prev.filter(item => item.product_id !== productId));
    } else {
      setCart(prev => prev.map(item =>
        item.product_id === productId ? { ...item, quantity: qty } : item
      ));
    }
  };

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => item.product_id !== productId));
  };

  const clearCart = () => {
    setCart([]);
    setSelectedCustomer(null);
    setSelectedPaymentMethod(null);
    setAppliedVoucher(null);
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const placeOrder = async () => {
    try {
      const orderData = {
        items: cart.map(item => ({ product_id: item.product_id, quantity: item.quantity })),
        customer_id: selectedCustomer?.id,
        payment_method_id: selectedPaymentMethod?.id,
        voucher_code: appliedVoucher?.code,
      };
      const result = await posService.createOrder(orderData);
      clearCart();
      await fetchOrders();
      return result;
    } catch (err) {
      throw err;
    }
  };

  return {
    // Data
    products,
    customers,
    orders,
    paymentMethods,
    vouchers,
    loading,
    error,
    // Cart
    cart,
    cartTotal,
    selectedCustomer,
    selectedPaymentMethod,
    appliedVoucher,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    setSelectedCustomer,
    setSelectedPaymentMethod,
    setAppliedVoucher,
    // Actions
    placeOrder,
    // Refreshers
    refreshProducts: fetchProducts,
    refreshCustomers: fetchCustomers,
    refreshOrders: fetchOrders,
    refreshPaymentMethods: fetchPaymentMethods,
    refreshVouchers: fetchVouchers,
    refreshAll: initPOS,
  };
};
