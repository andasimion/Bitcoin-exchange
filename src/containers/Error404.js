import React from 'react';

const Error404 = () => {
    return (
        <React.Fragment>
            <img srcset={`${window.location.origin}/img/404error.jpg 1x`} alt="404 Page Not Found!" />
        </React.Fragment>
    );
}

export default Error404;