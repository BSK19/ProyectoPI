import React from 'react';
import { Link } from 'react-router-dom';

const Navigation = () => {
    return (
        <nav className="navigation-menu">
            <ul>
                <li>
                    <Link to="/discover">Discover</Link>
                </li>
                <li>
                    <Link to="/discover?filter=vinyl">Vinyl</Link>
                </li>
                <li>
                    <Link to="/discover?filter=cds">CDs</Link>
                </li>
                <li>
                    <Link to="/discover?filter=cassettes">Cassettes</Link>
                </li>
                <li>
                    <Link to="/discover?filter=tshirts">T Shirts</Link>
                </li>
            </ul>
        </nav>
    );
};

export default Navigation;