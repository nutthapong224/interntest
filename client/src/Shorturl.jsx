import React, { useState } from 'react';
import axios from 'axios';

const URLShortener = () => {
    const [url, setUrl] = useState('');
    const [shortUrl, setShortUrl] = useState('');
    const [qrcode, setQrcode] = useState('');

    const handleUrlChange = (e) => setUrl(e.target.value);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Send URL to the server to shorten
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/shorten`, { url });
            setShortUrl(`${import.meta.env.VITE_API_URL2}/${response.data.shortUrl}`);
        } catch (error) {
            console.error('Error shortening URL:', error);
        }

        // Generate QR Code for the original URL
        try {
            const qrcodeResponse = await axios.post(`${import.meta.env.VITE_API_URL}/generate-qrcode`, { url });
            setQrcode(qrcodeResponse.data.qrcode);
        } catch (error) {
            console.error('Error generating QR code:', error);
        }
    };

    return (
        <div>
            <h1>URL Shortener and QR Code Generator</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="url"
                    value={url}
                    onChange={handleUrlChange}
                    placeholder="Enter URL"
                    required
                />
                <button type="submit">Shorten URL</button>
            </form>

            {shortUrl && (
                <div>
                    <h2>Shortened URL: </h2>
                    <a href={shortUrl} target="_blank" rel="noopener noreferrer">
                        {shortUrl}
                    </a>
                </div>
            )}

            {qrcode && (
                <div>
                    <h2>QR Code: </h2>
                    <img src={qrcode} alt="QR Code" />
                </div>
            )}
        </div>
    );
};

export default URLShortener;
