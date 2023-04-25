import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const Home = () => {

    const [params] = useSearchParams();
    const id = params.get('session_id');

    const [username, setUsername] = useState('');
    const [price, setPrice] = useState(0);

    const navigate = useNavigate();

    const handleToken = async () => {
        const response = await fetch('http://localhost:3008/api/create-checkout-session', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                cart: 4,
                email: 'rizwan.bhavnagri0411@gmail.com',
                id: '12453'
            })
        });

        let data = await response.json();
        console.log(data);
        console.log(data.url);
        window.location.href = data.url;
    };

    useEffect(async () => {
        if (id) {
            const response = await fetch(`http://localhost:3008/api/verify-payment/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            let data = await response.json();
            console.log(data);
            navigate("/user");
        }
    }, [id]);

    return (
        <div>
            <input type="text" placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
            <input type="number" placeholder="Price" onChange={(e) => setPrice(e.target.value)} />
            <button onClick={handleToken}></button>
        </div>
    );
}

export default Home;
