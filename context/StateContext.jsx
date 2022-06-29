import React, { createContext, useContext, useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'

const Context = createContext()

export const StateContext = ({ children }) => {
    const [showCart, setShowCart] = useState(false)
    const [cartItems, setCartItems] = useState([])
    const [totalPrice, setTotalPrice] = useState(0)
    const [totalQuantities, setTotalQuantities] = useState(0)
    const [qty, setQty] = useState(1)

    let foundProduct;
    let index;

    // Add item to cart
    const onAdd = (product, quantity) => {
        // Adjust totals
        setTotalPrice(prevTotalPrice => prevTotalPrice + product.price * quantity)
        setTotalQuantities(prevTotalQuantities => prevTotalQuantities + quantity)

        const productInCart = cartItems.find(item => item._id === product._id)

        // If item already in cart, update quantity
        if (productInCart) {
            const updatedCartItems = cartItems.map(cartProduct => {
                if(cartProduct._id === product._id) {
                    return {
                        ...cartProduct,
                        quantity: cartProduct.quantity + quantity
                    }
                }
            })

            setCartItems(updatedCartItems)
        }
        // item not already in cart, add product
        else {
            product.quantity = quantity

            setCartItems([...cartItems, { ...product }])
        }

        // Success message to user
        toast.success(`${qty} ${product.name} added to the cart`)
    }

    // Remove item from cart
    const onRemove = (product) => {
        // Find product and update quantities
        foundProduct = cartItems.find((item) => item._id === product._id)
        
        setTotalPrice(prevTotalPrice => prevTotalPrice - foundProduct.price * foundProduct.quantity)
        setTotalQuantities(prevTotalQuantities => prevTotalQuantities - foundProduct.quantity)

        // Update cart
        const newCartItems = cartItems.filter((item) => item._id !== product._id)

        setCartItems(newCartItems)
    }

    const toggleCartItemQuantity = (id, value) => {
        // Find item
        foundProduct = cartItems.find((item) => item._id === id)
        //index = cartItems.findIndex((product) => product._id === id)

        // Increment/decrement product quantity, and update totals
        if (value === 'inc') {
            setCartItems(cartItems.map((item) => {
                if (item._id === id) {
                    return {...item, quantity: item.quantity + 1}
                } else { return item }
            }) )
            setTotalPrice(prevTotalPrice => prevTotalPrice + foundProduct.price)
            setTotalQuantities(prevTotalQuantities => prevTotalQuantities + 1)

        } else if (value === 'dec') {
            if(foundProduct.quantity > 1) {
                setCartItems(cartItems.map((item) => {
                    if (item._id === id) {
                        return {...item, quantity: item.quantity - 1}
                    } else { return item }
                }) )
                setTotalPrice(prevTotalPrice => prevTotalPrice - foundProduct.price)
                setTotalQuantities(prevTotalQuantities => prevTotalQuantities - 1)
            }
        }
    }

    const incQty = () => {
        setQty((prevQty) => prevQty + 1)
    }

    const decQty = () => {
        setQty((prevQty) => {
            if (prevQty - 1 < 1) return 1
            return prevQty - 1
        })
    }
    
    return (
        <Context.Provider value={{
                showCart,
                setShowCart,
                cartItems,
                setCartItems,
                totalPrice,
                setTotalPrice,
                totalQuantities,
                setTotalQuantities,
                qty,
                setQty,
                incQty,
                decQty,
                onAdd,
                toggleCartItemQuantity,
                onRemove
            }}
        >
            {children}
        </Context.Provider>
    )
}

export const useStateContext = () => useContext(Context)