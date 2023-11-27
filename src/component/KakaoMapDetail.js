import { useEffect } from "react";

const KakaoMapDetail = ({ data }) => {
    useEffect(() => {
        const mapScript = document.createElement('script');
        mapScript.async = true;
        mapScript.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.REACT_APP_KAKAO_MAP_API_KEY}&autoload=false`;
        document.head.appendChild(mapScript);

        let initLat = 0;
        let initLng = 0;
        let minLat = 99;
        let maxLat = 0;
        data.map(item => {
            initLat += item.lat;
            initLng += item.lng;
            if (item.lat < minLat) minLat = item.lat;
            if (item.lat > maxLat) maxLat = item.lat;
        });
        initLat /= data.length;
        initLng /= data.length;
        const subLat = maxLat - minLat;

        const onLoadKakaoMap = () => {
            window.kakao.maps.load(() => {
                const mapContainer = document.getElementById('map');

                const mapOption = {
                    center: new window.kakao.maps.LatLng(initLat, initLng),
                    level: subLat > 0.75 ? 13 : 10
                };

                let map = new window.kakao.maps.Map(mapContainer, mapOption);

                const positions = data.map(item => ({
                    content: `<div className="rounded"><div>사진</div><div className="text-center">${item.campName}</div></div>`,
                    latlng: new window.kakao.maps.LatLng(item.lat, item.lng)
                }));


                for (let i = 0; i < positions.length; i++) {
                    let marker = new window.kakao.maps.Marker({
                        map: map,
                        position: positions[i].latlng
                    });

                    let infowindow = new window.kakao.maps.InfoWindow({
                        content: positions[i].content
                    });

                    new window.kakao.maps.event.addListener(marker, 'mouseover', makeOverListener(map, marker, infowindow));
                    new window.kakao.maps.event.addListener(marker, 'mouseout', makeOutListener(infowindow));

                    // 마커에 클릭이벤트를 등록합니다
                    new window.kakao.maps.event.addListener(marker, 'click', function () {
                        // 마커 위에 인포윈도우를 표시합니다
                        infowindowClick.open(map, marker);
                    });
                }

                function makeOverListener(map, marker, infowindow) {
                    return function () {
                        infowindow.open(map, marker);
                    };
                }

                function makeOutListener(infowindow) {
                    return function () {
                        infowindow.close();
                    };
                }

                let iwContent = '<div style="padding:5px;">Hello World!</div>', // 인포윈도우에 표출될 내용으로 HTML 문자열이나 document element가 가능합니다
                    iwRemoveable = true; // removeable 속성을 ture 로 설정하면 인포윈도우를 닫을 수 있는 x버튼이 표시됩니다

                // 인포윈도우를 생성합니다
                let infowindowClick = new window.kakao.maps.InfoWindow({
                    content: iwContent,
                    removable: iwRemoveable
                });
            });
        };

        mapScript.addEventListener('load', onLoadKakaoMap);

        return () => {
            document.head.removeChild(mapScript);
        };

    }, []);

    return (
        <div>
            <div id="map" className="mt-5 h-[32.25rem] sm:h-[39.125rem] md:h-[39.125rem] rounded shadow-[0px_0px_10px_0px_rgba(0,0,0,0.3)]"></div>
        </div>
    );
};

export default KakaoMapDetail;