import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import classNames from 'classnames/bind';
import styles from './Item.module.scss';

const cx = classNames.bind(styles);

function Item({ src, title, desc }) {
    return (
        <Container className={cx('wrapper')}>
            <Row>
                <Col xl={6}>
                    <img className={cx('news-img')} src={src} alt="" />
                </Col>
                <Col xl={6}>
                    <h3 className={cx('news-title')}>{title}</h3>
                    <p className={cx('news-desc')}>{desc}</p>
                    <img
                        src="https://bizweb.dktcdn.net/100/117/632/themes/157694/assets/btn-viewmore.png?1564585558451"
                        alt=""
                    />
                </Col>
            </Row>
        </Container>
    );
}

export default Item;
