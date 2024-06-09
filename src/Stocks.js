import React from 'react';

const Stocks = ({ stock }) => {
    return (
        <div>
            <h3>Stock Details</h3>
            {stock ? (
                <div>
                    <p>Warehouse: {stock.name}</p>
                    <p>Address: {stock.address}</p>
                    <p>Manager: {stock.manger.name}</p>
                    <p>Email: {stock.manger.email}</p>
                </div>
            ) : (
                <p>Select an item to see stock details.</p>
            )}
        </div>
    );
};

export default Stocks;
