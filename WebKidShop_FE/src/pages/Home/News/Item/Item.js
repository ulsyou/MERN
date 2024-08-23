import Col from 'react-bootstrap/esm/Col';

import classNames from 'classnames/bind';
import styles from './Item.module.scss';

const cx = classNames.bind(styles);

function Item({ src, title, desc }) {
    return (
        <Col className={cx('news')}>
            <img className={cx('news-img')} src={src} alt="" />
            <div className={cx('news-info')}>
                <h4 className={cx('news-title')}>{title}</h4>
                <p className={cx('news-desc')}>{desc}</p>
            </div>
        </Col>
    );
}

export default Item;
