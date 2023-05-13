import Row from 'react-bootstrap/Row';
import axios from 'axios';
import ReactPaginate from 'react-paginate';
import Col from 'react-bootstrap/esm/Col';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import NormalProduct from '../Home/Product/NormalProduct/NormalProduct';

import classNames from 'classnames/bind';
import styles from './Search.module.scss';

const cx = classNames.bind(styles);

function Search() {
    const location = useLocation();
    const [products, setProducts] = useState([]);
    const [currentProducts, setCurrentProducts] = useState([]);
    const [pageCount, setPageCount] = useState(0);
    const [searchValue, setSearchKey] = useState('');

    useEffect(() => {
        const getProducts = async () => {
            try {
                const queryString = window.location.search;
                const urlParams = new URLSearchParams(queryString);
                const gender = urlParams.get('gender');
                setSearchKey(gender);
                //get data from product
                const res = await axios.get(`https://gorest.co.in/public/v2/users`, {
                    params: { gender: gender },
                });
                const product = res.data;
                setProducts(product);
                setCurrentProducts(product.slice(0, 12));
                setPageCount(Math.ceil(product.length / 12));
            } catch (e) {
                console.log(e);
            }
        };
        getProducts();
    }, [location]);

    const handlePageClick = (e) => {
        const newOffset = (e.selected * 12) % products.length;
        const endOffset = newOffset + 12;
        setCurrentProducts(products.slice(newOffset, endOffset));
        setPageCount(Math.ceil(products.length / 12));
    };
    return (
        <div>
            <Row>
                <h1 className={cx('search-lable')}>Kết quả tìm kiếm với từ khóa: {searchValue}</h1>
            </Row>
            <Row>
                {currentProducts.map((product) => {
                    return (
                        <Col xl={3} md={6}>
                            <NormalProduct
                                src="https://bizweb.dktcdn.net/thumb/large/100/117/632/products/giay5-6ad05ccc-be71-4eca-83f8-3e73a5570372-42da6097-d9b3-437a-afe5-66c1be4352b4-8a365fca-ef0a-415a-838e-f172e148cb7c.jpg?v=1473603367790"
                                oldPrice="450.000"
                                newPrice="450.000"
                                discount="0"
                                title="giầy thể thao buộc dây - f56"
                            />
                        </Col>
                    );
                })}
            </Row>
            <ReactPaginate
                breakLabel="..."
                nextLabel=">"
                onPageChange={handlePageClick}
                pageRangeDisplayed={3}
                pageCount={pageCount}
                previousLabel="<"
                renderOnZeroPageCount={null}
                containerClassName={cx('pagination')}
                pageLinkClassName={cx('page-num')}
                previousLinkClassName={cx('page-num')}
                nextLinkClassName={cx('page-num')}
                activeLinkClassName={cx('active')}
            />
        </div>
    );
}

export default Search;
