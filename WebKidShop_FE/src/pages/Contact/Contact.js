import Row from 'react-bootstrap/esm/Row';

import classNames from 'classnames/bind';
import styles from './Contact.module.scss';

const cx = classNames.bind(styles);

function Contact() {
    return (
        <div>
            <Row>
                <h1 className={cx('contact-lable')}>Liên hệ</h1>
            </Row>
            <h2 className={cx('contact-title')}>
                KidShop - <span className={cx('contact-shopname')}>Thời trang trẻ em</span>
            </h2>
            <p className={cx('contact-desc')}>
                KidShop chuyên bán quần áo trẻ em online với hàng ngàn mẫu mã để quý khách lựa chọn cho bé yêu của bạn.
                Hãy đặt hàng online để được hưởng nhiều ưu đãi hơn tại siêu thị mẹ và bé KidShop.
            </p>
            <p className={cx('contact-desc')}>
                Chọn mua ngay các mẫu quần áo trẻ em mới nhất trong danh mục "Hàng mới nhất"
            </p>
            <h3 className={cx('contact-subtitle')}>Thông tin liên hệ nhanh</h3>
            <h4 className={cx('contact-social')}>Hotline: 0214.5654.66</h4>
            <h4 className={cx('contact-social')}>Zalo: 0214.5654.66</h4>
            <h4 className={cx('contact-social')}>FB: support.bizweb.vn</h4>
        </div>
    );
}

export default Contact;
