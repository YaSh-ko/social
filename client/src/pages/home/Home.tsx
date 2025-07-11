import { useContext } from 'react';
import Posts from '../../components/posts/Posts';
import Stories from '../../components/stories/Stories';
import './home.scss'
import Share from '../../components/share/share';

const Home = () => {
    return (
        <div className='home'>
            <Stories/>
            <Share/>
            <Posts />
        </div>
    )
}

export default Home;