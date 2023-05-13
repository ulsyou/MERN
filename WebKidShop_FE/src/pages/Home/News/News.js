import Container from 'react-bootstrap/esm/Container';
import Row from 'react-bootstrap/esm/Row';

import Item from './Item/Item';
import classNames from 'classnames/bind';
import styles from './News.module.scss';

const cx = classNames.bind(styles);

function News() {
    return (
        <Container>
            <h2 className={cx('careabout-lable')}>Bài viết mới nhất</h2>
            <h4 className={cx('careabout-desc')}>
                Blog tập hợp những bản tin, bài viết về kinh nghiệm mua sắm, chăm sóc bé và chia sẻ các cung bậc cảm xúc
                hằng ngày. Tập hợp những mẹo vặt để cải thiện của sống của bạn tốt hơn, hoàn hảo hơn.
            </h4>
            <Row>
                <Item
                    src="https://bizweb.dktcdn.net/thumb/medium/100/117/632/articles/ttxk-43.jpg?v=1473010108033"
                    title="Cách nhận biết quần áo trẻ em Việt Nam xuất khẩu xịn"
                    desc="Hiện nay, trên thị trường có rất nhiều vụ quần áo trẻ em hàng Trung Quốc có..."
                />
                <Item
                    src="https://bizweb.dktcdn.net/thumb/medium/100/117/632/articles/chuyen-buon-quan-ao-tre-em-gia-re-cho-cho-tan-binh-1.jpg?v=1473010063163"
                    title="Giúp bạn tiết kiệm chi phí khi mua quần áo trẻ em"
                    desc="Hiện nay trên thị trường có hàng ngàn shop thời trang trẻ em với nhiều mẫu mã..."
                />
                <Item
                    src="https://bizweb.dktcdn.net/thumb/medium/100/117/632/articles/13.jpg?v=1473010026883"
                    title="Những điều cần biết khi mua quần áo trẻ em online"
                    desc="Mua sắm online là xu hướng phổ biến hiện nay của người tiêu dùng nhưng với mặt..."
                />
            </Row>
        </Container>
    );
}

export default News;
