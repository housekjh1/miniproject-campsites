import { useEffect } from "react";

const KakaoMapMain = () => {
    useEffect(() => {
        const mapScript = document.createElement('script');
        mapScript.async = true;
        mapScript.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.REACT_APP_KAKAO_MAP_API_KEY}&autoload=false`;
        document.head.appendChild(mapScript);

        const onLoadKakaoMap = () => {
            window.kakao.maps.load(() => {
                const mapContainer = document.getElementById('map');
                const mapOption = {
                    center: new window.kakao.maps.LatLng(36.300000, 127.800000), // 지도의 중심좌표
                    level: 12, // 지도의 확대 레벨
                };
                new window.kakao.maps.Map(mapContainer, mapOption);
            });
        };
        mapScript.addEventListener('load', onLoadKakaoMap);
    }, []);

    return (
        <div>
            <div id="map" className="mt-5 h-[32.25rem] sm:h-[39.125rem] md:h-[39.125rem] rounded shadow-[0px_0px_10px_0px_rgba(0,0,0,0.3)]"></div>
        </div>
    )
}

export default KakaoMapMain