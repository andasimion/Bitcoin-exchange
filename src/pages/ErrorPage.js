import React from 'react';

const ErrorPage = () => {
    return (
        <React.Fragment>
            <img src={window.location.origin + '/img/404error.jpg'} alt="404 Page Not Found!" />
        </React.Fragment>
    );
}

export default ErrorPage;