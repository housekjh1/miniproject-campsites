import { useEffect } from "react";

const KakaoMapDetail = ({ data, area }) => {
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

                let mapTypeControl = new window.kakao.maps.MapTypeControl();
                map.addControl(mapTypeControl, window.kakao.maps.ControlPosition.TOPRIGHT);

                const positions = data.map(item => ({
                    content: `<div><div>${item.campName}</div><div>&nbsp;</div></div>`,
                    latlng: new window.kakao.maps.LatLng(item.lat, item.lng),
                    camp: item.campName
                }));

                for (let i = 0; i < positions.length; i++) {
                    let marker = new window.kakao.maps.Marker({
                        map: map,
                        position: positions[i].latlng
                    });

                    let infowindow = new window.kakao.maps.InfoWindow({
                        content: positions[i].content
                    });

                    let infowindowClick = new window.kakao.maps.InfoWindow({
                        content: `<div><div>${positions[i].camp}</div><a href="/campsite/${area}/${positions[i].camp}">자세히 알아보기</a><div>&nbsp;</div></div>`,
                        removable: true
                    });

                    new window.kakao.maps.event.addListener(marker, 'mouseover', makeOverListener(map, marker, infowindow));
                    new window.kakao.maps.event.addListener(marker, 'mouseout', makeOutListener(infowindow));

                    // 마커에 클릭이벤트를 등록합니다
                    new window.kakao.maps.event.addListener(marker, 'click', makeClickListener(map, marker, infowindowClick));
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

                function makeClickListener(map, marker, infowindowClick) {
                    return function () {
                        // 클릭 시 인포윈도우 열 때 내용을 동적으로 설정
                        infowindowClick.open(map, marker);
                    };
                }
            });
        };

        mapScript.addEventListener('load', onLoadKakaoMap);

        return () => {
            document.head.removeChild(mapScript);
        };

    }, [data]);

    return (
        <div>
            <div id="map" className="mt-5 h-[32.25rem] sm:h-[39.125rem] md:h-[39.125rem] rounded shadow-[0px_0px_10px_0px_rgba(0,0,0,0.3)]"></div>
        </div>
    );
};

export default KakaoMapDetail;