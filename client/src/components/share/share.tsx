import "./share.scss";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/authContext";
import {
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import { makeRequest } from "../../axios";
import type { AxiosResponse } from "axios";


type NewPost = {
  desc: string;
  img?: string; 
};

const Share = () => {
  const [file, setFile ] = useState<File | null>(null);
  const [desc, setDesc ] = useState("");

  const upload = async ()=> {
    try {
      if (!file) return null;
      const formData = new FormData();
      formData.append("file", file)
      const res = await makeRequest.post("/upload", formData)
      return res.data
    } catch(err) {
      console.log(err)
    }
  }


  const {currentUser} = useContext(AuthContext)

  const queryClient = useQueryClient()

  const mutation = useMutation<AxiosResponse<any>, Error, NewPost>({
  mutationFn: (newPost: NewPost) => makeRequest.post("/posts", newPost),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['posts'] });
  },
});

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
  e.preventDefault();
    let imgUrl = "";
    if(file) imgUrl = await upload()
    mutation.mutate({desc, img: imgUrl})

    setDesc("")
    setFile(null)

};
  return (
    <div className="share">
      <div className="container">
        <div className="top">
          <div className="left">
          <img
            src={currentUser?.imgUrl}
            alt=""
          />
          <input type="text" placeholder={`Что нового, ${currentUser?.name}?`} onChange={(e) => setDesc(e.target.value)} value={desc}/>
          </div>
          <div className="right">
            {file && <img className="file" alt="" src={URL.createObjectURL(file)}/>}
          </div>
        </div>
        <hr />
        <div className="bottom">
          <div className="left">
            <input type="file" id="file" style={{display:"none"}} onChange={(e) => setFile(e.target.files?.[0] || null) }/>
            <label htmlFor="file">
              <div className="item">
                <span>Добавить изображение </span>
              </div>
            </label>
            <div className="item">
              <span>Добавить теги</span>
            </div>
            <div className="item">
              <span>Отметить друзей</span>
            </div>
          </div>
          <div className="right">
            <button onClick = {handleClick}>Поделиться</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Share;