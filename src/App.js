import React, { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [statusFilter, setStatusFilter] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);

  // Fetch data from API
  useEffect(() => {
    setIsLoading(true);
    fetch("https://api.udhhyog.com/v1/test")
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setFilteredData(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Error:", err);
        setIsLoading(false);
      });
  }, []);

  // Highlight search term in text
  const highlightSearchTerm = (text) => {
    if (!search) return text;

    const regex = new RegExp(`(${search})`, "gi");
    return text.toString().split(regex).map((part, i) =>
      regex.test(part) ? <span key={i} className="highlight">{part}</span> : part
    );
  };

  // Apply search + sort + status filter
  useEffect(() => {
    let filtered = [...data];

    // Search filter
    if (search) {
      filtered = filtered.filter((item) =>
        Object.values(item).some((val) =>
          String(val).toLowerCase().includes(search.toLowerCase())
        )
      );
    }

    // Status filter
    if (statusFilter) {
      filtered = filtered.filter((item) =>
        item.status.toLowerCase() === statusFilter.toLowerCase()
      );
    }

    // Sorting
    if (sortField) {
      filtered.sort((a, b) => {
        const aVal = a[sortField];
        const bVal = b[sortField];

        if (sortOrder === "asc") return aVal > bVal ? 1 : -1;
        else return aVal < bVal ? 1 : -1;
      });
    }

    setFilteredData(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [search, sortField, sortOrder, data, statusFilter]);

  // Get current items for pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="App">
      <header className="app-header">
        <h1>Product Dashboard</h1>
        <div className="header-controls">
          <div className="search-box">
            <svg className="search-icon" viewBox="0 0 24 24">
              <path d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 0 0 1.48-5.34c-.47-2.78-2.79-5-5.59-5.34a6.505 6.505 0 0 0-7.27 7.27c.34 2.8 2.56 5.12 5.34 5.59a6.5 6.5 0 0 0 5.34-1.48l.27.28v.79l4.25 4.25c.41.41 1.08.41 1.49 0 .41-.41.41-1.08 0-1.49L15.5 14zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
            </svg>
            <input
              type="text"
              placeholder="Search products..."
              onChange={(e) => setSearch(e.target.value)}
              className="search-input"
            />
          </div>
          <button className="add-button">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 1V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M1 8H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            Add Product
          </button>
        </div>
      </header>

      {/* Filters */}
      <div className="filters-container">
        <div className="filter-group">
          <label>Sort by:</label>
          <select
            onChange={(e) => setSortField(e.target.value)}
            className="styled-select"
          >
            <option value="">Select field</option>
            <option value="product_id">Product ID</option>
            <option value="product_name">Name</option>
            <option value="category">Category</option>
            <option value="price">Price</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Order:</label>
          <select
            onChange={(e) => setSortOrder(e.target.value)}
            className="styled-select"
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Status:</label>
          <select
            onChange={(e) => setStatusFilter(e.target.value)}
            className="styled-select"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="table-container">
        {isLoading ? (
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading products...</p>
          </div>
        ) : currentItems.length === 0 ? (
          <div className="no-results">
            <svg className="empty-icon" viewBox="0 0 24 24">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z" />
              <path d="M12 18c3.31 0 6-2.69 6-6s-2.69-6-6-6-6 2.69-6 6 2.69 6 6 6zm0-10c2.21 0 4 1.79 4 4s-1.79 4-4 4-4-1.79-4-4 1.79-4 4-4z" />
            </svg>
            <h3>No products found</h3>
            <p>Try adjusting your search or filters</p>
          </div>
        ) : (
          <table className="product-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((item) => (
                <tr key={item.product_id} className="table-row">
                  <td className="product-id">
                    <span className="id-badge">{highlightSearchTerm(item.product_id)}</span>
                  </td>
                  <td className="product-name-cell">
                    <div className="product-info">
                      <div className="name">{highlightSearchTerm(item.product_name)}</div>
                    </div>
                  </td>
                  <td>
                    <span className="category-tag">{highlightSearchTerm(item.category)}</span>
                  </td>
                  <td className="price">${highlightSearchTerm(item.price)}</td>
                  <td>
                    <span
                      className={`status-badge ${item.status === "active" ? "active" : "inactive"}`}
                    >
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Table Footer */}
      <div className="table-footer">
        <div className="showing-entries">
          Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredData.length)} of {filteredData.length} entries
        </div>
        <div className="pagination">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className={`page-button ${currentPage === 1 ? 'disabled' : ''}`}
          >
            Previous
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
            <button
              key={number}
              onClick={() => paginate(number)}
              className={`page-button ${currentPage === number ? 'active' : ''}`}
            >
              {number}
            </button>
          ))}

          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`page-button ${currentPage === totalPages ? 'disabled' : ''}`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;