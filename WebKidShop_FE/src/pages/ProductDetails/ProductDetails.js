import classNames from 'classnames/bind';
import styles from './ProductDetails.module.scss';
import { useParams } from 'react-router-dom';
import Container from 'react-bootstrap/esm/Container';
import Row from 'react-bootstrap/esm/Row';
import Col from 'react-bootstrap/esm/Col';
import Breadcrumb from 'react-bootstrap/Breadcrumb';
import Select from 'react-select';

import Nav from '../../layouts/components/Nav/Nav';
// import SellestProduct from '../../layouts/components/SellestProduct/SellestProduct';
// import NormalProduct from '../Home/Product/NormalProduct/NormalProduct';
import { useEffect, useState } from 'react';
import _ from 'lodash';
import axios from 'axios';
import { useAuth } from '../../context/auth';

const cx = classNames.bind(styles);

function ProductDetails() {
    const { id } = useParams();
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [types, setTypes] = useState([]);
    const [brands, setBrands] = useState([]);
    const [size, setSize] = useState([]);
    const [color, setColor] = useState([]);
    const [product, setProduct] = useState({
        name: id,
        size: '',
        color: '',
        quantity: 1,
    });
    const [auth] = useAuth();

    function limit(c) {
        return this.filter((x, i) => {
            return i <= c - 1;
        });
    }

    // eslint-disable-next-line no-extend-native
    Array.prototype.limit = limit;

    const VND = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    });

    const setCategory = (categoryID) => {
        const data = categories.filter((cate) => {
            return cate._id === categoryID;
        });
        return data[0]?.name;
    };

    const setBrand = (brandID) => {
        const data = brands.filter((brand) => {
            return brand._id === brandID;
        });
        return data[0]?.name;
    };

    const setType = (typeID) => {
        const data = types.filter((type) => {
            return type._id === typeID;
        });
        return data[0]?.name;
    };

    useEffect(() => {
        axios
            .get(`http://localhost:8080/api/product`)
            .then((res) => {
                let data = res.data;
                data = data.filter((item) => {
                    return item.name === id;
                });
                setProducts(data);
                data = _.sortBy(data, ['size']);
                var arrSize = [];
                for (var i = 0; i < data.length; i++) {
                    if (data[i]?.size !== data[i + 1]?.size) {
                        arrSize.push(data[i]);
                    }
                }
                setSize(arrSize);
                data = _.sortBy(data, ['color']);
                var arrColor = [];

                for (var j = 0; j < data.length; j++) {
                    if (data[j]?.color !== data[j + 1]?.color) {
                        arrColor.push(data[j]);
                    }
                }
                setColor(arrColor);
            })
            .catch((err) => console.log(err));
    }, [id]);

    useEffect(() => {
        axios
            .get(`http://localhost:8080/api/category`)
            .then((res) => {
                setCategories(res.data);
            })
            .catch((err) => console.log(err));
    }, []);

    useEffect(() => {
        axios
            .get(`http://localhost:8080/api/producttype`)
            .then((res) => {
                setTypes(res.data);
            })
            .catch((err) => console.log(err));
    }, []);

    useEffect(() => {
        axios
            .get(`http://localhost:8080/api/brand`)
            .then((res) => {
                setBrands(res.data);
            })
            .catch((err) => console.log(err));
    }, []);

    const handleAddToCart = (e) => {
        e.preventDefault();
        products.forEach((item) => {
            if (item.name === product.name && item.size === product.size && item.color === product.color) {
                axios
                    .post(`http://localhost:8080/api/cart/add/${auth.user._id}`, {
                        productId: item._id,
                        quantity: product.quantity,
                    })
                    .then((res) => {
                        setProduct({
                            name: id,
                            size: '',
                            color: '',
                            quantity: 1,
                        });
                        alert('Sản phẩm thêm thành công vào giỏ hàng!');
                    })
                    .catch((err) => console.log(err));
            }
        });
    };

    return (
        <Container className={cx('product-details')}>
            <Breadcrumb>
                <Breadcrumb.Item href="/">Trang chủ</Breadcrumb.Item>
                <Breadcrumb.Item href="http://localhost:3000/category">Sản phẩm</Breadcrumb.Item>
                <Breadcrumb.Item active>Sơ mi kẻ sọc thời trang cho bé - SK</Breadcrumb.Item>
            </Breadcrumb>
            <Row>
                <Col>
                    <div className={cx('productdetails')}>
                        <img src={products && products[0]?.productPic} alt="" className={cx('productdetails-img')} />
                    </div>

                    <div className={cx('productdetails-list')}>
                        {products?.limit(5).map((product) => {
                            return <img className={cx('productdetails-item')} src={product.productPic} alt="" />;
                        })}
                    </div>
                </Col>
                <Col>
                    <h1 className={cx('productdetails-name')}>{products && products[0]?.name}</h1>
                    <p>
                        Giá gốc:{' '}
                        <span className={cx('productdetails-price')}>{VND.format(products && products[0]?.price)}</span>
                        <span>(chưa bao gồm giảm giá)</span>
                    </p>

                    <div className={cx('productdetails-btn')}>Còn hàng</div>
                    <p className={cx('productdetails-brand')}>
                        Danh mục:
                        <span className={cx('productdetails-brand-span')}>
                            {setCategory(products && products[0]?.category)}
                        </span>
                    </p>
                    <p className={cx('productdetails-brand')}>
                        Loại sản phẩm:
                        <span className={cx('productdetails-brand-span')}>
                            {setType(products && products[0]?.productType)}
                        </span>
                    </p>
                    <p className={cx('productdetails-brand')}>
                        Thương hiệu:
                        <span className={cx('productdetails-brand-span')}>
                            {setBrand(products && products[0]?.brand)}
                        </span>
                    </p>
                    <Select
                        placeholder="Size"
                        options={size}
                        getOptionLabel={(option) => option.size}
                        getOptionValue={(option) => option._id}
                        onChange={(size) => {
                            setProduct({ ...product, size: size.size });
                        }}
                        className={cx('productdetails-dropdown')}
                    />
                    <Select
                        placeholder="Màu sắc"
                        options={color}
                        getOptionLabel={(option) => option.color}
                        getOptionValue={(option) => option._id}
                        onChange={(color) => {
                            setProduct({ ...product, color: color.color });
                        }}
                        className={cx('productdetails-dropdown')}
                    />
                    <div>
                        <input
                            type="number"
                            name="quantity"
                            value={product.quantity}
                            min="1"
                            max={Infinity}
                            defaultValue="1"
                            className={cx('productdetails-select')}
                            onChange={(e) => setProduct({ ...product, quantity: e.target.value })}
                        />

                        <button onClick={handleAddToCart} className={cx('productdetails-buy-btn')}>
                            Đặt hàng
                        </button>
                    </div>
                    <p className={cx('productdetails-hotline-text')}>Gọi ngay để được tư vấn mua hàng !</p>
                    <div className={cx('productdetails-hotline-block')}>HOTLINE: 0963647129</div>
                    <img
                        src="https://bizweb.dktcdn.net/100/117/632/themes/157694/assets/icon-dt.jpg?1564585558451"
                        alt=""
                    />
                </Col>
            </Row>
            <Row className={cx('productdetais-more-info')}>
                <Col xl={8}>
                    <Row className={cx('productdetails-info-wrap')}>
                        <h2 className={cx('productdetails-lable')}>Thông tin sản phẩm</h2>
                        <div>
                            <p className={cx('productdetails-info')}>{products && products[0]?.description}</p>
                            <div className={cx('productdetails')}>
                                <img
                                    src={products && products[0]?.productPic}
                                    alt=""
                                    className={cx('productdetails-img')}
                                />
                            </div>
                        </div>
                    </Row>
                    {/* <Row className={cx('productdetails-info-wrap')}>
                        <h2 className={cx('productdetails-lable')}>Sản phẩm liên quan</h2>
                        <Row>
                            <Col xl={3} md={6}>
                                <NormalProduct
                                    src="https://bizweb.dktcdn.net/thumb/large/100/117/632/products/giay5-6ad05ccc-be71-4eca-83f8-3e73a5570372-42da6097-d9b3-437a-afe5-66c1be4352b4-8a365fca-ef0a-415a-838e-f172e148cb7c.jpg?v=1473603367790"
                                    oldPrice="450.000"
                                    newPrice="450.000"
                                    discount="0"
                                    title="giầy thể thao buộc dây - f56"
                                />
                            </Col>
                            <Col xl={3} md={6}>
                                <NormalProduct
                                    src="https://bizweb.dktcdn.net/thumb/large/100/117/632/products/giay5-6ad05ccc-be71-4eca-83f8-3e73a5570372-42da6097-d9b3-437a-afe5-66c1be4352b4-8a365fca-ef0a-415a-838e-f172e148cb7c.jpg?v=1473603367790"
                                    oldPrice="450.000"
                                    newPrice="450.000"
                                    discount="0"
                                    title="giầy thể thao buộc dây - f56"
                                />
                            </Col>
                            <Col xl={3} md={6}>
                                <NormalProduct
                                    src="https://bizweb.dktcdn.net/thumb/large/100/117/632/products/giay5-6ad05ccc-be71-4eca-83f8-3e73a5570372-42da6097-d9b3-437a-afe5-66c1be4352b4-8a365fca-ef0a-415a-838e-f172e148cb7c.jpg?v=1473603367790"
                                    oldPrice="450.000"
                                    newPrice="450.000"
                                    discount="0"
                                    title="giầy thể thao buộc dây - f56"
                                />
                            </Col>
                            <Col xl={3} md={6}>
                                <NormalProduct
                                    src="https://bizweb.dktcdn.net/thumb/large/100/117/632/products/giay5-6ad05ccc-be71-4eca-83f8-3e73a5570372-42da6097-d9b3-437a-afe5-66c1be4352b4-8a365fca-ef0a-415a-838e-f172e148cb7c.jpg?v=1473603367790"
                                    oldPrice="450.000"
                                    newPrice="450.000"
                                    discount="0"
                                    title="giầy thể thao buộc dây - f56"
                                />
                            </Col>
                        </Row>
                    </Row> */}
                </Col>
                <Col xl={4}>
                    <Nav />
                    {/* <SellestProduct /> */}
                </Col>
            </Row>
        </Container>
    );
}

export default ProductDetails;
