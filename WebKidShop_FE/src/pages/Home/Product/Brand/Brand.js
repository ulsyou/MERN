import Col from 'react-bootstrap/esm/Col';

import classNames from 'classnames/bind';
import styles from './Brand.module.scss';

const cx = classNames.bind(styles);

function Brand({ src }) {
    return (
        <Col xl={6} className={cx('brand')}>
            <img src={src} alt="logo-brand" />
        </Col>
    );
}

export default Brand;
