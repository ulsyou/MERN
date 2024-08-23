import Container from 'react-bootstrap/esm/Container';
import Table from 'react-bootstrap/Table';
import { Link } from 'react-router-dom';

import classNames from 'classnames/bind';
import styles from './Cart.module.scss';
import { useCart } from '../../context/cart';
import { useEffect, useState } from 'react';
import axios from 'axios';

import CartItem from './CartItem/CartItem';

const cx = classNames.bind(styles);

function Cart() {
    const [cart] = useCart();
    const [products, setProducts] = useState([]);
    const [cartDetail, setCartDetail] = useState([]);
    const [cartItem, setCartItem] = useState([]);

    const VND = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    });

    useEffect(() => {
        setCartDetail(
            cart.cart?.cartDetails.map((element) => {
                return {
                    productId: element.product._id,
                    quantity: element.quantity,
                };
            }),
        );
    }, [cart]);

    const callbackSetCart = (childData) => {
        let found = false;
        if (cartItem.filter((item) => item.productId === childData.productId).length > 0) {
            found = true;
        }
        if (found) {
            cartItem.forEach((item) => {
                if (item.productId === childData.productId) item.quantity = childData.quantity;
            });
        } else {
            setCartItem([...cartItem, childData]);
        }
    };

    const handleUpdate = (e) => {
        e.preventDefault();

        cartDetail.forEach((element) => {
            cartItem.forEach((item) => {
                if (item.productId === element.productId) {
                    element.quantity = item.quantity;
                }
            });
        });

        console.log(cartDetail);

        axios
            .put(`http://localhost:8080/api/cart/update/${cart.cart.user._id}`, { cartItems: cartDetail })
            .then((res) => {
                console.log('Update success');
            })
            .catch((err) => console.log(err));
    };

    useEffect(() => {
        axios.get(`http://localhost:8080/api/product`).then((res) => {
            let data = res.data;
            let arr = [];
            cart.cart?.cartDetails.forEach((element) => {
                data.forEach((item) => {
                    if (element.product._id === item._id) {
                        item.quantity = element.quantity;
                        arr.push(item);
                    }
                });
            });
            setProducts(arr);
        });
    }, [cart]);

    return (
        <Container className={cx('cart')}>
            <Table striped bordered hover responsive className={cx('cart-table')}>
                <thead>
                    <tr className={cx('cart-th')}>
                        <th>Hình ảnh</th>
                        <th>Tên sản phẩm</th>
                        <th>Đơn giá</th>
                        <th>Số lượng</th>
                        <th>Thành tiền</th>
                        <th>Xoá</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product) => {
                        return (
                            <CartItem
                                id={product._id}
                                url={product.productPic}
                                name={product.name}
                                color={product.color}
                                size={product.size}
                                price={product.price}
                                quantity={product.quantity}
                                cb={callbackSetCart}
                            />
                        );
                    })}
                </tbody>
            </Table>
            <div className={cx('cart-btn-wrap')}>
                <div>
                    <Link to="/category" className={cx('cart-btn', 'btn-subcolor')}>
                        Mua hàng tiếp
                    </Link>
                    <button onClick={handleUpdate} className={cx('cart-btn', 'btn-primarycolor')}>
                        Cập nhật
                    </button>
                </div>
                <div className={cx('cart-total-wrap')}>
                    <div className={cx('cart-total')}>Tổng tiền</div>
                    <div className={cx('cart-total')}>
                        {VND.format(
                            cart.cart?.cartDetails.reduce((total, item) => {
                                return total + item.product.price * item.quantity;
                            }, 0),
                        )}
                    </div>
                </div>
            </div>
            <div className={cx('cart-btn-buy-wrap')}>
                <Link to="/pay">
                    <button className={cx('cart-btn-buy', 'btn-primarycolor')}>Thanh toán</button>
                </Link>
            </div>
        </Container>
    );
}

export default Cart;
