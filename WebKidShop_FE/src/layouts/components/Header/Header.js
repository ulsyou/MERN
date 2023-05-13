import Container from 'react-bootstrap/esm/Container';
import Row from 'react-bootstrap/esm/Row';
import classNames from 'classnames/bind';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faBars,
    faCaretDown,
    faCartShopping,
    faMagnifyingGlass,
    faUser,
    faUserPlus,
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../../context/auth';
import { useCart } from '../../../context/cart';
import axios from 'axios';

import styles from './Header.module.scss';

const cx = classNames.bind(styles);

function Header() {
    const navigate = useNavigate();
    const [auth, setAuth] = useAuth();
    const [cart, setCart] = useCart();
    const [searchValue, setSearchValue] = useState();
    const refHeaderNavMenu = useRef();
    const refHeaderProductDropdown = useRef();
    const refInputSearch = useRef();
    const refUserManage = useRef();
    const [showInputSearch, setShowInputSearch] = useState(false);

    const handleClickMenu = () => {
        if (window.screen.width < 992) refHeaderNavMenu.current.classList.toggle(cx('hideOrShow'));
    };

    const handleClickProduct = () => {
        if (window.screen.width < 992) refHeaderProductDropdown.current.classList.toggle(cx('hideOrShow'));
    };

    const handleSearch = (e) => {
        setSearchValue(e.target.value);
    };

    const handleEnter = (e) => {
        if (e.keyCode === 13) {
            navigate(`/search?gender=${searchValue}`);
        }
    };

    const handleSearchMobile = () => {
        setShowInputSearch(!showInputSearch);
        refInputSearch.current.classList.toggle(cx('hideOrShow'));
        refInputSearch.current.focus();
    };

    const handleClickInfo = () => {
        refUserManage.current.classList.toggle(cx('hideOrShow'));
    };

    const handleLogout = (e) => {
        e.preventDefault();
        setAuth({
            ...auth,
            user: null,
        });
        localStorage.removeItem('auth');
        setCart({});
        localStorage.removeItem('cart');
        window.location.reload(true);
        navigate('/');
    };

    const [categories, setCategories] = useState([]);
    useEffect(() => {
        axios
            .get('http://localhost:8080/api/category')
            .then((res) => setCategories(res.data))
            .catch((err) => console.log(err));
    }, []);

    // Lay thong tin cart
    useEffect(() => {
        axios.get(`http://localhost:8080/api/cart/${auth.user?._id}`).then((res) => {
            setCart({ ...cart, cart: res.data });
            localStorage.setItem('cart', JSON.stringify(res.data));
        });
    }, [auth, cart, setCart]);

    return (
        <div className={cx('header')}>
            <Container>
                <Row>
                    <div className={cx('header-service')}>
                        <div className={cx('header-service-left')}>
                            {!auth.user && (
                                <div>
                                    <Link to="/account/login" className={cx('header-service-signup')}>
                                        <FontAwesomeIcon icon={faUser} /> Đăng nhập
                                    </Link>
                                    <Link to="/account/register" className={cx('header-service-signin')}>
                                        <FontAwesomeIcon icon={faUserPlus} /> Đăng ký
                                    </Link>
                                </div>
                            )}
                        </div>

                        <div className={cx('header-service-right')}>
                            <div className={cx('header-service-search')}>
                                <input
                                    className={cx('header-search-input')}
                                    value={searchValue}
                                    placeholder="Tìm kiếm"
                                    onChange={handleSearch}
                                    onKeyDown={handleEnter}
                                />
                                <Link to={`/search?gender=${searchValue}`} className={cx('header-search-icon')}>
                                    <FontAwesomeIcon icon={faMagnifyingGlass} />
                                </Link>
                            </div>
                            <Link to="/cart" className={cx('header-service-cart')}>
                                <FontAwesomeIcon icon={faCartShopping} />
                                <span className={cx('header-service-cart-quantity')}>
                                    {cart.cart?.cartDetails.reduce((total, item) => {
                                        return total + item.quantity;
                                    }, 0)}
                                </span>
                            </Link>
                            {auth.user && (
                                <div className={cx('header-info')} onClick={handleClickInfo}>
                                    <span
                                        className={cx('header-info-name')}
                                    >{`${auth.user.firstName} ${auth.user.lastName}`}</span>
                                    <img
                                        className={cx('header-info-avatar')}
                                        src="https://media.istockphoto.com/id/1300845620/vector/user-icon-flat-isolated-on-white-background-user-symbol-vector-illustration.jpg?s=612x612&w=0&k=20&c=yBeyba0hUkh14_jgv1OKqIH0CCSWU_4ckRkAoy2p73o="
                                        alt=""
                                    />

                                    <ul ref={refUserManage} className={cx('header-manage-list')}>
                                        <Link to={`/account/profile/123`}>
                                            <li className={cx('header-manage-item')}>Thông tin cá nhân</li>
                                        </Link>
                                        <Link>
                                            <li className={cx('header-manage-item')}>Lịch sử đặt hàng</li>
                                        </Link>
                                        <Link onClick={handleLogout}>
                                            <li className={cx('header-manage-item')}>Đăng xuất</li>
                                        </Link>
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                </Row>
            </Container>
            <nav className={cx('header-nav')}>
                <Container>
                    <div className={cx('header-wrapper-logo')}>
                        <FontAwesomeIcon icon={faBars} className={cx('header-nav-menu')} onClick={handleClickMenu} />
                        <Link className={cx('header-nav-logo')} to="/">
                            <img
                                className={cx('header-logo')}
                                src="https://bizweb.dktcdn.net/100/117/632/themes/157694/assets/logo.png?1564585558451"
                                alt=""
                            />
                        </Link>
                        <div className={cx('header-wrapper-btn')}>
                            <Link to="">
                                <FontAwesomeIcon
                                    icon={faMagnifyingGlass}
                                    className={cx('header-btn-on-mobile')}
                                    onClick={handleSearchMobile}
                                />
                            </Link>

                            <Link to="">
                                <FontAwesomeIcon icon={faCartShopping} className={cx('header-btn-on-mobile')} />
                            </Link>
                        </div>
                    </div>

                    <div ref={refHeaderNavMenu} className={cx('header-nav-list')}>
                        <ul className={cx('header-nav-list-left')}>
                            <Link to="/" className={cx('header-nav-list-item')} onClick={handleClickMenu}>
                                Trang chủ
                            </Link>
                            <Link to="/intro" className={cx('header-nav-list-item')} onClick={handleClickMenu}>
                                Giới thiệu
                            </Link>
                            <Link to="/service" className={cx('header-nav-list-item')} onClick={handleClickMenu}>
                                Dịch vụ
                            </Link>
                        </ul>
                        <ul className={cx('header-nav-list-right')}>
                            <Link className={cx('header-nav-list-item')} onClick={handleClickProduct}>
                                Sản phẩm <FontAwesomeIcon icon={faCaretDown} />
                                <ul ref={refHeaderProductDropdown} className={cx('product-dropdown')}>
                                    <Link to={`/category`} className={cx('product-type')} onClick={handleClickMenu}>
                                        Tất cả sản phẩm
                                    </Link>
                                    {categories.map((category) => {
                                        return (
                                            <Link
                                                key={category._id}
                                                to={`/category/${category.name}`}
                                                className={cx('product-type')}
                                                onClick={handleClickMenu}
                                            >
                                                {category.name}
                                            </Link>
                                        );
                                    })}

                                    <>
                                        {window.screen.width > 992 && (
                                            <img
                                                src="https://bizweb.dktcdn.net/100/117/632/themes/157694/assets/bg-cate.jpg"
                                                alt=""
                                            />
                                        )}
                                    </>
                                </ul>
                            </Link>
                            <Link to="/news" className={cx('header-nav-list-item')} onClick={handleClickMenu}>
                                Tin tức
                            </Link>
                            <Link to="/contact" className={cx('header-nav-list-item')} onClick={handleClickMenu}>
                                Liên hệ
                            </Link>
                        </ul>
                    </div>
                </Container>
            </nav>
            <div>
                <input
                    ref={refInputSearch}
                    type="text"
                    value={searchValue}
                    placeholder="Tìm kiếm"
                    onChange={handleSearch}
                    onKeyDown={handleEnter}
                    className={cx('header-search-mobile')}
                />
            </div>
        </div>
    );
}

export default Header;
