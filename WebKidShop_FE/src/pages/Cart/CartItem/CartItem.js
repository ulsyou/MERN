import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../../context/auth';
import classNames from 'classnames/bind';
import styles from './CartItem.module.scss';
import axios from 'axios';
import { useState } from 'react';

const cx = classNames.bind(styles);

function CartItem(props) {
    const [auth] = useAuth();

    const { id, url, name, color, size, price, quantity, cb } = props;
    const [value, setValue] = useState(quantity);
    const VND = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    });

    const onChange = (e) => {
        e.preventDefault();
        setValue(e.target.value);
        cb({ productId: id, quantity: e.target.value });
    };

    const handleDelete = (e) => {
        e.preventDefault();

        axios
            .delete(`http://localhost:8080/api/cart/delete/${auth.user._id}/${id}`)
            .then((res) => console.log('Deleted success'))
            .catch((err) => console.log(err));
    };
    return (
        <tr>
            <td className={cx('cart-td')}>
                <img className={cx('cart-img')} src={url} alt="" />
            </td>
            <td className={cx('cart-td')}>{`${name} / ${color} / ${size}`}</td>
            <td className={cx('cart-td')}>{VND.format(price)}</td>
            <td className={cx('cart-td')}>
                <input
                    type="number"
                    name="quantity"
                    min="1"
                    max={Infinity}
                    value={value}
                    onChange={onChange}
                    className={cx('cart-td-quantity')}
                />
            </td>
            <td className={cx('cart-td')}>{VND.format(price * quantity)}</td>
            <td className={cx('cart-td')}>
                <button onClick={handleDelete}>
                    <FontAwesomeIcon icon={faTrashCan} />
                </button>
            </td>
        </tr>
    );
}

export default CartItem;
