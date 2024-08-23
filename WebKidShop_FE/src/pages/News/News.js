import { Link } from 'react-router-dom';
import Row from 'react-bootstrap/esm/Row';

import classNames from 'classnames/bind';
import styles from './News.module.scss';

import Item from './Item/Item';

const cx = classNames.bind(styles);

function News() {
    return (
        <div>
            <Row>
                <h1 className={cx('news-lable')}>Cẩm nang cho mẹ</h1>
            </Row>

            <Link to="">
                <Item
                    src="https://bizweb.dktcdn.net/thumb/large/100/117/632/articles/ttxk-43.jpg?v=1473010108033"
                    title="Cách nhận biết quần áo trẻ em Việt Nam xuất khẩu xịn"
                    desc="Hiện nay, trên thị trường có rất nhiều vụ quần áo trẻ em hàng Trung Quốc có nhiễm độc tố, chất
                        gây ung thư…Nên tâm lý người tiêu dùng muốn mua các loại quần áo trẻ em made in viet nam . Tuy
                        nhiên, không phải shop quần áo nào cũng đều bán quần áo trẻ em xuất khẩu . Timishop.vn xin chia
                        sẻ một số kinh nghiệm giúp người tiêu dùng có thể phân biệt được quần áo trẻ em Việt Nam xuất
                        khẩu xịn."
                />
            </Link>

            <Link to="">
                <Item
                    src="https://bizweb.dktcdn.net/thumb/large/100/117/632/articles/chuyen-buon-quan-ao-tre-em-gia-re-cho-cho-tan-binh-1.jpg?v=1473010063163"
                    title="Giúp bạn tiết kiệm chi phí khi mua quần áo trẻ em"
                    desc="Hiện nay trên thị trường có hàng ngàn shop thời trang trẻ em với nhiều mẫu mã đa dạng, phong phú khiến mẹ gặp nhiều khó khăn khi lựa chọn cho con mình những bộ quần áo vừa có chất lượng tốt, vừa phù hợp với túi tiền. Sau đây Timishop xin giới thiệu một số mẹo giúp tiết kiệm chi phí khi mẹ đi mua quần áo cho bé."
                />
            </Link>
            <Link to="">
                <Item
                    src="https://bizweb.dktcdn.net/thumb/large/100/117/632/articles/13.jpg?v=1473010026883"
                    title="Những điều cần biết khi mua quần áo trẻ em online"
                    desc="Trong thời buổi công nghệ số hiện nay, các trang diễn đàn, mạng xã hội đã trở thành mảnh đất màu mỡ để kinh doanh, buôn bán vô số mặt hàng khác nhau như đồ gia dụng, trang sức, quần áo trẻ em, người lớn, mỹ phẩm,… Chỉ cần có máy tính kết nối mạng, người tiêu dùng có thể thoả sức lựa chọn mọi mặt hàng mình đang có nhu cầu mua và thực hiện mua hàng qua mạng."
                />
            </Link>
        </div>
    );
}

export default News;
