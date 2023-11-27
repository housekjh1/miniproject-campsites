import { Box, Modal, Typography } from '@mui/material';
import { useEffect, useState } from 'react'
import { TEAnimation } from 'tw-elements-react';

const KakaoMapError = () => {
    const [open, setOpen] = useState(true);
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

        const timer = setTimeout(() => {
            setOpen(false);
        }, 1000);

        return () => clearTimeout(timer);

    }, []);

    return (
        <div>
            <div id="map" className="mt-5 h-[32.25rem] sm:h-[39.125rem] md:h-[39.125rem] rounded shadow-[0px_0px_10px_0px_rgba(0,0,0,0.3)]"></div>

            <Modal
                open={open}
                onClose={() => setOpen(false)}
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
            >
                <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 300, bgcolor: 'background.paper', border: '2px solid #000', p: 2 }}>
                    <TEAnimation
                        animation="[shake_0.5s]"
                        start="onLoad"
                    >
                        검색결과가 없습니다.
                    </TEAnimation>
                </Box>
            </Modal>

        </div>
    )
}

export default KakaoMapError