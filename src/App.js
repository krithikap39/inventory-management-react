import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
    const [items, setItems] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [newItem, setNewItem] = useState({
        name: '',
        code: '',
        measuringUnitId: ''
    });

    const measuringUnits = [
        { id: 4, name: 'Kilogram' },
        { id: 5, name: 'Litres' },
        { id: 6, name: 'Piece' },
        { id: 7, name: 'Dozen' },
        { id: 8, name: 'Packet' },
        { id: 9, name: 'Pairs' }
    ];

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = () => {
        axios.get('https://75hqr63w2k.execute-api.ap-southeast-1.amazonaws.com/production/items')
            .then(response => {
                if (response.status === 200) {
                    setItems(response.data.results);
                }
            })
            .catch(error => console.error('Error fetching items:', error));
    };

    const handleSelectItem = (itemId) => {
        axios.get(`https://75hqr63w2k.execute-api.ap-southeast-1.amazonaws.com/production/items/${itemId}`)
            .then(response => {
                if (response.status === 200) {
                    setSelectedItem(response.data.results);
                }
            })
            .catch(error => console.error('Error fetching item details:', error));
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setNewItem({
            ...newItem,
            [name]: name === 'measuringUnitId' ? parseInt(value) : value
        });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log('Submitting:', newItem);

        axios.post('http://test-alb-3-1408276632.ap-southeast-1.elb.amazonaws.com/items', newItem)
            .then(response => {
                console.log("Response from POST request:", response);
                if (response.status === 200 || response.status === 201) {
                    fetchItems();
                    setShowModal(false);
                    setNewItem({ name: '', code: '', measuringUnitId: '' });  // Reset form
                }
            })
            .catch(error => {
                console.error('Error posting item:', error);
                if (error.response) {
                    console.log("Error response data:", error.response.data);
                    console.log("Error response status:", error.response.status);
                    console.log("Error response headers:", error.response.headers);
                } else if (error.request) {
                    console.log("Error request:", error.request);
                } else {
                    console.log("Error message:", error.message);
                }
            });
    };

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center">
                <h2>Inventory Items</h2>
                <button className="btn btn-primary" onClick={() => setShowModal(true)}>Add Item</button>
            </div>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>Item ID</th>
                        <th>Name</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map(item => (
                        <tr key={item.itemId}>
                            <td>{item.itemId}</td>
                            <td>{item.name}</td>
                            <td>
                                <button className="btn btn-primary" onClick={() => handleSelectItem(item.itemId)}>
                                    Get Items
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {selectedItem && (
                <div>
                    <h4>Item Details for Item ID: {selectedItem.itemId}</h4>
                    <table className="table table-bordered">
                        <tbody>
                            <tr>
                                <th>Item ID</th>
                                <td>{selectedItem.itemId}</td>
                            </tr>
                            <tr>
                                <th>Name</th>
                                <td>{selectedItem.name}</td>
                            </tr>
                            <tr>
                                <th>Code</th>
                                <td>{selectedItem.code}</td>
                            </tr>
                            <tr>
                                <th>Measuring Unit</th>
                                <td>{selectedItem.measuringUnitName}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            )}
            {showModal && (
                <div className="modal show d-block" tabIndex="-1">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Add New Item</h5>
                                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label className="form-label">Name</label>
                                        <input type="text" className="form-control" name="name" value={newItem.name} onChange={handleInputChange} required />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Code</label>
                                        <input type="text" className="form-control" name="code" value={newItem.code} onChange={handleInputChange} required />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Measuring Unit</label>
                                        <select className="form-select" name="measuringUnitId" value={newItem.measuringUnitId} onChange={handleInputChange} required>
                                            <option value="">Select Unit</option>
                                            {measuringUnits.map(unit => (
                                                <option key={unit.id} value={unit.id}>{unit.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <button type="submit" className="btn btn-primary">Submit</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default App;
