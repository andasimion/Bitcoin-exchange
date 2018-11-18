import React from 'react';

const Error404 = () => {
    return (
        <React.Fragment>
            <img src={window.location.origin + '/img/404error.jpg'} alt="404 Page Not Found!" />
        </React.Fragment>
    );
}

export default Error404;