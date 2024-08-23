import { NavLink } from 'react-router-dom';

import classNames from 'classnames/bind';
import styles from './NormalProduct.module.scss';

const cx = classNames.bind(styles);

function NormalProduct(props) {
    const { src, oldPrice, newPrice, discount, title, to } = props;
    const VND = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    });

    return (
        <div className={cx('wrapper')}>
            <NavLink to={to} className={cx('normal-product')}>
                <div>
                    <img className={cx('product-img')} src={src} alt="" />
                </div>
                <div className={cx('product-info')}>
                    <h5 className={cx('product-new-price')}>{!!discount && VND.format(newPrice)}</h5>
                    <h5 className={cx('product-old-price', !!discount && cx('product-old-price-line'))}>
                        {VND.format(oldPrice)}
                    </h5>
                    <h5 className={cx('product-title')}>{title}</h5>
                    <img
                        src="https://bizweb.dktcdn.net/100/117/632/themes/157694/assets/btn-buy.png?1564585558451"
                        alt=""
                    />
                    {!!discount && <div className={cx('product-discount')}>{discount}%</div>}
                </div>
            </NavLink>
        </div>
    );
}

export default NormalProduct;
