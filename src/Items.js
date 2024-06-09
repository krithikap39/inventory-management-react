import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Items = ({ onSelectItem }) => {
    const [items, setItems] = useState([]);

    useEffect(() => {
        axios.get('https://localhost:7190/items')
            .then(response => {
                if (response.status === 200) {
                    setItems(response.data.results);
                }
            })
            .catch(error => console.error('Error fetching items:', error));
    }, []);

    return (
        <div>
            <h2>Items List</h2>
            <table className="table table-hover">
                <thead>
                    <tr>
                        <th>Item ID</th>
                        <th>Name</th>
                        <th>Code</th>
                        <th>Measuring Unit</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map(item => (
                        <tr key={item.itemId} onClick={() => onSelectItem(item)} style={{ cursor: 'pointer' }}>
                            <td>{item.itemId}</td>
                            <td>{item.name}</td>
                            <td>{item.code}</td>
                            <td>{item.measuringUnitName}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Items;
