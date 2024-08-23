import classNames from 'classnames/bind';
import styles from './Item.module.scss';

const cx = classNames.bind(styles);

function Item(props) {
    // eslint-disable-next-line
    const { id, url, name, size, color, price, quantity } = props;
    const VND = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    });
    return (
        <div className={cx('item-wrap')}>
            <div className={cx('item-product')}>
                <div className={cx('item-img-wrapper')}>
                    <img className={cx('item-img')} src={url} alt="" />
                    <span className={cx('item-quantity')}>{quantity}</span>
                </div>
                <div className={cx('item-info')}>
                    <h3 className={cx('item-name')}>{name}</h3>
                    <h4 className={cx('item-type')}>{`${size} / ${color}`}</h4>
                </div>
            </div>
            <div className={cx('item-price')}>{VND.format(price * quantity)}</div>
        </div>
    );
}

export default Item;
