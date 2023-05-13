import Container from 'react-bootstrap/esm/Container';
import Row from 'react-bootstrap/esm/Row';
import Col from 'react-bootstrap/esm/Col';
import { Link } from 'react-router-dom';

import classNames from 'classnames/bind';
import styles from './Footer.module.scss';

const cx = classNames.bind(styles);

function Footer() {
    return (
        <div className={cx('wrapper')}>
            <div>
                <Container>
                    <Row>
                        <Col xl={4} md={4}>
                            <div className={cx('quicklinks-title')}>Liên hệ với chúng tôi</div>
                            <div className={cx('quicklinks-text')}>Khu II, Đại học Cần Thơ</div>
                            <div className={cx('quicklinks-text')}>(04) 6674 2332 - (04) 6674 2332</div>
                            <div className={cx('quicklinks-text')}>Trực 8h00 - 20h00 từ thứ 2 đến thứ 6</div>
                        </Col>
                        <Col xl={2} md={2}>
                            <div className={cx('quicklinks-title')}>Thông tin</div>
                            <Link to="" className={cx('quicklinks-btn')}>
                                Tài khoản của bạn
                            </Link>
                            <Link to="" className={cx('quicklinks-btn')}>
                                Lịch sử mua hàng
                            </Link>
                            <Link to="" className={cx('quicklinks-btn')}>
                                Chính sách mua bán
                            </Link>
                            <Link to="" className={cx('quicklinks-btn')}>
                                Hướng dẫn mua online
                            </Link>
                            <Link to="" className={cx('quicklinks-btn')}>
                                Liên hệ
                            </Link>
                        </Col>
                        <Col xl={2} md={2}>
                            <div className={cx('quicklinks-title')}>Sản phẩm</div>
                            <Link to="" className={cx('quicklinks-btn')}>
                                Tất cả sản phẩm
                            </Link>
                            <Link to="" className={cx('quicklinks-btn')}>
                                Góc bé trai
                            </Link>
                            <Link to="" className={cx('quicklinks-btn')}>
                                Góc bé gái
                            </Link>
                            <Link to="" className={cx('quicklinks-btn')}>
                                Phụ kiện
                            </Link>
                            <Link to="" className={cx('quicklinks-btn')}>
                                Khuyễn mãi
                            </Link>
                            <Link to="" className={cx('quicklinks-btn')}>
                                Danh mục trống
                            </Link>
                        </Col>
                        <Col xl={2} md={2}>
                            <div className={cx('quicklinks-title')}>LIÊN KẾT BLOG</div>
                            <Link to="" className={cx('quicklinks-btn')}>
                                Cẩm nang cho mẹ
                            </Link>
                            <Link to="" className={cx('quicklinks-btn')}>
                                Chương trình ưu đãi
                            </Link>
                            <Link to="" className={cx('quicklinks-btn')}>
                                Tin thời trang
                            </Link>
                            <Link to="" className={cx('quicklinks-btn')}>
                                Góc chia sẻ
                            </Link>
                            <Link to="" className={cx('quicklinks-btn')}>
                                Ảnh chia sẻ
                            </Link>
                        </Col>
                        <Col xl={2} md={2}>
                            <div className={cx('quicklinks-title')}>Chính sách</div>
                            <Link to="" className={cx('quicklinks-btn')}>
                                Tất cả sản phẩm
                            </Link>
                            <Link to="" className={cx('quicklinks-btn')}>
                                Góc bé trai
                            </Link>
                            <Link to="" className={cx('quicklinks-btn')}>
                                Góc bé gái
                            </Link>
                            <Link to="" className={cx('quicklinks-btn')}>
                                Phụ kiện
                            </Link>
                            <Link to="" className={cx('quicklinks-btn')}>
                                Khuyễn mãi
                            </Link>
                            <Link to="" className={cx('quicklinks-btn')}>
                                Danh mục trống
                            </Link>
                        </Col>
                    </Row>
                </Container>
            </div>
            <div className={cx('footer')}>
                <h3 className={cx('footer-text')}>&copy; Bản quyền thuộc về MyTeam</h3>
            </div>
        </div>
    );
}

export default Footer;
