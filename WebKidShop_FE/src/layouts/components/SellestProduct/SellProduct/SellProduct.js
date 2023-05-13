import Col from 'react-bootstrap/esm/Col';

import classNames from 'classnames/bind';
import styles from './SellProduct.module.scss';
import { NavLink } from 'react-router-dom';

const cx = classNames.bind(styles);

function SellerProduct(props) {
    const { src, title, oldPrice, newPrice, to } = props;
    return (
        <NavLink to={to}>
            <Col xl={12} className={cx('sell-product')}>
                <img className={cx('product-img')} src={src} alt="product" />
                <div>
                    <h5 className={cx('product-title')}>{title}</h5>
                    <h5 className={cx('product-new-price')}>{newPrice}</h5>
                    <h5 className={cx('product-old-price')}>{oldPrice}</h5>
                </div>
            </Col>
        </NavLink>
    );
}

export default SellerProduct;
