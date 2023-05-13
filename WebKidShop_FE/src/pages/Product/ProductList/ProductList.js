import classNames from 'classnames/bind';
import styles from './ProductList.module.scss';
import Row from 'react-bootstrap/Row';
import axios from 'axios';
import ReactPaginate from 'react-paginate';
import Col from 'react-bootstrap/esm/Col';
import { useEffect, useState } from 'react';
import Select from 'react-select';
import _ from 'lodash';

import NormalProduct from '../../Home/Product/NormalProduct/NormalProduct';

const cx = classNames.bind(styles);

function ProductList() {
    const [productList, setProductList] = useState([]);
    const [products, setProducts] = useState([]);
    const [currentProducts, setCurrentProducts] = useState([]);
    const [pageCount, setPageCount] = useState(0);
    const [promotion, setPromotion] = useState([]);
    const [producttypes, setProducttypes] = useState([]);

    useEffect(() => {
        axios
            .get('http://localhost:8080/api/product')
            .then((res) => {
                let arrObj = res.data;
                var newArr = [];
                arrObj = _.sortBy(arrObj, ['name']);
                for (var i = 0; i < arrObj.length; i++) {
                    if (arrObj[i]?.name !== arrObj[i + 1]?.name) {
                        newArr.push(arrObj[i]);
                    }
                }
                setProductList(newArr);
                setProducts(newArr);
                setCurrentProducts(newArr.slice(0, 12));
                setPageCount(Math.ceil(newArr.length / 12));
            })
            .catch((err) => console.log(err));
    }, []);

    useEffect(() => {
        axios
            .get('http://localhost:8080/api/promotion')
            .then((res) => {
                setPromotion(res.data);
            })
            .catch((err) => console.log(err));
    }, []);

    useEffect(() => {
        axios
            .get('http://localhost:8080/api/producttype')
            .then((res) => {
                setProducttypes(res.data);
            })
            .catch((err) => console.log(err));
    }, []);

    const setDiscount = (promotionID) => {
        const data = promotion.filter((promo) => {
            return promo._id === promotionID;
        });
        return data[0]?.discount;
    };

    const handlePageClick = (e) => {
        const newOffset = (e.selected * 12) % products.length;
        const endOffset = newOffset + 12;
        setCurrentProducts(products.slice(newOffset, endOffset));
        setPageCount(Math.ceil(products.length / 12));
    };

    const handleFilter = (producttype) => {
        const productsFilter = productList.filter((product) => {
            return product.productType === producttype._id;
        });
        setProducts(productsFilter);
        setCurrentProducts(productsFilter.slice(0, 12));
    };

    return (
        <div>
            <img
                className={cx('product-banner')}
                src="//bizweb.dktcdn.net/100/117/632/themes/157694/assets/collection_banner_top.jpg?1564585558451"
                alt=""
            />
            <h2 className={cx('product-lable')}>Tất cả sản phẩm</h2>

            <Row>
                <Col xl={9} md={0}></Col>
                <Col xl={3} md={6}>
                    <Select
                        placeholder="Loại sản phẩm"
                        options={producttypes}
                        getOptionLabel={(option) => option.name}
                        getOptionValue={(option) => option._id}
                        onChange={(producttype) => handleFilter(producttype)}
                        className={cx('select')}
                    />
                </Col>
            </Row>

            <Row>
                {currentProducts.map((product) => {
                    return (
                        <Col key={product._id} xl={3} md={6}>
                            <NormalProduct
                                key={product._id}
                                to={`product/${product.name}`}
                                src={product.productPic}
                                oldPrice={product.price}
                                newPrice={
                                    product.promotion && (product.price * (100 - setDiscount(product.promotion))) / 100
                                }
                                discount={setDiscount(product.promotion)}
                                title={product.name}
                            />
                        </Col>
                    );
                })}
            </Row>
            <ReactPaginate
                breakLabel="..."
                nextLabel=">"
                onPageChange={handlePageClick}
                pageRangeDisplayed={5}
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

export default ProductList;
