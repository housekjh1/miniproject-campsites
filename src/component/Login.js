import { Box, Modal } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { TEAnimation } from "tw-elements-react";

const Login = () => {
  const id = useRef();

  useEffect(() => {
    id.current.focus();
    const isAuthenticated = localStorage.getItem('jwt');
    if (isAuthenticated) {
      window.location.href = '/';
    }
  }, [])

  const [user, setUser] = useState({
    username: '',
    password: ''
  });

  const [open, setOpen] = useState(false);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  }

  const login = async () => {
    if (user.username.trim() === '' || user.password.trim() === '') {
      setOpen(true);
      id.current.focus();
      return;
    }
    await fetch(process.env.REACT_APP_SERVER_URL + 'login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user)
    })
      .then(resp => {
        const jwtToken = resp.headers.get('Authorization');
        if (jwtToken !== null) {
          localStorage.setItem("jwt", jwtToken);
          localStorage.setItem('name', user['username']);
          window.location.href = '/';
        } else {
          setOpen(true);
          id.current.focus();
        }
      })
      .catch(e => console.log(e));
  }

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
  };

  const closeModal = () => {
    setOpen(false);
  }

  const handleOnKeyPress = (e) => {
    if (e.key === 'Enter') {
      login();
    }
  };

  const handleModal = (e) => {
    if (e.key === 'Enter') {
      closeModal();
    }
  }

  return (
    <div className="font-KOTRAHOPE">
      <div className="flex justify-center items-start">
        <div className="bg-white rounded p-5 mt-10 text-center shadow-[0px_0px_40px_-10px_rgba(0,0,0,0.3)] h-auto md:w-[25rem] flex justify-center items-center">
          <div className="border-dashed rounded border-2 border-slate-500 p-10 my-5 md:w-[20rem] flex justify-center items-center">
            <div className="flex flex-col gap-4 font-bold">
              <p className="text-4xl font-bold text-slate-500 mb-5">Login</p>
              <input ref={id} className="border-slate-300 rounded md:w-[15rem]" type="text" name="username" placeholder="아이디를 입력하세요." onChange={handleChange} onKeyPress={handleOnKeyPress} />
              <input className="border-slate-300 rounded md:w-[15rem]" type="password" name="password" placeholder="비밀번호를 입력하세요." onChange={handleChange} onKeyPress={handleOnKeyPress} />
              <div className="flex flex-col md:flex-row justify-between items-center">
                <button className="basis-2/5 p-2 px-1 text-lg w-[5rem] bg-yellow-500 hover:bg-yellow-700 font-bold text-white rounded mt-5" onClick={login}>Login</button>
                <p className="basis-2/5 text-slate-500 hover:text-blue-500 text-lg mt-[1.25rem] font-bold"><Link to='/join'>회원가입</Link></p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal open={open} onClose={closeModal} className="font-KOTRAHOPE" onKeyPress={handleModal}>
        <Box sx={style} className="rounded-lg w-auto">
          <TEAnimation
            animation="[shake_0.5s]"
            start="onLoad"
          >
            <div>
              <p className="text-2xl text-center font-bold">아이디 또는 비밀번호를 확인해 주세요.</p>
            </div>
          </TEAnimation>
        </Box>
      </Modal>
    </div>
  )
}

export default Login