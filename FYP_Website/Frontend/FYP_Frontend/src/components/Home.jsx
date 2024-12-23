import CategoryList from './CategoryList'
import BannerProduct from './BannerProduct'
import Header from './Header'
import AllRecommendedProducts from './AllRecommendedProducts'
import Footer from './Footer'
import ContactForm from './ContactForm'
import TopRecommendedProducts from './TopRecommendedProducts'


const Home = () => {
    
  return (
    <div>
      
    <Header/>
      <BannerProduct/>
      <CategoryList/>
      <AllRecommendedProducts/>
      <TopRecommendedProducts/>
      <ContactForm/>
      <Footer/>
    </div>
  )
}

export default Home