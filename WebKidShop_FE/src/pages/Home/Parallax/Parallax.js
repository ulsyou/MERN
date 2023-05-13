import { faCircleQuestion, faFileLines, faGift, faHandshakeSimple } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Container from 'react-bootstrap/esm/Container';
import Row from 'react-bootstrap/esm/Row';
import classNames from 'classnames/bind';
import styles from './Parallax.module.scss';

import Item from './Item/Item';

const cx = classNames.bind(styles);

function Parallax() {
    return (
        <div className={cx('parallax')}>
            <div className={cx('parallax-section')}>
                <Container>
                    <h2 className={cx('parallax-lable')}>Chính sách & hướng dẫn của kidshop !</h2>
                    <Row>
                        <Item
                            title="Chính sách mua bán, trao đổi hàng"
                            desc="Chúng tôi gửi đến bạn những chính sách mua hàng, đổi trả, vận chuyển để đảm bảo được tính công bằng và rõ ràng giữa hai bên"
                        >
                            <FontAwesomeIcon icon={faHandshakeSimple} />
                        </Item>
                        <Item
                            title="Hướng dẫn mua hàng online"
                            desc="Quý khách có thể gửi đơn hàng hoặc goi trực tiếp tới số Hotline để đặt hàng"
                        >
                            <FontAwesomeIcon icon={faCircleQuestion} />
                        </Item>
                    </Row>
                    <Row>
                        <Item
                            title="Chính sách mua bán, trao đổi hàng"
                            desc="Chúng tôi gửi đến bạn những chính sách mua hàng, đổi trả, vận chuyển để đảm bảo được tính công bằng và rõ ràng giữa hai bên"
                        >
                            <FontAwesomeIcon icon={faFileLines} />
                        </Item>
                        <Item
                            title="Quà tặng, giải thưởng, khuyến mãi"
                            desc="Để tri ân khách hàng,gửi tặng đến toàn bộ những khách hàng những món quà tuyệt vời đã ủng hộ chúng tôi trong thời gian qua"
                        >
                            <FontAwesomeIcon icon={faGift} />
                        </Item>
                    </Row>
                </Container>
            </div>
        </div>
    );
}

export default Parallax;
