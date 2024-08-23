import Container from 'react-bootstrap/esm/Container';
import Row from 'react-bootstrap/esm/Row';
import Col from 'react-bootstrap/esm/Col';
import { Link, useNavigate } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAuth } from '../../context/auth';
import { useCart } from '../../context/cart';
import Select from 'react-select';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { CLIENT_ID } from '../../config/Config';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';

import Item from './Item/Item';
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames/bind';
import styles from './Pay.module.scss';

const cx = classNames.bind(styles);

function Pay() {
    const [auth] = useAuth();
    const [cart, setCart] = useCart();
    const navigate = useNavigate();

    const VND = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    });

    const [addresses, setAddresses] = useState([]);
    const [products, setProducts] = useState([]);
    const [order, setOrder] = useState({
        user: auth.user?._id,
        order: [cart.cart?.cartDetails],
        address: '',
        note: '',
        status: 'Pending',
        paymentType: '',
    });

    const [totalBill, setTotalBill] = useState(
        cart.cart?.cartDetails.reduce((total, item) => {
            return total + item.product.price * item.quantity;
        }, 0),
    );

    useEffect(() => {
        setTotalBill(
            cart.cart?.cartDetails.reduce((total, item) => {
                return total + item.product.price * item.quantity;
            }, 0),
        );
    }, [totalBill, cart]);

    //paypal
    const [show, setShow] = useState(false);
    const [success, setSuccess] = useState(false);
    const [orderID, setOrderID] = useState(false);

    useEffect(() => {
        axios
            .get(`http://localhost:8080/api/address/${auth.user?._id}`)
            .then((res) => setAddresses(res.data.data))
            .catch((err) => console.log(err));
    }, [auth]);

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

    //paypal
    const createOrder = (data, actions) => {
        return actions.order
            .create({
                purchase_units: [
                    {
                        amount: {
                            currency_code: 'USD',
                            value: totalBill / 23000,
                        },
                    },
                ],
            })
            .then((orderID) => {
                setOrderID(orderID);
                return orderID;
            });
    };

    // check Approval
    const onApprove = (data, actions) => {
        return actions.order.capture().then(function (details) {
            // eslint-disable-next-line
            const { payer } = details;
            setSuccess(true);
        });
    };

    useEffect(() => {
        if (success) {
            alert('Payment successful!!');
            console.log('Order successful . Your order id is--', orderID);
        }
    }, [success, orderID]);

    const handleCheckout = (e) => {
        e.preventDefault();
        if (order.paymentType === '') {
            alert('Bạn chưa chọn phương thức thanh toán!');
        } else if (order.paymentType === 'COD') {
            axios
                .post('http://localhost:8080/api/checkout', order)
                .then((res) => {
                    alert('Thanh toán thành công!');
                    setCart({});
                    localStorage.removeItem('cart');
                    navigate('/');
                })
                .catch((err) => console.log(err));
        } else {
            setShow(true);
        }
    };

    return (
        <PayPalScriptProvider options={{ 'client-id': CLIENT_ID }}>
            <Container>
                <Row>
                    <Col xl={8}>
                        <h1>
                            <Link to="/" className={cx('pay-home')}>
                                Kidshop
                            </Link>
                        </h1>
                        <Row>
                            <Col>
                                <h3 className={cx('pay-lable')}>Thông tin nhận hàng</h3>
                                <Form>
                                    <Form.Group controlId="exampleForm.ControlInput1" className={cx('pay-form-group')}>
                                        <Form.Control
                                            type="text"
                                            value={`${auth.user?.firstName} ${auth.user?.lastName}`}
                                            className={cx('pay-input')}
                                            readOnly
                                        />
                                    </Form.Group>
                                    <Form.Group controlId="exampleForm.ControlInput1" className={cx('pay-form-group')}>
                                        <Form.Control
                                            type="text"
                                            value={auth.user?.phone}
                                            className={cx('pay-input')}
                                            readOnly
                                        />
                                    </Form.Group>
                                    <Form.Group controlId="exampleForm.ControlInput1" className={cx('pay-form-group')}>
                                        <Select
                                            placeholder="Địa chỉ"
                                            options={addresses}
                                            getOptionLabel={(option) => option.address}
                                            getOptionValue={(option) => option._id}
                                            className={cx('info-form-input')}
                                            onChange={(addresses) => setOrder({ ...order, address: addresses.address })}
                                        />
                                    </Form.Group>
                                    <Form.Group controlId="exampleForm.ControlInput1" className={cx('pay-form-group')}>
                                        <Form.Control
                                            as="textarea"
                                            placeholder="Ghi chú"
                                            rows={3}
                                            className={cx('pay-input')}
                                            name="note"
                                            value={order.note}
                                            onChange={(e) => setOrder({ ...order, note: e.target.value })}
                                        />
                                    </Form.Group>
                                </Form>
                            </Col>

                            <Col>
                                <h3 className={cx('pay-lable')}>Vận chuyển</h3>
                                <Form.Check
                                    type="radio"
                                    id="default-radio"
                                    label="Giao hàng tận nơi"
                                    className={cx('pay-radio')}
                                    checked
                                />
                                <h3 className={cx('pay-lable', 'mt-20')}>Thanh toán</h3>
                                <div
                                    className="mb-3"
                                    onChange={(e) => setOrder({ ...order, paymentType: e.target.value })}
                                >
                                    <Form.Check
                                        type="radio"
                                        name="default-radio"
                                        value="COD"
                                        label="Thanh toán khi giao hàng (COD)"
                                        className={cx('pay-radio')}
                                    />
                                    <Form.Check
                                        type="radio"
                                        name="default-radio"
                                        value="Paypal"
                                        label="Thanh toán qua Paypal"
                                        className={cx('pay-radio')}
                                    />
                                </div>
                            </Col>
                        </Row>
                    </Col>
                    <Col xl={4} className={cx('pay-order')}>
                        <Row>
                            <h3 className={cx('pay-lable', 'mt-20')}>Đơn hàng</h3>
                            {products.map((product) => {
                                return (
                                    <Item
                                        key={product._id}
                                        id={product._id}
                                        url={product.productPic}
                                        name={product.name}
                                        size={product.size}
                                        color={product.color}
                                        price={product.price}
                                        quantity={product.quantity}
                                    />
                                );
                            })}

                            <div className={cx('display-flex')}>
                                <p>Tạm tính</p>
                                <p>
                                    {VND.format(
                                        cart.cart?.cartDetails.reduce((total, item) => {
                                            return total + item.product.price * item.quantity;
                                        }, 0),
                                    )}
                                </p>
                            </div>
                            <div className={cx('display-flex')}>
                                <p>Phí vận chuyển</p>
                                <p>40.000đ</p>
                            </div>

                            <div className={cx('display-flex')}>
                                <p>Tổng cộng</p>
                                <p>290.000đ</p>
                            </div>
                            <div className={cx('display-flex')}>
                                <Link to="/cart">
                                    <button className={cx('pay-btn-back')}>
                                        <FontAwesomeIcon icon={faAngleLeft} /> Quay về giỏ hàng
                                    </button>
                                </Link>
                                <Link onClick={handleCheckout}>
                                    <button className={cx('pay-btn-buy')}>Đặt hàng</button>
                                </Link>
                            </div>
                        </Row>
                        <Row>
                            {show ? (
                                <PayPalButtons
                                    style={{ layout: 'vertical' }}
                                    createOrder={createOrder}
                                    onApprove={onApprove}
                                />
                            ) : null}
                        </Row>
                    </Col>
                </Row>
            </Container>
        </PayPalScriptProvider>
    );
}

export default Pay;
