const LivePrices = () => {
  return (
    <div className="container mt-5 pt-4">
      {/* 1. Header Section */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-dark">Market Terminal</h2>
        <span className="badge bg-success-subtle text-success p-2 px-3 rounded-pill">
          ● Live Updates
        </span>
      </div>

      {/* 2. Quick Summary Cards */}
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="card border-0 shadow-sm rounded-4 p-3 bg-white">
            <small className="text-muted d-block mb-1">Total Market Cap</small>
            <h4 className="fw-bold">$2.56 Trillion</h4>
            <span className="text-success small">↑ 1.2% today</span>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm rounded-4 p-3 bg-white">
            <small className="text-muted d-block mb-1">Top Gainer</small>
            <h4 className="fw-bold text-success">SOL +8.4%</h4>
          </div>
        </div>
      </div>

      {/* 3. The Main Table */}
      <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead className="bg-light">
              <tr>
                <th className="ps-4 py-3">Asset</th>
                <th>Price</th>
                <th>24h Change</th>
                <th className="pe-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {/* Row 1 */}
              <tr>
                <td className="ps-4 py-3 fw-semibold">Bitcoin <span className="text-muted small">BTC</span></td>
                <td>$67,420.00</td>
                <td className="text-success">+2.45%</td>
                <td className="pe-4"><button className="btn btn-sm btn-dark rounded-pill px-3">Trade</button></td>
              </tr>
              {/* Row 2 */}
              <tr>
                <td className="ps-4 py-3 fw-semibold">Ethereum <span className="text-muted small">ETH</span></td>
                <td>$3,520.10</td>
                <td className="text-danger">-0.15%</td>
                <td className="pe-4"><button className="btn btn-sm btn-dark rounded-pill px-3">Trade</button></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Add this at the very bottom of the file
export default LivePrices;