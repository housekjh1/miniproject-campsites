import { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import KakaoMapError from "./KakaoMapError";

const Failure = () => {
    const area = useParams().area;
    const search = useRef();

    useEffect(() => {
        search.current.focus();
    }, [])

    const handleClick = async (e) => {
        e.preventDefault();
        if (search.current.value.trim() === '') return;
        window.location.href = `/search/${search.current.value}`;
    }

    return (
        <div className="font-KOTRAHOPE">
            <div className="bg-white rounded p-5 mt-10 text-center shadow-[0px_0px_40px_-10px_rgba(0,0,0,0.3)] h-[36.5rem] sm:h-[45.5rem] md:h-[45.5rem]">
                <div>
                    <form className="flex flex-col sm:flex-row justify-center items-center gap-3">
                        <input className="font-bold border-slate-300 rounded md:w-[15rem] text-slate-700" ref={search} type="text" id="search" name="search" placeholder="장소를 검색하세요." defaultValue={area && area.trim()} />
                        <button className="p-1.5 px-4 bg-yellow-500 hover:bg-yellow-700 rounded font-bold text-sm text-white" onClick={handleClick}>검색</button>
                    </form>
                </div>
                <div>
                    <KakaoMapError />
                </div>
            </div>
        </div>
    );
}

export default Failure
