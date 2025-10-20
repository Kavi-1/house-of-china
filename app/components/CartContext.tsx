"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CartItem {
    id: string | number;
    name: string;
    basePrice: number;
    optionId: number | null;
    optionName: string | null;
    optionPrice: number;
    total: number;
    quantity: number;
}

interface CartContextType {
    cart: CartItem[];
    addToCart: (item: CartItem) => void;
    removeFromCart: (index: number) => void;
    updateQuantity: (index: number, quantity: number) => void;
    clearCart: () => void;
    isOpen: boolean;
    openCart: () => void;
    closeCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // cart on localStorage 
    const [cart, setCart] = useState<CartItem[]>(() => {
        try {
            const raw = typeof window !== 'undefined' ? localStorage.getItem('cart') : null;
            return raw ? JSON.parse(raw) as CartItem[] : [];
        } catch {
            return [];
        }
    });

    useEffect(() => {
        try { localStorage.setItem('cart', JSON.stringify(cart)); } catch { /* ignore */ }
    }, [cart]);

    const addToCart = (item: CartItem) => {
        setCart(prev => [...prev, item]);
    };

    const removeFromCart = (index: number) => {
        setCart(prev => prev.filter((_, i) => i !== index));
    };

    const updateQuantity = (index: number, quantity: number) => {
        setCart(prev => prev.map((it, i) => i === index ? { ...it, quantity, total: (it.basePrice + it.optionPrice) * quantity } : it));
    };

    const clearCart = () => setCart([]);
    const [isOpen, setIsOpen] = useState(false);
    const openCart = () => setIsOpen(true);
    const closeCart = () => setIsOpen(false);

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, isOpen, openCart, closeCart }}>
            {children}
        </CartContext.Provider>
    );
};

export function useCart() {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error('useCart must be used within a CartProvider');
    return ctx;
}
