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
        let minLng = 999;
        let maxLng = 0;
        data.map(item => {
            initLat += item.lat;
            initLng += item.lng;
            if (item.lat < minLat) minLat = item.lat;
            if (item.lat > maxLat) maxLat = item.lat;
            if (item.lng < minLng) minLng = item.lng;
            if (item.lng > maxLng) maxLng = item.lng;
        });
        initLat /= data.length;
        initLng /= data.length;
        const subLat = maxLat - minLat;
        const subLng = maxLng - minLng;
        console.log(subLat, subLng);

        const onLoadKakaoMap = () => {
            window.kakao.maps.load(() => {
                const mapContainer = document.getElementById('map');

                const mapOption = {
                    center: new window.kakao.maps.LatLng(initLat, initLng),
                    level: ((data.length === 1) || (subLat < 0.0015)) ? 2 : (subLat < 0.035) ? 7 : (subLat < 0.067) ? 8 : (subLat < 0.377 && subLng < 1.2) ? 10 : (subLat < 0.585 && subLng < 1.66) ? 11 : (subLat < 1.165 && subLng < 1.66) ? 12 : 13
                };

                let map = new window.kakao.maps.Map(mapContainer, mapOption);

                let mapTypeControl = new window.kakao.maps.MapTypeControl();
                map.addControl(mapTypeControl, window.kakao.maps.ControlPosition.TOPRIGHT);

                const positions = data.map(item => ({
                    content: `<div>${item.campName}</div>`,
                    latlng: new window.kakao.maps.LatLng(item.lat, item.lng),
                    camp: item.campName
                }));

                for (let i = 0; i < positions.length; i++) {
                    let marker = new window.kakao.maps.Marker({
                        map: map,
                        position: positions[i].latlng
                    });

                    let content = document.createElement('div');
                    content.innerHTML = positions[i].content;
                    content.style.cssText = 'background-color: rgb(255 255 255); border-style: dashed; border-width: 2px; border-color: rgb(245 158 11); border-radius: 0.25rem; padding-left: 0.5rem; padding-right: 0.5rem; padding-top: 0.25rem; padding-bottom: 0.25rem; color: rgb(100 116 139); font-weight: 700;';

                    let customOverlay = new window.kakao.maps.CustomOverlay({
                        map: null,
                        position: positions[i].latlng,
                        content: content,
                        yAnchor: 2.25
                    });

                    new window.kakao.maps.event.addListener(marker, 'mouseover', makeOverListener(map, customOverlay));
                    new window.kakao.maps.event.addListener(marker, 'mouseout', makeOutListener(customOverlay));

                    // 마커에 클릭이벤트를 등록합니다
                    new window.kakao.maps.event.addListener(marker, 'click', makeClickListener());

                    function makeClickListener() {
                        return function () {
                            window.location.href = `/campsite/${area}/${positions[i].camp}`;
                        };
                    }
                }

                function makeOverListener(map, customOverlay) {
                    return function () {
                        customOverlay.setMap(map);
                    };
                }

                function makeOutListener(customOverlay) {
                    return function () {
                        customOverlay.setMap(null);
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