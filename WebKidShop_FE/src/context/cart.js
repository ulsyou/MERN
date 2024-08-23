import { useContext, useEffect, createContext, useState } from 'react';
const CartContext = createContext();
const CartProvider = ({ children }) => {
    const [cart, setCart] = useState({});
    useEffect(() => {
        const data = localStorage.getItem('cart');
        if (data) {
            const parseData = JSON.parse(data);
            setCart({
                ...cart,
                cart: parseData,
            });
        }
        // eslint-disable-next-line
    }, []);
    return <CartContext.Provider value={[cart, setCart]}>{children}</CartContext.Provider>;
};

const useCart = () => useContext(CartContext);

export { useCart, CartProvider };
