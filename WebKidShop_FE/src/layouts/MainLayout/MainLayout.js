import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Breadcrumb from 'react-bootstrap/Breadcrumb';

import Header from '../components/Header/Header.js';
import Nav from '../components/Nav/Nav.js';
import Footer from '../components/Footer/Footer.js';

import classNames from 'classnames/bind';
import styles from './MainLayout.module.scss';
import { Link } from 'react-router-dom';

const cx = classNames.bind(styles);
function MainLayout({ page, children }) {
    return (
        <div className="wrapper">
            <Header />
            <Container>
                {page && (
                    <Breadcrumb className={cx('breadcrumb')}>
                        <Breadcrumb.Item>
                            <Link to="/">Trang chủ</Link>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item className={cx('breadcrumb-item')}>{page}</Breadcrumb.Item>
                    </Breadcrumb>
                )}
                {!page && <div className={cx('breadcrumb')}></div>}
                <Row className={cx('content')}>
                    <Col lg="4">
                        <Nav />
                    </Col>
                    <Col lg="8">{children}</Col>
                </Row>
            </Container>
            <Footer />
        </div>
    );
}

export default MainLayout;
