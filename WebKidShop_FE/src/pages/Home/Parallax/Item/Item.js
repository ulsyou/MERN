import Col from 'react-bootstrap/esm/Col';

import classNames from 'classnames/bind';
import styles from './Item.module.scss';

const cx = classNames.bind(styles);

function Item({ children, title, desc }) {
    return (
        <Col className={cx('parallax-item')}>
            <span className={cx('item-icon')}>{children}</span>
            <div className={cx('item-info')}>
                <h3 className={cx('item-title')}>{title}</h3>
                <h4 className={cx('item-desc')}>{desc}</h4>
            </div>
        </Col>
    );
}

export default Item;
