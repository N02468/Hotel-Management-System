import React from 'react';

function Navbar() {
    // Define the logout function with proper syntax
    function logout() {
        localStorage.removeItem('currentUser');
        window.location.href = '/login';
    }

    // Safely parse the user data
    const user = (() => {
        try {
            const storedUser = localStorage.getItem('currentUser');
            return storedUser ? JSON.parse(storedUser) : null; // Return parsed user or null
        } catch (error) {
            console.error('Error parsing user data:', error);
            return null;
        }
    })();

    return (
        <div>
            <nav className="navbar navbar-expand-lg">
                <div className="container-fluid">
                    <a className="navbar-brand" href="#">LuxuryStay Hospitality</a>
                    <button
                        className="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarNav"
                        aria-controls="navbarNav"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon"><i class="fa-solid fa-bars" style={{"color":"white"}}></i></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav ms-auto">
                            {user ? (
                                <>
                                    <div className="dropdown mr-5" style={{ marginRight: '60px' }}>
                                        <button
                                            className="btn btn-secondary dropdown-toggle"
                                            type="button"
                                            data-bs-toggle="dropdown"
                                            aria-expanded="false"
                                        >
                                         <i className='fa fa-user'></i>   {user.name}
                                        </button>
                                        <ul className="dropdown-menu">
                                            <li>
                                                <a className="dropdown-item" href="/profile">
                                                Profile
                                                </a>
                                            </li>
                                            <li>
                                                <a className="dropdown-item" href="#" onClick={logout}>
                                                    Logout
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <li className="nav-item">
                                        <a className="nav-link active" aria-current="page" href="/login">Login</a>
                                    </li>
                                    <li className="nav-item">
                                        <a className="nav-link" href="/register">Register</a>
                                    </li>
                                </>
                            )}
                        </ul>
                    </div>
                </div>
            </nav>
        </div>
    );
}

export default Navbar;
