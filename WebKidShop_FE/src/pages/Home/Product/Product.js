import Container from 'react-bootstrap/esm/Container';
import Row from 'react-bootstrap/esm/Row';
import Col from 'react-bootstrap/esm/Col';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleRight } from '@fortawesome/free-solid-svg-icons';

import classNames from 'classnames/bind';
import styles from './Product.module.scss';

import Brand from './Brand/Brand';
import SellestProduct from '../../../layouts/components/SellestProduct/SellestProduct';
import NormalProduct from './NormalProduct/NormalProduct';

const cx = classNames.bind(styles);

function Product() {
    return (
        <div className={cx('product')}>
            <Container>
                <Row>
                    <Col xl={3} className={cx('product-aside')}>
                        <Row>
                            <Brand src="https://bizweb.dktcdn.net/100/117/632/themes/157694/assets/logo1.png?1564585558451" />
                            <Brand src="https://bizweb.dktcdn.net/100/117/632/themes/157694/assets/logo2.png?1564585558451" />
                            <Brand src="https://bizweb.dktcdn.net/100/117/632/themes/157694/assets/logo3.png?1564585558451" />
                            <Brand src="https://bizweb.dktcdn.net/100/117/632/themes/157694/assets/logo4.png?1564585558451" />
                            <Brand src="https://bizweb.dktcdn.net/100/117/632/themes/157694/assets/logo5.png?1564585558451" />
                            <Brand src="https://bizweb.dktcdn.net/100/117/632/themes/157694/assets/logo6.png?1564585558451" />
                            <Brand src="https://bizweb.dktcdn.net/100/117/632/themes/157694/assets/logo7.png?1564585558451" />
                            <Brand src="https://bizweb.dktcdn.net/100/117/632/themes/157694/assets/logo8.png?1564585558451" />
                        </Row>
                        <SellestProduct />
                        <div className={cx('contact')}>
                            <div className={cx('sub-contact')}>
                                <h5 className={cx('contact-title')}>HOTLINE</h5>
                                <h5 className={cx('contact-phone')}>0963.647.129</h5>
                            </div>
                        </div>
                    </Col>
                    <Col xl={9}>
                        <h3 className={cx('hot-product-lable')}>Sản phẩm nổi bật</h3>
                        <Row>
                            <Col xl={6} md={6}>
                                <Link to="" className={cx('hot-product')}>
                                    <img
                                        className={cx('product-img')}
                                        src="https://bizweb.dktcdn.net/thumb/grande/100/117/632/products/aovay1.jpg?v=1473603655807"
                                        alt=""
                                    />
                                    <div className={cx('product-sale')}>-9%</div>
                                    <div className={cx('product-info')}>
                                        <h5 className={cx('product-new-price')}>250.000đ</h5>
                                        <h5 className={cx('product-old-price')}>275.000đ</h5>
                                        <h5 className={cx('product-title')}>Váy liền thân KIDS - KF5</h5>
                                        <img
                                            src="https://bizweb.dktcdn.net/100/117/632/themes/157694/assets/btn-buy.png?1564585558451"
                                            alt=""
                                        />
                                    </div>
                                </Link>
                            </Col>
                            <Col xl={6} md={6}>
                                <Row>
                                    <Col>
                                        <NormalProduct
                                            src="https://bizweb.dktcdn.net/thumb/large/100/117/632/products/giay5-6ad05ccc-be71-4eca-83f8-3e73a5570372-42da6097-d9b3-437a-afe5-66c1be4352b4-8a365fca-ef0a-415a-838e-f172e148cb7c.jpg?v=1473603367790"
                                            oldPrice="450.000"
                                            newPrice="450.000"
                                            discount="0"
                                            title="giầy thể thao buộc dây - f56"
                                        />
                                    </Col>
                                    <Col>
                                        <NormalProduct
                                            src="https://bizweb.dktcdn.net/thumb/large/100/117/632/products/giay5-6ad05ccc-be71-4eca-83f8-3e73a5570372-42da6097-d9b3-437a-afe5-66c1be4352b4-8a365fca-ef0a-415a-838e-f172e148cb7c.jpg?v=1473603367790"
                                            oldPrice="450.000"
                                            newPrice="450.000"
                                            discount="0"
                                            title="giầy thể thao buộc dây - f56"
                                        />
                                    </Col>
                                </Row>
                                <div className={cx('hot-product-see-all')}>
                                    <Link to="/product/all" className={cx('view-full-product')}>
                                        <div className={cx('full-product-border')}>
                                            Xem toàn bộ sản phẩm
                                            <FontAwesomeIcon
                                                className={cx('view-full-product-icon')}
                                                icon={faCircleRight}
                                            />
                                        </div>
                                    </Link>
                                </div>
                            </Col>
                        </Row>
                        <div className={cx('new-product')}>
                            <h3 className={cx('new-product-lable')}>Hàng mới về!</h3>
                            <div className={cx('new-product-type')}>
                                <Link to="" className={cx('product-type-btn')}>
                                    Bé trai
                                </Link>
                                <Link to="" className={cx('product-type-btn')}>
                                    Bé gái
                                </Link>
                                <Link to="" className={cx('product-type-btn')}>
                                    Phụ kiện
                                </Link>
                            </div>
                        </div>
                        <Row className={cx('new-product-list')}>
                            <Col>
                                <NormalProduct
                                    src="https://bizweb.dktcdn.net/thumb/large/100/117/632/products/giay5-6ad05ccc-be71-4eca-83f8-3e73a5570372-42da6097-d9b3-437a-afe5-66c1be4352b4-8a365fca-ef0a-415a-838e-f172e148cb7c.jpg?v=1473603367790"
                                    oldPrice="450.000"
                                    newPrice="450.000"
                                    discount="0"
                                    title="giầy thể thao buộc dây - f56"
                                    to={`/product/${456}`}
                                />
                            </Col>
                            <Col>
                                <NormalProduct
                                    src="https://bizweb.dktcdn.net/thumb/large/100/117/632/products/giay5-6ad05ccc-be71-4eca-83f8-3e73a5570372-42da6097-d9b3-437a-afe5-66c1be4352b4-8a365fca-ef0a-415a-838e-f172e148cb7c.jpg?v=1473603367790"
                                    oldPrice="450.000"
                                    newPrice="450.000"
                                    discount="0"
                                    title="giầy thể thao buộc dây - f56"
                                />
                            </Col>
                            <Col>
                                <NormalProduct
                                    src="https://bizweb.dktcdn.net/thumb/large/100/117/632/products/giay5-6ad05ccc-be71-4eca-83f8-3e73a5570372-42da6097-d9b3-437a-afe5-66c1be4352b4-8a365fca-ef0a-415a-838e-f172e148cb7c.jpg?v=1473603367790"
                                    oldPrice="450.000"
                                    newPrice="450.000"
                                    discount="0"
                                    title="giầy thể thao buộc dây - f56"
                                />
                            </Col>
                            <Col>
                                <NormalProduct
                                    src="https://bizweb.dktcdn.net/thumb/large/100/117/632/products/giay5-6ad05ccc-be71-4eca-83f8-3e73a5570372-42da6097-d9b3-437a-afe5-66c1be4352b4-8a365fca-ef0a-415a-838e-f172e148cb7c.jpg?v=1473603367790"
                                    oldPrice="450.000"
                                    newPrice="450.000"
                                    discount="0"
                                    title="giầy thể thao buộc dây - f56"
                                />
                            </Col>
                        </Row>
                        <img
                            className={cx('ads-img')}
                            src="https://bizweb.dktcdn.net/100/117/632/themes/157694/assets/banner1.gif?1564585558451"
                            alt=""
                        />
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default Product;
