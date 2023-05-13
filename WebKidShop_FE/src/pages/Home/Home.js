import Banner from './Banner/Banner';
import Parallax from './Parallax/Parallax';
import Product from './Product/Product';
import CareAbout from './CareAbout/CareAbout';
import News from './News/News';

function Home() {
    return (
        <div>
            <Banner />
            <Product />
            <Parallax />
            <CareAbout />
            <News />
        </div>
    );
}

export default Home;
