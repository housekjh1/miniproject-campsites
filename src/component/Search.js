import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Success from './Success';
import Failure from './Failure';

const Search = () => {
    const area = useParams().area;
    const [data, setData] = useState();
    const [detailTag, setDetailTag] = useState();

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch(`${process.env.REACT_APP_SERVER_URL}api/search/${area}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': localStorage.getItem("jwt")
                    },
                });
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const datas = await response.json();
                setData(datas);
            } catch (error) {
                console.error(error);
            }
        }
        fetchData();
    }, []);

    useEffect(() => {
        const intervalId = setInterval(() => {
            if (data && data.length > 0) {
                clearInterval(intervalId);
                setDetailTag(<Success data={data} />);
            } else {
                clearInterval(intervalId);
                setDetailTag(<Failure />);
            }
        }, 100);
        return () => clearInterval(intervalId);
    }, [data]);

    return (
        <div>
            {detailTag}
        </div>
    );
}

export default Search
