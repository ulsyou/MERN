import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';

function OnlyHeader({ children, page }) {
    return (
        <div>
            <Header />
            <div>{children}</div>
            <Footer />
        </div>
    );
}

export default OnlyHeader;
