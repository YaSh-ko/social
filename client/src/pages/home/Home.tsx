import Posts from '../../components/posts/Posts';
import Stories from '../../components/stories/Stories';
import './home.scss'
import { useContext } from "react";
import { AuthContext } from "../../context/authContext";

const Home = () => {
    const { currentUser } = useContext(AuthContext);
    return (
        <div className='home'>
            <Stories/>
            <Posts />
        </div>
    )
}

export default Home;